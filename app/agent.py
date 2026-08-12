"""Park Armada — AI support agent for drivers.

Hybrid approach:
1) BM25 intent retrieval over curated knowledge (from bot3.doc + park-armada.ru)
2) Optional LLM (OpenAI / DeepSeek / any OpenAI-compatible) for natural phrasing
3) Offline fallback: return exact manager-style answers without API keys

Channels: Web chat, Telegram, MAX (webhook stub).
"""

from __future__ import annotations

import hashlib
import re
import time
import uuid
from dataclasses import dataclass, field
from typing import Any

from app.config import settings
from app.knowledge import KnowledgeBase
from app.providers import LLMProvider, get_provider


GREETING_RE = re.compile(
    r"^\s*(здравствуйте|добрый\s+(день|вечер|утро)|привет|хай|hello|hi)[.!]?\s*$",
    re.I,
)


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
    history: list[Turn] = field(default_factory=list)


class SessionStore:
    def __init__(self) -> None:
        self._sessions: dict[str, Session] = {}

    def get(self, session_id: str | None) -> Session:
        if session_id and session_id in self._sessions:
            return self._sessions[session_id]
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
            if not sess.offered_upsell and best["id"] not in {"thanks", "refuse", "greeting"}:
                # lightly mark upsell opportunity for analytics; content already in templates when relevant
                sess.offered_upsell = True
            self._update_slots(sess, text, best["id"])
            sess.history.append(Turn("assistant", answer))
            return self._pack(sess, answer, best["id"], confidence, mode, hits)

        # LLM RAG path
        if self.provider.enabled:
            kb_block = self.kb.format_hits(hits) if hits else self.kb.format_all_brief()
            history = [{"role": t.role, "content": t.content} for t in sess.history[-8:]]
            system = (
                SYSTEM_PROMPT
                + f"\n\nКанал: {channel}\nУже здоровались: {sess.greeted}\nАгрегатор в слоте: {sess.aggregator}\n"
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
            sess.history.append(Turn("assistant", answer))
            return self._pack(sess, answer, best["id"], confidence, "intent-fallback", hits)

        answer = (
            "Уточните, пожалуйста, детали: Яндекс Такси / Доставка или DRIVEE, и что именно нужно "
            "(подключение, вывод, ФГИС, ОСГОП). Можете прислать скриншот — разберёмся. "
            "Также пишите на сайте https://park-armada.ru/ или по телефону +7 918 052-10-22 (8:00–21:00 Мск)."
        )
        if not sess.greeted:
            answer = "Здравствуйте! " + answer
            sess.greeted = True
        sess.history.append(Turn("assistant", answer))
        return self._pack(sess, answer, None, confidence, "clarify", hits)

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
        if "ип" in low.split() or "ип" in low:
            sess.employment = "ip"
        if "трудов" in low:
            sess.employment = "labor"
        if intent_id.startswith("drivee"):
            sess.aggregator = "drivee"
        if intent_id.startswith("yandex"):
            sess.aggregator = "yandex"

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
            "hits": [
                {"id": h["id"], "name": h["name"], "score": round(h["score"], 4)} for h in (hits or [])[:3]
            ],
        }


def fingerprint_kb(path: str) -> str:
    data = open(path, "rb").read()
    return hashlib.sha256(data).hexdigest()[:12]
