"""Park Armada — AI support agent for drivers.

Hybrid approach:
1) BM25 intent retrieval over curated knowledge (from bot3.doc + park-armada.ru)
2) Optional LLM (OpenAI / DeepSeek / any OpenAI-compatible) for natural phrasing
3) Offline fallback: return exact manager-style answers without API keys
4) Multi-turn clarifications (pending slots) — from Claude review

Channels: Web chat, Telegram, MAX (webhook stub).
"""

from __future__ import annotations

import hashlib
import json
import re
import time
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from app.config import settings
from app.knowledge import KnowledgeBase
from app.providers import LLMProvider, get_provider

ROOT = Path(__file__).resolve().parents[1]
MISSES_PATH = ROOT / "data" / "misses.jsonl"

GREETING_RE = re.compile(
    r"^\s*(здравствуйте|добрый\s+(день|вечер|утро)|привет|хай|hello|hi)[.!]?\s*$",
    re.I,
)

CLARIFY_PENDING = {
    "withdraw_clarify": "withdraw",
    "transfer_problem_clarify": "transfer",
    "connect_yandex_taxi": "connect",
    "fgis_license": "fgis",
    "get_first_order": "registered",
    "carrier_registry": "carrier_fgis",
}

CLARIFY_ROUTES = {
    "withdraw": {"yandex": "yandex_withdraw", "drivee": "drivee_withdraw_how"},
    "transfer": {"yandex": "yandex_withdraw", "drivee": "drivee_withdraw_fail"},
    "connect": {"1": "park_selfemployed", "2": "labor_contract", "3": "park_ip",
                "smz": "park_selfemployed", "labor": "labor_contract", "ip": "park_ip"},
    "registered": {"yes": "contacts", "no": "connect_yandex_taxi"},
    "carrier_fgis": {"yes": "car_already_in_registry", "no": "fgis_license"},
}

UPSELL = {
    "connect_yandex_taxi": "\n\nКстати, если планируете официально возить — поможем с реестром ФГИС (3500₽) и ОСГОП (3400₽/год).",
    "park_selfemployed": "\n\nПри необходимости оформим ФГИС (3500₽) и ОСГОП (3400₽/год).",
    "fgis_license": "\n\nМожем сразу оформить и ОСГОП — 3400₽ на год.",
    "delivery_connect": "\n\nЕсли будете возить и такси — подключим и его в одном парке.",
}

SYSTEM_PROMPT = """Ты — менеджер службы поддержки таксопарка «Армада».
Отвечаешь водителям и курьерам в Telegram / MAX / на сайте как живой сотрудник.

Стиль:
- мягкий деловой русский язык;
- коротко и по делу (обычно 1–6 предложений);
- без канцелярита и без выдуманных фактов;
- при первом сообщении в сессии — короткое приветствие;
- если неясно Яндекс или DRIVEE (вывод/перевод денег) — сначала уточни;
- если неясно самозанятый / трудовой / ИП — уточни;
- один раз за диалог ненавязчиво предложи смежные услуги (ФГИС 3500₽, ОСГОП 3400₽, доставка), если уместно;
- если в базе нет ответа — честно скажи, что уточнишь у старшего менеджера, и попроси ФИО + телефон + скрин.

Факты парка (актуально):
- сайт https://park-armada.ru/
- комиссия парка от 1,9% (самозанятый/ИП)
- активация обычно 1,5–2 часа
- поддержка 8:00–21:00 Мск ежедневно
- телефон +7 918 052-10-22
- ФГИС/реестр ТС: 3500₽, обычно 1–3 дня
- ОСГОП: 3400₽ на год
- парки: АРМАДА, ЛЕГИОН, АЗИМУТ
- Достависта — не работаем

Используй ТОЛЬКО факты из блока «База знаний» ниже и сообщения пользователя.
Не выдумывай реквизиты, проценты и сроки."""


@dataclass
class Turn:
    role: str
    content: str
    ts: float = field(default_factory=time.time)


@dataclass
class Session:
    id: str
    greeted: bool = False
    offered_upsell: bool = False
    aggregator: str | None = None  # yandex | drivee
    employment: str | None = None
    pending: str | None = None
    last_seen: float = field(default_factory=time.time)
    history: list[Turn] = field(default_factory=list)


class SessionStore:
    def __init__(self, ttl_sec: int = 3600, max_sessions: int = 5000) -> None:
        self._sessions: dict[str, Session] = {}
        self.ttl_sec = ttl_sec
        self.max_sessions = max_sessions

    def _evict(self) -> None:
        now = time.time()
        dead = [k for k, s in self._sessions.items() if now - s.last_seen > self.ttl_sec]
        for k in dead:
            self._sessions.pop(k, None)
        if len(self._sessions) > self.max_sessions:
            oldest = sorted(self._sessions.items(), key=lambda kv: kv[1].last_seen)
            for k, _ in oldest[: len(self._sessions) - self.max_sessions]:
                self._sessions.pop(k, None)

    def get(self, session_id: str | None) -> Session:
        self._evict()
        if session_id and session_id in self._sessions:
            sess = self._sessions[session_id]
            sess.last_seen = time.time()
            return sess
        sid = session_id or str(uuid.uuid4())
        sess = Session(id=sid)
        self._sessions[sid] = sess
        return sess


class SupportAgent:
    def __init__(self, kb: KnowledgeBase | None = None, provider: LLMProvider | None = None) -> None:
        self.kb = kb or KnowledgeBase()
        self.provider = provider or get_provider()
        self.sessions = SessionStore()

    def reply(self, message: str, session_id: str | None = None, channel: str = "web") -> dict[str, Any]:
        text = (message or "").strip()
        sess = self.sessions.get(session_id)
        if not text:
            return {
                "session_id": sess.id,
                "reply": "Напишите, пожалуйста, ваш вопрос — подскажем по подключению, выводу средств или документам.",
                "intent_id": None,
                "mode": "empty",
                "provider": self.provider.name,
            }

        sess.history.append(Turn("user", text))

        # Multi-turn: resolve pending clarification first (Claude recommendation)
        resolved_id = self._resolve_pending(sess, text)
        if resolved_id:
            intent = self.kb.get(resolved_id)
            if intent:
                answer = intent["answer"]
                answer = self._maybe_upsell(sess, resolved_id, answer)
                self._update_slots(sess, text, resolved_id)
                sess.pending = None
                sess.history.append(Turn("assistant", answer))
                return self._pack(sess, answer, resolved_id, 99.0, "pending-resolve")

        hits = self.kb.search(text, top_k=4)
        best = hits[0] if hits else None
        confidence = float(best["score"]) if best else 0.0

        # Exact greeting short-circuit
        if GREETING_RE.match(text) and not sess.greeted:
            intent = self.kb.get("greeting")
            answer = intent["answer"] if intent else "Здравствуйте! Парк «АРМАДА» на связи. Чем помочь?"
            sess.greeted = True
            sess.history.append(Turn("assistant", answer))
            return self._pack(sess, answer, "greeting", confidence, "intent")

        # High-confidence intent → manager template (optionally polished by LLM)
        if best and confidence >= settings.intent_threshold:
            answer = best["answer"]
            if not sess.greeted:
                answer = self._with_greeting(answer)
                sess.greeted = True
            mode = "intent"
            if self.provider.enabled and settings.polish_with_llm:
                answer = self.provider.chat(
                    system=SYSTEM_PROMPT
                    + "\n\nПереформулируй ответ менеджера естественно, сохранив все факты, ссылки и реквизиты без изменений. Не добавляй ничего нового.",
                    messages=[
                        {"role": "user", "content": f"Вопрос водителя: {text}\n\nЭталонный ответ:\n{best['answer']}"}
                    ],
                    temperature=0.3,
                ) or answer
                mode = "intent+llm"
            answer = self._maybe_upsell(sess, best["id"], answer)
            if best["id"] in CLARIFY_PENDING:
                sess.pending = CLARIFY_PENDING[best["id"]]
            self._update_slots(sess, text, best["id"])
            sess.history.append(Turn("assistant", answer))
            return self._pack(sess, answer, best["id"], confidence, mode, hits)

        # LLM RAG path
        if self.provider.enabled:
            kb_block = self.kb.format_hits(hits) if hits else self.kb.format_all_brief()
            history = [{"role": t.role, "content": t.content} for t in sess.history[-8:]]
            system = (
                SYSTEM_PROMPT
                + f"\n\nКанал: {channel}\nУже здоровались: {sess.greeted}\n"
                + f"Агрегатор: {sess.aggregator}\nЗанятость: {sess.employment}\nОжидаем уточнение: {sess.pending}\n"
                + f"\nБаза знаний:\n{kb_block}"
            )
            answer = self.provider.chat(system=system, messages=history, temperature=0.4)
            if answer:
                if not sess.greeted:
                    sess.greeted = True
                sess.history.append(Turn("assistant", answer))
                return self._pack(sess, answer, best["id"] if best else None, confidence, "rag+llm", hits)

        # Offline fallback
        if best:
            answer = best["answer"]
            if not sess.greeted:
                answer = self._with_greeting(answer)
                sess.greeted = True
            if best["id"] in CLARIFY_PENDING:
                sess.pending = CLARIFY_PENDING[best["id"]]
            sess.history.append(Turn("assistant", answer))
            return self._pack(sess, answer, best["id"], confidence, "intent-fallback", hits)

        self._log_miss(text, sess, confidence)
        answer = (
            "Уточните, пожалуйста, детали: Яндекс Такси / Доставка или DRIVEE, и что именно нужно "
            "(подключение, вывод, ФГИС, ОСГОП). Можете прислать скриншот, ФИО и телефон — "
            "передам старшему менеджеру при необходимости. "
            "Сайт https://park-armada.ru/ · тел. +7 918 052-10-22 (8:00–21:00 Мск)."
        )
        if not sess.greeted:
            answer = "Здравствуйте! " + answer
            sess.greeted = True
        sess.history.append(Turn("assistant", answer))
        return self._pack(sess, answer, None, confidence, "clarify", hits)

    def _resolve_pending(self, sess: Session, text: str) -> str | None:
        if not sess.pending:
            return None
        low = text.lower().replace("ё", "е").strip()
        route = CLARIFY_ROUTES.get(sess.pending, {})

        if sess.pending in {"withdraw", "transfer"}:
            if re.search(r"яндекс|yandex", low):
                return route.get("yandex")
            if re.search(r"drivee|драйв", low):
                return route.get("drivee")
            return None

        if sess.pending == "connect":
            if re.match(r"^[123]\b", low) or low in {"1", "2", "3"}:
                return route.get(low[0])
            if re.search(r"самозанят", low):
                return route.get("smz")
            if re.search(r"трудов", low):
                return route.get("labor")
            if re.search(r"\bип\b", low):
                return route.get("ip")
            return None

        if sess.pending in {"registered", "carrier_fgis"}:
            if re.search(r"\b(да|уже|есть|зарегистрирован)\b", low):
                return route.get("yes")
            if re.search(r"\b(нет|не\s+ещё|не\s+еще|не\s+зарегистрир)\b", low):
                return route.get("no")
            return None

        if sess.pending == "fgis":
            # keep pending; let BM25 handle region/details unless empty
            return None

        return None

    def _maybe_upsell(self, sess: Session, intent_id: str, answer: str) -> str:
        if sess.offered_upsell:
            return answer
        extra = UPSELL.get(intent_id)
        if extra:
            answer = answer + extra
            sess.offered_upsell = True
        elif intent_id not in {"thanks", "refuse", "greeting"}:
            sess.offered_upsell = True  # consume opportunity without forcing text
        return answer

    def _with_greeting(self, answer: str) -> str:
        if GREETING_RE.match(answer.split("\n", 1)[0]):
            return answer
        return "Здравствуйте! " + answer

    def _update_slots(self, sess: Session, text: str, intent_id: str) -> None:
        low = text.lower()
        if "drivee" in low or "драйв" in low:
            sess.aggregator = "drivee"
        if "яндекс" in low or "yandex" in low:
            sess.aggregator = "yandex"
        if "самозанят" in low:
            sess.employment = "smz"
        if re.search(r"\bип\b", low):
            sess.employment = "ip"
        if "трудов" in low:
            sess.employment = "labor"
        if intent_id.startswith("drivee"):
            sess.aggregator = "drivee"
        if intent_id.startswith("yandex"):
            sess.aggregator = "yandex"

    def _log_miss(self, text: str, sess: Session, confidence: float) -> None:
        try:
            MISSES_PATH.parent.mkdir(parents=True, exist_ok=True)
            rec = {"ts": time.time(), "session": sess.id, "q": text, "confidence": confidence}
            with MISSES_PATH.open("a", encoding="utf-8") as f:
                f.write(json.dumps(rec, ensure_ascii=False) + "\n")
        except OSError:
            pass

    def _pack(
        self,
        sess: Session,
        reply: str,
        intent_id: str | None,
        confidence: float,
        mode: str,
        hits: list[dict] | None = None,
    ) -> dict[str, Any]:
        return {
            "session_id": sess.id,
            "reply": reply,
            "intent_id": intent_id,
            "confidence": round(confidence, 4),
            "mode": mode,
            "provider": self.provider.name,
            "pending": sess.pending,
            "hits": [
                {"id": h["id"], "name": h["name"], "score": round(h["score"], 4)} for h in (hits or [])[:3]
            ],
        }


def fingerprint_kb(path: str) -> str:
    data = open(path, "rb").read()
    return hashlib.sha256(data).hexdigest()[:12]
