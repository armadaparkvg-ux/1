#!/usr/bin/env python3
"""
Парк АРМАДА — AI support bot + amoCRM.
Поток: intent detection -> KB retrieval -> CRM escalation -> response generation.

Точки расширения (вынести в модули):
  config / models / intents / knowledge / dialog / crm / channels / bot
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import os
import re
import time
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Awaitable, Callable, Dict, List, Optional, Sequence, Tuple
from urllib import error as urlerror
from urllib import request as urlrequest

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("armada.support_bot")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------


@dataclass
class BotConfig:
    """Конфиг из env. Токены — только из окружения."""

    company_name: str = "АРМАДА"
    timezone: str = "Europe/Moscow"
    work_hours: str = "8:00–21:00 Мск"
    support_phone: str = "+79180521022"
    payment_phone: str = "+79180414441"
    payment_recipient: str = "Виктор И. ОЗОН-банк"
    license_price: int = 3500
    osgo_price: int = 3400
    intent_confidence_threshold: float = 0.42
    clarify_confidence_threshold: float = 0.28
    services_offer_once: bool = True
    yandex_kb_url: str = "https://pro.yandex.ru/ru-ru/moskva/knowledge-base"
    auto_requirements_url: str = "https://disk.yandex.ru/i/VfibcHWg_MuMZQ"
    amo_base_url: str = field(default_factory=lambda: os.getenv("AMO_BASE_URL", "").rstrip("/"))
    amo_access_token: str = field(default_factory=lambda: os.getenv("AMO_ACCESS_TOKEN", ""))
    amo_pipeline_id: Optional[int] = field(
        default_factory=lambda: int(os.getenv("AMO_PIPELINE_ID")) if os.getenv("AMO_PIPELINE_ID") else None
    )
    amo_status_id: Optional[int] = field(
        default_factory=lambda: int(os.getenv("AMO_STATUS_ID")) if os.getenv("AMO_STATUS_ID") else None
    )
    amo_responsible_user_id: Optional[int] = field(
        default_factory=lambda: int(os.getenv("AMO_RESPONSIBLE_USER_ID"))
        if os.getenv("AMO_RESPONSIBLE_USER_ID")
        else None
    )
    amo_phone_field_id: Optional[int] = field(
        default_factory=lambda: int(os.getenv("AMO_PHONE_FIELD_ID")) if os.getenv("AMO_PHONE_FIELD_ID") else None
    )
    amo_dry_run: bool = field(
        default_factory=lambda: os.getenv("AMO_DRY_RUN", "1").lower() in {"1", "true", "yes"}
    )
    amo_max_retries: int = 3
    amo_retry_base_delay: float = 0.8
    kb_path: str = field(default_factory=lambda: os.getenv("BOT_KB_PATH", "bot.txt"))

    @classmethod
    def from_env(cls) -> "BotConfig":
        return cls()


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------


class Intent(str, Enum):
    GREETING = "greeting"
    FAQ = "faq"
    CONNECTION = "connection"
    TARIFFS = "tariffs"
    DOCUMENTS = "documents"
    SELF_EMPLOYED = "self_employed"
    EMPLOYMENT_CONTRACT = "employment_contract"
    FGIS_LICENSE = "fgis_license"
    TRANSPORT_REGISTRY = "transport_registry"
    CARRIER_REGISTRY = "carrier_registry"
    OSGO = "osgo"
    ROUTE_SHEETS = "route_sheets"
    PAYMENTS = "payments"
    WITHDRAW_DRIVEE = "withdraw_drivee"
    WITHDRAW_YANDEX = "withdraw_yandex"
    BONUS_DRIVEE = "bonus_drivee"
    PARTNER_CHANGE = "partner_change"
    CAR_CHANGE = "car_change"
    BLOCK_ISSUE = "block_issue"
    COMPLAINT = "complaint"
    MANAGER_REQUEST = "manager_request"
    UNKNOWN = "unknown"


HIGH_RISK_INTENTS = {
    Intent.BLOCK_ISSUE,
    Intent.COMPLAINT,
    Intent.MANAGER_REQUEST,
}

ESCALATE_ON_UNKNOWN = True


class Aggregator(str, Enum):
    UNKNOWN = "unknown"
    YANDEX = "yandex"
    DRIVEE = "drivee"


class Priority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"


@dataclass
class ContactData:
    name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    car: Optional[str] = None
    employment_status: Optional[str] = None
    partner_name: Optional[str] = None
    region: Optional[str] = None

    def merge(self, other: "ContactData") -> None:
        for key in ("name", "phone", "city", "car", "employment_status", "partner_name", "region"):
            value = getattr(other, key)
            if value:
                setattr(self, key, value)

    def as_dict(self) -> Dict[str, Any]:
        return {k: v for k, v in asdict(self).items() if v}


@dataclass
class DialogMessage:
    role: str  # user | bot | system
    text: str
    intent: Optional[str] = None
    ts: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass
class DialogState:
    dialog_id: str
    channel: str = "cli"
    source: str = "support_bot"
    external_user_id: Optional[str] = None
    greeted: bool = False
    aggregator_asked: bool = False
    aggregator: Aggregator = Aggregator.UNKNOWN
    services_offered: bool = False
    awaiting_clarification: Optional[str] = None
    fgis_type: Optional[str] = None  # transport | carrier
    contact: ContactData = field(default_factory=ContactData)
    tags: List[str] = field(default_factory=list)
    history: List[DialogMessage] = field(default_factory=list)
    amo_contact_id: Optional[int] = None
    amo_lead_id: Optional[int] = None
    last_intent: Optional[Intent] = None
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def summary(self, max_turns: int = 8) -> str:
        lines = []
        for msg in self.history[-max_turns:]:
            lines.append(f"{msg.role}: {msg.text}")
        return "\n".join(lines)

    def add_tags(self, *tags: str) -> None:
        for tag in tags:
            if tag and tag not in self.tags:
                self.tags.append(tag)


@dataclass
class KBEntry:
    intent: Intent
    triggers: List[str]
    response: str
    follow_up: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    needs_aggregator: bool = False
    needs_fgis_type: bool = False
    escalate: bool = False
    priority: Priority = Priority.NORMAL
    weight: float = 1.0


@dataclass
class IntentMatch:
    intent: Intent
    confidence: float
    entry: Optional[KBEntry] = None
    matched_trigger: Optional[str] = None


@dataclass
class CRMPayload:
    name: Optional[str]
    phone: Optional[str]
    source: str
    channel: str
    intent: str
    question_text: str
    dialog_summary: str
    tags: List[str]
    priority: str
    aggregator: Optional[str] = None
    city: Optional[str] = None
    extra: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        return data


@dataclass
class BotResponse:
    text: str
    intent: Intent
    confidence: float
    tags: List[str] = field(default_factory=list)
    escalate: bool = False
    crm_payload: Optional[CRMPayload] = None
    clarifications: List[str] = field(default_factory=list)
    meta: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "text": self.text,
            "intent": self.intent.value,
            "confidence": self.confidence,
            "tags": self.tags,
            "escalate": self.escalate,
            "crm_payload": self.crm_payload.to_dict() if self.crm_payload else None,
            "clarifications": self.clarifications,
            "meta": self.meta,
        }


IncomingHandler = Callable[[str, Dict[str, Any]], Awaitable[BotResponse]]

# ---------------------------------------------------------------------------
# Text utils
# ---------------------------------------------------------------------------

_PHONE_RE = re.compile(
    r"(?:\+?7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}"
)
_NAME_RE = re.compile(
    r"(?:меня зовут|мое имя|моё имя|фио[:\s]+)\s*([А-ЯЁA-Z][а-яёa-z]+(?:\s+[А-ЯЁA-Z][а-яёa-z]+){0,2})",
    re.IGNORECASE,
)
_CITY_RE = re.compile(
    r"(?:город|г\.)\s*([А-ЯЁA-Z][а-яёa-z\-]+)",
    re.IGNORECASE,
)


_SYNONYMS = (
    (r"\bдрайви\b", "drivee"),
    (r"\bдрайв\b", "drivee"),
    (r"\bмозен\b", "mozen"),
    (r"\bджамп\b", "jump"),
    (r"\bяндекс такси\b", "yandex"),
    (r"\bяндексе\b", "yandex"),
    (r"\bяндекса\b", "yandex"),
    (r"\bяндекс\b", "yandex"),
)


def normalize_text(text: str) -> str:
    text = text.strip().lower().replace("ё", "е")
    text = re.sub(r"[«»\"'`]", "", text)
    text = re.sub(r"[^\w\s\+\-/.:]", " ", text, flags=re.UNICODE)
    text = re.sub(r"\s+", " ", text)
    for pattern, repl in _SYNONYMS:
        text = re.sub(pattern, repl, text)
    return text.strip()


def tokenize(text: str) -> List[str]:
    return [t for t in re.split(r"\s+", normalize_text(text)) if t]


def normalize_phone(raw: str) -> Optional[str]:
    digits = re.sub(r"\D", "", raw)
    if len(digits) == 11 and digits.startswith(("7", "8")):
        return "7" + digits[1:]
    if len(digits) == 10:
        return "7" + digits
    if len(digits) == 11 and digits.startswith("7"):
        return digits
    return None


def extract_phone(text: str) -> Optional[str]:
    match = _PHONE_RE.search(text)
    if not match:
        return None
    return normalize_phone(match.group(0))


def extract_contact_fields(text: str) -> ContactData:
    phone = extract_phone(text)
    name = None
    m = _NAME_RE.search(text)
    if m:
        name = m.group(1).strip()
    city = None
    c = _CITY_RE.search(text)
    if c:
        city = c.group(1).strip()
    car = None
    if re.search(r"\b(стс|авто|машин[аыуе]|автомобил)", text, re.IGNORECASE):
        car_match = re.search(r"([А-ЯA-Z]\d{3}[А-ЯA-Z]{2}\d{2,3})", text.upper())
        if car_match:
            car = car_match.group(1)
    status = None
    low = normalize_text(text)
    if "самозанят" in low:
        status = "self_employed"
    elif "трудов" in low or "тд" in low:
        status = "employment_contract"
    elif re.search(r"\bип\b", low):
        status = "ip"
    return ContactData(name=name, phone=phone, city=city, car=car, employment_status=status)


def split_paragraphs(text: str, max_chars: int = 420) -> str:
    """Аккуратно разбивает длинный ответ на абзацы."""
    text = text.strip()
    if len(text) <= max_chars:
        return text
    parts = re.split(r"\n+", text)
    rebuilt: List[str] = []
    buf = ""
    for part in parts:
        part = part.strip()
        if not part:
            continue
        if not buf:
            buf = part
        elif len(buf) + len(part) + 1 <= max_chars:
            buf = f"{buf}\n{part}"
        else:
            rebuilt.append(buf)
            buf = part
    if buf:
        rebuilt.append(buf)
    return "\n\n".join(rebuilt)


def jaccard(a: Sequence[str], b: Sequence[str]) -> float:
    sa, sb = set(a), set(b)
    if not sa or not sb:
        return 0.0
    return len(sa & sb) / len(sa | sb)


def phrase_score(normalized_message: str, trigger: str) -> float:
    nt = normalize_text(trigger)
    if not nt:
        return 0.0
    if nt == normalized_message:
        return 1.0
    if nt in normalized_message:
        return 0.92
    # token overlap + substring bonus
    mt, tt = tokenize(normalized_message), tokenize(nt)
    score = jaccard(mt, tt)
    if len(tt) >= 2 and all(t in mt for t in tt):
        score = max(score, 0.85)
    # soft contains of major tokens
    hits = sum(1 for t in tt if t in mt)
    if tt:
        score = max(score, hits / len(tt) * 0.75)
    return score


# ---------------------------------------------------------------------------
# Knowledge base (из bot.txt / встроенные правила)
# ---------------------------------------------------------------------------

SERVICES_OFFER = (
    "Также напоминаем: мы помогаем с полным комплексом услуг — реестр ТС ФГИС, "
    "реестр перевозчиков, ОСГОП, путевые листы, регистрация в парк (самозанятый / "
    "трудовой договор / ИП). Если что-то из этого нужно — напишите."
)

YANDEX_FALLBACK = (
    "По Яндекс Такси могу подсказать по нашей базе. Если нужна более узкая инструкция сервиса, "
    "смотрите также официальную базу: https://pro.yandex.ru/ru-ru/moskva/knowledge-base "
    "или передадим вопрос менеджеру."
)


def build_default_knowledge() -> List[KBEntry]:
    """intent -> triggers -> response -> follow_up -> tags."""
    return [
        KBEntry(
            intent=Intent.GREETING,
            triggers=[
                "здравствуйте", "добрый день", "доброе утро", "добрый вечер",
                "привет", "приветствую", "здравия желаю", "хай", "можно вопрос",
            ],
            response=(
                'Здравствуйте! Парк "АРМАДА" приветствует Вас! '
                "Укажите, какой вид услуги вам необходим: регистрация в сервисе "
                "Яндекс Такси/доставка, оформление реестра ТС ФГИС, реестра перевозчиков "
                "или другие услуги. Также уточните, с каким агрегатором работаете: "
                "Яндекс Такси или DRIVEE?"
            ),
            follow_up="Яндекс Такси или DRIVEE?",
            tags=["greeting", "aggregator"],
            needs_aggregator=True,
        ),
        KBEntry(
            intent=Intent.WITHDRAW_DRIVEE,
            triggers=[
                "деньги не могу перевести", "не могу перевести деньги",
                "проблема с переводом денег", "застрял перевод", "не проходит платеж",
                "как вывести деньги", "вывод средств", "снятие денег", "как вывести деньги:",
            ],
            response="Уточните, в каком сервисе возникла проблема: Яндекс Такси или DRIVEE?",
            follow_up="Яндекс или DRIVEE?",
            tags=["withdraw", "clarify_aggregator"],
            needs_aggregator=True,
            weight=0.9,
        ),
        KBEntry(
            intent=Intent.WITHDRAW_DRIVEE,
            triggers=[
                "не могу вывести деньги с drivee", "не могу вывести деньги с драйви",
                "не получается вывести деньги с drivee", "не выводятся деньги с драйви",
            ],
            response=(
                "Пришлите скриншот проблемы. Также видеоинструкция по выводу средств: "
                "https://amo.si/K/THP3ZB/TFNEOV"
            ),
            follow_up="Пришлите скриншот и ФИО/телефон при необходимости.",
            tags=["withdraw_drivee", "screenshot"],
            escalate=True,
            priority=Priority.HIGH,
        ),
        KBEntry(
            intent=Intent.WITHDRAW_DRIVEE,
            triggers=[
                "как получить деньги за заказ в драйви",
                "как получить деньги за заказ в drivee",
                "здравствуйте как вывести деньги",
                "какая программа нужна для вывода денег",
                "как вывести деньги с drivee",
                "как вывести деньги с драйви",
                "как снять деньги с драйви",
                "вывод средств с drivee",
                "инструкция по выводу",
                "как перевести деньги на карту drivee",
                "mozen", "мозен",
            ],
            response=(
                "Инструкция по выводу средств\n"
                "Здравствуйте, уважаемые водители!\n"
                "Ниже представлена инструкция по выводу денег за заказы, оплаченные безналичными способами.\n"
                "Шаг 1: откройте приложение Drivee.\n"
                "Шаг 2: перейдите в раздел «Оплата».\n"
                "Шаг 3: выберите «Сумма на вывод» и нажмите «Перейти».\n"
                "Здесь вы увидите сумму заказа и время, через которое ваши деньги отобразятся в Mozen.\n"
                "Важно: задержка отображения средств для вывода в Mozen всегда составляет 4 часа после выполнения заказа.\n"
                "Для вывода средств через приложение Mozen:\n"
                "Перейдите по ссылке для скачивания приложения Mozen\n"
                "Android: https://amo.si/K/USCZU3/UQ0MG3\n"
                "iOS: https://amo.si/K/USCZU9/UQ0MG9\n"
                "Если у вас возникли вопросы по выводу средств, напишите нам в этом чате. "
                "Мы работаем с 8:00 до 21:00 Мск."
            ),
            follow_up="Уточните, речь о Drivee, Mozen или JUMP?",
            tags=["withdraw_drivee", "mozen", "instruction"],
        ),
        KBEntry(
            intent=Intent.WITHDRAW_DRIVEE,
            triggers=[
                "почему не пришли деньги за заказ в драйви",
                "почему не пришли деньги за заказ в drivee",
                "деньги за заказ не пришли", "средства не зачислены",
                "заказ выполнил а денег нет", "где мои деньги за поездку",
            ],
            response=(
                "Подскажите, после выполнения заказа прошло 4 часа? "
                "Задержка отображения средств для вывода в Mozen всегда составляет "
                "4 часа после выполнения заказа."
            ),
            tags=["withdraw_drivee", "delay_4h"],
        ),
        KBEntry(
            intent=Intent.WITHDRAW_DRIVEE,
            triggers=[
                "пишет номер зарегистрирован но при этом не даёт вывод",
                "просит заключить договор", "не даёт вывод требует договор",
                "что делать если вывод заблокирован",
            ],
            response="Напишите ваше ФИО, полное название партнера и город — проверю информацию и помогу.",
            follow_up="Нужны ФИО, партнер и город.",
            tags=["withdraw_drivee", "contract_block"],
            escalate=True,
            priority=Priority.HIGH,
        ),
        KBEntry(
            intent=Intent.WITHDRAW_DRIVEE,
            triggers=[
                "почему не могу вывести деньги с драйви",
                "не выводятся деньги", "заблокирован вывод",
            ],
            response=(
                "Напишите ваши: ФИО, название парка и номер телефона, зарегистрированный "
                "в программе, затем дождитесь ответа с информацией."
            ),
            tags=["withdraw_drivee", "escalate_info"],
            escalate=True,
            priority=Priority.HIGH,
        ),
        KBEntry(
            intent=Intent.WITHDRAW_DRIVEE,
            triggers=[
                "не могу зайти в приложение для вывода денег",
                "не могу зайти в приложение для вывода средств",
                "не открывается приложение для вывода",
                "ошибка входа в mozen", "ошибка входа в jump",
            ],
            response="Значит бонус ещё не поступил, ожидайте начисления.",
            tags=["bonus", "app_access"],
        ),
        KBEntry(
            intent=Intent.BONUS_DRIVEE,
            triggers=[
                "как получить бонусы в драйви", "как получить бонусы в drivee",
                "как вывести бонусы", "акции и бонусы", "цели в drivee",
                "вывод бонусов", "jump", "джамп",
            ],
            response=(
                "Как вывести бонусы и цели?\n"
                "JUMP работа — для вывода акций и бонусов.\n"
                "https://play.google.com/store/apps/details?id=ru.jumpwork\n\n"
                "Выплаты по акциям и бонусам производятся через приложение JUMP работа "
                "по вторникам и пятницам после 15:00 по МСК. Доступ в кабинет открывается "
                "после завершения срока акции и выполнения условий сервиса."
            ),
            tags=["bonus_drivee", "jump"],
        ),
        KBEntry(
            intent=Intent.BONUS_DRIVEE,
            triggers=[
                "деньги за бонус не поступили", "бонус не пришел", "не зачислили бонусы",
            ],
            response=(
                "Уточнить о поступлении средств лучше в поддержке Драйви. "
                "Наша ответственность — вывод денег с баланса Mozen и Jump Finance, "
                "а не их зачисление на ваш счет."
            ),
            tags=["bonus_drivee", "not_credited"],
        ),
        KBEntry(
            intent=Intent.PARTNER_CHANGE,
            triggers=[
                "как выбрать партнера", "как сменить партнера", "хочу сменить парк",
                "перейти в другой парк",
            ],
            response=(
                "Отправили видеоинструкцию, как сменить партнера. "
                "Выберите один из наших парков (АРМАДА, ЛЕГИОН, АЗИМУТ): "
                "https://rutube.ru/shorts/4cd42c7846c83f923f9931e49abf3147/"
            ),
            tags=["partner_change"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=[
                "работодатель кто", "драйви или парк", "кто мой работодатель",
                "кто заключает договор",
            ],
            response="Работодатель — Драйви, парк отвечает только за вывод средств с баланса.",
            tags=["faq", "employer"],
        ),
        KBEntry(
            intent=Intent.CONNECTION,
            triggers=[
                "как подключить яндекс такси", "хочу работать в яндекс такси",
                "как можно оформиться к вам в парк", "хочу к вам устроиться",
                "трудоустройство в такси", "как оформиться в ваш парк",
            ],
            response=(
                "Уточните, пожалуйста, какой вид занятости Вам подходит:\n"
                "1) Парковый самозанятый;\n"
                "2) По трудовому договору;\n"
                "3) Парковый ИП?"
            ),
            follow_up="Выберите тип занятости: 1 / 2 / 3.",
            tags=["connection", "employment_type"],
        ),
        KBEntry(
            intent=Intent.SELF_EMPLOYED,
            triggers=[
                "парковый самозанятый", "1) парковый самозанятый", "самозанятый",
                "хочу как самозанятый", "регистрация самозанятым",
            ],
            response=(
                "Вы можете зарегистрироваться самостоятельно по ссылке "
                "https://forms.fleet.yandex.ru/forms?specification=taxi&ref_id=3ab2490266a94cc58bef8cd56986c769 "
                "или пришлите в этот чат: СТС с 2х сторон, водительское удостоверение и номер телефона, "
                "привязанный к приложению «Мой налог» — менеджер зарегистрирует Вас и свяжется "
                "в рабочее время с 8:00 до 21:00 Мск. Комиссия парка — 1,9% с заказа."
            ),
            tags=["self_employed", "connection"],
        ),
        KBEntry(
            intent=Intent.SELF_EMPLOYED,
            triggers=[
                "да открыта самозанятость", "уже самозанятый", "самозанятость оформлена",
                "открыта самозанятость в приложении мой налог",
            ],
            response=(
                "Отлично! Для регистрации в Яндекс Про отправьте, пожалуйста:\n"
                "• фото водительского удостоверения;\n"
                "• фото СТС с информацией об авто;\n"
                "• номер телефона для регистрации (тот, что в «Мой налог»)."
            ),
            tags=["self_employed", "documents"],
        ),
        KBEntry(
            intent=Intent.SELF_EMPLOYED,
            triggers=[
                "как открыть самозанятость", "как зарегистрироваться в мой налог",
                "как стать самозанятым", "не открыта самозанятость",
                "инструкция по самозанятости",
            ],
            response=(
                "Как это работает и что нужно сделать\n"
                "1) Установить приложение «Мой налог» и пройти регистрацию — паспорт и ~15 минут.\n"
                "Android: https://play.google.com/store/apps/details?id=com.gnivts.selfemployed\n"
                "iOS: https://apps.apple.com/ru/app/%D0%BC%D0%BE%D0%B9-%D0%BD%D0%B0%D0%BB%D0%BE%D0%B3/id1437518854\n"
                "2) Сообщить нам по готовности — зарегистрируем парковым самозанятым.\n"
                "3) Войти в профиль Яндекс Про после нашей регистрации, принять условия "
                "и пройти проверки в «Диагностике» (фотоконтроль документов)."
            ),
            tags=["self_employed", "my_tax"],
        ),
        KBEntry(
            intent=Intent.EMPLOYMENT_CONTRACT,
            triggers=[
                "по трудовому договору", "2) по трудовому договору", "трудовой договор",
                "официальное трудоустройство", "работа по тк",
            ],
            response=(
                "Вы можете зарегистрироваться самостоятельно по ссылке "
                "https://forms.fleet.yandex.ru/forms?specification=taxi&ref_id=c4270b54fcde4ea1ba37e55d0ed0f990 "
                "или пришлите фото: СТС (сторона с данными об авто), ВУ с 2х сторон, "
                "рабочий номер телефона. Для ТД нужны паспорт, ИНН и СНИЛС. "
                "Комиссия парка — 4% с заказа + 200₽/сутки."
            ),
            tags=["employment_contract"],
        ),
        KBEntry(
            intent=Intent.EMPLOYMENT_CONTRACT,
            triggers=[
                "по трудовому договору какие условия", "что значит трудовой договор",
                "комиссия и списания по тд", "оформляю банкротство",
                "работа при банкротстве",
            ],
            response=(
                "Трудовой договор:\n"
                "• ежедневное списание 200 ₽ — налоги и пенсионные взносы;\n"
                "• комиссия парка — 4%.\n\n"
                "Подходит, если не хотите/не можете ИП или СМЗ; предпочитаете не раскрывать "
                "доходы перед налоговой и приставами; проходите банкротство / получаете пособия; "
                "превысили лимиты СМЗ."
            ),
            tags=["employment_contract", "conditions"],
        ),
        KBEntry(
            intent=Intent.CONNECTION,
            triggers=[
                "парковым ип", "3) парковым ип", "у меня ип",
                "индивидуальный предприниматель", "ип в такси",
            ],
            response=(
                "Вы можете зарегистрироваться самостоятельно по ссылке "
                "https://forms.fleet.yandex.ru/forms?specification=taxi&ref_id=7b5d2de6a5074877a771e6da0ef5520f "
                "Пришлите СТС с 2х сторон, ВУ и номер телефона из «Мой налог». "
                "Комиссия парка — 1,9% с заказа."
            ),
            tags=["connection", "ip"],
        ),
        KBEntry(
            intent=Intent.TARIFFS,
            triggers=[
                "комиссия 200", "200 р снимается", "почему списывают 200",
                "200 рублей каждый день", "объясните про 200р",
            ],
            response=(
                "Фиксированное списание 200₽ списывается ежедневно, независимо от выхода на линию. "
                "Парк платит за вас налоги и пенсионные отчисления даже если вы не выходили на линию."
            ),
            tags=["tariffs", "daily_fee"],
        ),
        KBEntry(
            intent=Intent.TARIFFS,
            triggers=[
                "приставы не увидят мой доход", "какой доход будет отображаться в трудовой",
                "какая зарплата в документах",
            ],
            response=(
                "Ваш официальный доход будет 6000₽, но вывести сможете всю заработанную сумму "
                "с учетом комиссий сервиса на карту любого физлица, без ограничений."
            ),
            tags=["tariffs", "official_income"],
        ),
        KBEntry(
            intent=Intent.DOCUMENTS,
            triggers=[
                "что нужно для оформления трудового договора",
                "какие документы для тд", "список документов для трудоустройства",
            ],
            response=(
                "Для трудового договора: паспорт (фото и прописка), СНИЛС, ИНН. "
                "Также нужен подтверждённый аккаунт на Госуслугах (ЕСИА) для подписания ТД.\n"
                "Для регистрации в парке: фото ВУ с 2х сторон, СТС (данные об авто), "
                "номер телефона для работы."
            ),
            tags=["documents", "employment_contract"],
        ),
        KBEntry(
            intent=Intent.FGIS_LICENSE,
            triggers=[
                "нужна лицензия для такси", "реестр фгис такси", "лицензия фгис",
                "что нужно для лицензии фгис", "оформление лицензии такси",
                "разрешение на такси", "можно оформить лицензию",
            ],
            response=(
                "Уточните, пожалуйста: нужно внести авто в реестр ТС или водителя в реестр перевозчика? "
                "Также укажите регион работы — в каждом регионе свои требования к авто. "
                "Стоимость внесения — 3500₽ за документ. Требования к авто: "
                "https://disk.yandex.ru/i/VfibcHWg_MuMZQ"
            ),
            follow_up="Регион и тип: реестр ТС или реестр перевозчика?",
            tags=["fgis", "clarify"],
            needs_fgis_type=True,
        ),
        KBEntry(
            intent=Intent.FGIS_LICENSE,
            triggers=[
                "какие условия и стоимость оформления лицензии",
                "сколько стоит лицензия", "оплата за лицензию",
            ],
            response=(
                "Оплата по факту выполненной работы 3500₽ на 5 лет после вашей проверки, "
                "без ежемесячной оплаты. Для уточнения условий укажите регион работы."
            ),
            follow_up="Укажите регион.",
            tags=["fgis", "price"],
        ),
        KBEntry(
            intent=Intent.FGIS_LICENSE,
            triggers=[
                "сколько по времени делается лицензия", "как долго ждать лицензию",
                "когда будет готова лицензия",
            ],
            response=(
                "В среднем от 1 до 3 дней, в редких случаях до 7 дней (зависит от региона и Минтранса). "
                "Со своей стороны обрабатываем и отправляем заявление в течение часа после получения фото "
                "и контролируем процесс до готового документа."
            ),
            tags=["fgis", "timing"],
        ),
        KBEntry(
            intent=Intent.TRANSPORT_REGISTRY,
            triggers=[
                "авто будет отображаться в базе", "машина будет в реестре такси",
                "после внесения в реестр", "пробиваться в базе как работавшая в такси",
            ],
            response=(
                "Да, это официальное внесение в реестр такси ФГИС. "
                "Актуальный статус записи можно проверить на сайте Минтранса."
            ),
            tags=["transport_registry"],
        ),
        KBEntry(
            intent=Intent.TRANSPORT_REGISTRY,
            triggers=[
                "что нужно для оформления лицензии фгис в регионе",
                "документы для лицензии", "какие фото нужны для лицензии",
                "внести авто в реестр тс",
            ],
            response=(
                "Для внесения авто в реестр ТС ФГИС понадобятся:\n"
                "• фото СТС с 2х сторон;\n"
                "• фото авто с 4х сторон под прямым углом.\n"
                "Договор с агрегатором и справку об отсутствии судимости не перечисляем, "
                "если вы об этом отдельно не спрашивали."
            ),
            tags=["transport_registry", "documents"],
        ),
        KBEntry(
            intent=Intent.CARRIER_REGISTRY,
            triggers=[
                "реестр перевозчиков", "а реестр перевозчиков делаете",
                "внесение водителя в реестр", "лицензия на перевозчика",
            ],
            response=(
                "Если авто в реестр ТС ФГИС вносили мы — да, поможем с реестром перевозчика. "
                "Понадобятся: справка об отсутствии судимости; договор с агрегатором; "
                "статус самозанятого или ИП.\n"
                "Авто уже внесено в реестр ТС?"
            ),
            follow_up="Авто уже в реестре ТС?",
            tags=["carrier_registry"],
        ),
        KBEntry(
            intent=Intent.CARRIER_REGISTRY,
            triggers=[
                "да машина уже в реестре", "да авто уже в реестре",
                "авто внесено ранее", "машина уже в реестре",
            ],
            response=(
                "Тогда есть 3 варианта:\n"
                "1) Обратиться к тому, кто вносил авто, и попросить помочь с реестром перевозчика.\n"
                "2) Исключить авто из реестра ТС ФГИС — затем внесём повторно и поможем с перевозчиком.\n"
                "3) Оформиться к нам по трудовому договору — перевозчик в Яндексе будет подтверждён от парка."
            ),
            tags=["carrier_registry", "options"],
        ),
        KBEntry(
            intent=Intent.FGIS_LICENSE,
            triggers=[
                "если лицензию аннулировать", "переподключение после аннулирования",
                "сможете подключить на свой парк",
            ],
            response=(
                "Да, можем. Присылайте СТС, права, паспорт и номер телефона для работы. "
                "Если нужно повторно внести авто в реестр ТС — ещё фото авто с 4х сторон. "
                "Стоимость 3500₽, оплата после получения и проверки документа."
            ),
            tags=["fgis", "reconnect"],
        ),
        KBEntry(
            intent=Intent.DOCUMENTS,
            triggers=[
                "какие документы и куда прислать", "куда отправить фото",
                "куда прислать документы", "адрес для документов",
            ],
            response=(
                "Пришлите в этом чате или на номер +79180521022 в Telegram/WhatsApp."
            ),
            tags=["documents", "delivery"],
        ),
        KBEntry(
            intent=Intent.ROUTE_SHEETS,
            triggers=[
                "путевые", "путевыми", "путевые листы", "нужны путевые",
                "оформление путевых",
            ],
            response=(
                "С путевыми поможем. Потребуется оформиться в наш парк и предоставить:\n"
                "паспорт (фото и прописка), ВУ, ИНН, СНИЛС, техосмотр под такси, ОСАГО под такси.\n"
                "Стоимость для водителей парка — 50₽/день, списание только в дни выхода на линию."
            ),
            tags=["route_sheets"],
        ),
        KBEntry(
            intent=Intent.OSGO,
            triggers=["осгоп", "страхование осгоп", "полис осгоп"],
            response="Да, поможем с ОСГОП: стоимость 3400₽, выдаётся на год.",
            tags=["osgo"],
        ),
        KBEntry(
            intent=Intent.CAR_CHANGE,
            triggers=[
                "я сменил авто", "как поменять авто", "замена автомобиля",
                "новое авто в такси", "сменить машину",
            ],
            response="Пришлите СТС нового авто и номер телефона, к которому привязан аккаунт.",
            tags=["car_change"],
        ),
        KBEntry(
            intent=Intent.BLOCK_ISSUE,
            triggers=[
                "заблокировали", "блокировка", "за что меня заблокировали",
                "заблокировали аккаунт", "блокировка в приложении",
            ],
            response=(
                "Пришлите, пожалуйста, скриншот экрана блокировки и напишите ФИО "
                "и номер телефона, зарегистрированный в аккаунте."
            ),
            follow_up="Нужны скриншот, ФИО и телефон.",
            tags=["block", "escalate"],
            escalate=True,
            priority=Priority.HIGH,
        ),
        KBEntry(
            intent=Intent.COMPLAINT,
            triggers=[
                "жалоба", "недопустимо", "возмущен", "возмущён", "плохо работаете",
                "хочу пожаловаться", "претензия", "обман",
            ],
            response=(
                "Понимаем важность обращения. Передаём диалог менеджеру и создаём задачу в CRM. "
                "Опишите кратко суть и оставьте телефон для связи."
            ),
            tags=["complaint", "urgent"],
            escalate=True,
            priority=Priority.URGENT,
        ),
        KBEntry(
            intent=Intent.MANAGER_REQUEST,
            triggers=[
                "оператор", "менеджер", "живой человек", "соедините с оператором",
                "позовите человека", "нужен оператор", "свяжите с менеджером",
            ],
            response="Хорошо, передаю диалог менеджеру. Обычно на связи с 8:00 до 21:00 Мск.",
            tags=["manager", "handoff"],
            escalate=True,
            priority=Priority.HIGH,
        ),
        KBEntry(
            intent=Intent.PAYMENTS,
            triggers=[
                "куда перевести", "как оплатить", "реквизиты для оплаты",
                "оплата лицензии",
            ],
            response=(
                "Для оплаты услуги по оформлению лицензии переведите 3500₽ по номеру "
                "+79180414441 (Виктор И. ОЗОН-банк). После оплаты пришлите квитанцию — "
                "завершим оформление."
            ),
            tags=["payments", "license"],
        ),
        KBEntry(
            intent=Intent.WITHDRAW_YANDEX,
            triggers=[
                "вывод через яндекс", "вывод через яндекс баланс",
                "как вывести деньги в яндекс", "вывод средств из яндекс про",
                "добавить карту для выплат",
            ],
            response=(
                "Как добавить карту для выплат в Яндекс Про:\n"
                "Деньги → Баланс → Вывести → «укажите реквизиты для зачислений» → "
                "Управлять реквизитами → Добавить новый способ выплат → через СБП "
                "по номеру телефона и банк → Сохранить → выбрать карту кружком.\n"
                "Рекомендуем вывод через СБП на любую карту, кроме карты Яндекса."
            ),
            tags=["withdraw_yandex"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=[
                "есть у вас офис", "где находится офис", "можно приехать",
            ],
            response=(
                "Офиса нет — работаем удалённо. Задайте вопрос здесь или звоните "
                "+79180521022, время работы 8:00–21:00 Мск."
            ),
            tags=["faq", "office"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=[
                "не гражданин рф", "если у меня внж", "иностранцам можно",
                "могу работать если я не гражданин",
            ],
            response="Увы, для работы обязательно требуется гражданство РФ.",
            tags=["faq", "citizenship"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=[
                "лицензия одна или разные", "самозанятым работать и договору",
                "могу ли я самозанятым работать и договору",
            ],
            response=(
                "Лицензия оформляется по региону работы — для каждого региона отдельная запись. "
                "При трудовом договоре статус самозанятого можно закрыть: взносы платит парк "
                "(ежедневное списание 200₽)."
            ),
            tags=["faq", "license_employment"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=[
                "курьером в достависто", "работа в достависте", "достависта",
            ],
            response=(
                "С Доставистой не работаем. Можем зарегистрировать курьером в Яндекс "
                "при статусе самозанятого."
            ),
            tags=["faq", "dostavista"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=[
                "подтверждение типа занятости", "на почту пришло подтверждение",
                "что делать после подтверждения",
            ],
            response=(
                "Хорошо, можете работать. Информация в аккаунте обновится в течение "
                "1,5–2 часов после начала работы."
            ),
            tags=["faq", "employment_confirm"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=[
                "без самозанятого и без фгис", "можно ли работать без лицензии",
                "без самозанятости и без фгис",
            ],
            response=(
                "На первых этапах Яндекс может дать допуск новичку, но далее "
                "обязательно нужно легализоваться."
            ),
            tags=["faq", "onboarding"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=[
                "клиент не оплатил", "пассажир не заплатил", "неоплаченный заказ",
            ],
            response=(
                "Рекомендуем обратиться в поддержку по неоплаченному заказу — "
                "специалисты сервиса разберутся."
            ),
            tags=["faq", "unpaid"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=[
                "сделал заказ", "выполнил 1й заказ", "первый заказ выполнил",
            ],
            response="Хорошо, когда трудовой договор будет готов, сообщим Вам.",
            tags=["faq", "first_order"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=[
                "отправил выписку на проверку", "выписка на проверке",
                "документы на проверке",
            ],
            response="Хорошо, ожидаем. Как правило, проверка занимает не более получаса.",
            tags=["faq", "statement"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=[
                "в данный момент пока нет", "не сейчас", "подумаю", "пока нет",
            ],
            response="Понятно. Соберётесь — дайте знать. На связи.",
            tags=["faq", "decline"],
        ),
        KBEntry(
            intent=Intent.FAQ,
            triggers=["спасибо", "благодарю", "спасибо большое"],
            response="Спасибо и Вам. Обращайтесь по вопросам.",
            tags=["faq", "thanks"],
            weight=0.7,
        ),
        KBEntry(
            intent=Intent.FGIS_LICENSE,
            triggers=[
                "на другой вин", "лицензия на левый вин", "неофициальная лицензия",
                "чтобы не пробивалась в базе",
            ],
            response=(
                "Нет, у нас только официальное внесение через Минтранс. "
                "Документы не корректируем, подаём оригиналы."
            ),
            tags=["fgis", "official_only"],
        ),
        KBEntry(
            intent=Intent.CONNECTION,
            triggers=[
                "добрый вечер как мне получить заказ", "как получить первый заказ",
                "как мне получить заказ", "начать работать",
            ],
            response="Уточните, пожалуйста, вы уже зарегистрированы у нас?",
            follow_up="Вы уже зарегистрированы в парке?",
            tags=["connection", "first_order"],
        ),
    ]


class KnowledgeBase:
    """Простой retriever: phrase match + Jaccard fallback."""

    def __init__(self, entries: Optional[List[KBEntry]] = None, kb_path: Optional[str] = None):
        self.entries: List[KBEntry] = entries or build_default_knowledge()
        self.kb_path = kb_path
        if kb_path and os.path.isfile(kb_path):
            logger.info("KB file present: %s (using embedded rules derived from it)", kb_path)

    def all_intents(self) -> List[str]:
        return sorted({e.intent.value for e in self.entries})

    def search(self, text: str, top_k: int = 3) -> List[Tuple[KBEntry, float, str]]:
        norm = normalize_text(text)
        scored: List[Tuple[KBEntry, float, str]] = []
        for entry in self.entries:
            best_score = 0.0
            best_trigger = ""
            for trigger in entry.triggers:
                nt = normalize_text(trigger)
                s = phrase_score(norm, nt) * entry.weight
                # Более длинный точный триггер важнее короткого substring.
                if nt and nt in norm:
                    s = max(s, 0.92 + min(len(nt), 40) / 200.0)
                    s *= entry.weight
                if s > best_score:
                    best_score = s
                    best_trigger = trigger
            if best_score > 0:
                scored.append((entry, best_score, best_trigger))
        scored.sort(key=lambda x: (x[1], len(normalize_text(x[2]))), reverse=True)
        return scored[:top_k]

    def get_by_intent(self, intent: Intent) -> List[KBEntry]:
        return [e for e in self.entries if e.intent == intent]


# ---------------------------------------------------------------------------
# Intent classifier
# ---------------------------------------------------------------------------


class IntentClassifier:
    """Классификатор на правилах + KB matching."""

    KEYWORD_HINTS: Dict[Intent, List[str]] = {
        Intent.GREETING: ["здравств", "добрый", "привет"],
        Intent.MANAGER_REQUEST: ["оператор", "менеджер", "живой человек"],
        Intent.COMPLAINT: ["жалоб", "претенз", "обман", "возмущ"],
        Intent.BLOCK_ISSUE: ["блок", "заблокир"],
        Intent.WITHDRAW_YANDEX: ["яндекс", "вывод", "баланс", "сбп"],
        Intent.WITHDRAW_DRIVEE: ["drivee", "драйви", "mozen", "мозен", "вывод", "деньги"],
        Intent.BONUS_DRIVEE: ["бонус", "jump", "джамп", "акци"],
        Intent.FGIS_LICENSE: ["фгис", "лиценз", "реестр"],
        Intent.CARRIER_REGISTRY: ["перевозчик"],
        Intent.TRANSPORT_REGISTRY: ["реестр тс", "реестр авто"],
        Intent.OSGO: ["осгоп"],
        Intent.ROUTE_SHEETS: ["путев"],
        Intent.SELF_EMPLOYED: ["самозанят", "мой налог"],
        Intent.EMPLOYMENT_CONTRACT: ["трудов", "банкрот"],
        Intent.PARTNER_CHANGE: ["партнер", "партнёр", "сменить парк"],
        Intent.CAR_CHANGE: ["сменил авто", "поменять авто", "новое авто"],
        Intent.PAYMENTS: ["оплат", "перевест", "реквизит"],
        Intent.CONNECTION: ["подключ", "оформит", "устрои", "яндекс такси"],
        Intent.DOCUMENTS: ["документ", "куда прислать", "стс", "паспорт"],
        Intent.TARIFFS: ["комисси", "200"],
    }

    def __init__(self, kb: KnowledgeBase, config: BotConfig):
        self.kb = kb
        self.config = config

    def classify(self, text: str, state: Optional[DialogState] = None) -> IntentMatch:
        norm = normalize_text(text)
        tokens = tokenize(norm)

        # Pure greeting short-circuit
        greeting_only = norm in {
            "здравствуйте", "добрый день", "доброе утро", "добрый вечер",
            "привет", "хай", "приветствую", "здравия желаю", "можно вопрос",
        }
        if greeting_only:
            entries = self.kb.get_by_intent(Intent.GREETING)
            return IntentMatch(Intent.GREETING, 0.99, entries[0] if entries else None, norm)

        # Aggregator clarification answers
        if state and state.awaiting_clarification == "aggregator":
            if any(x in norm for x in ("яндекс", "yandex")):
                entry = self._best_for_aggregator(Aggregator.YANDEX, text)
                return IntentMatch(entry.intent if entry else Intent.WITHDRAW_YANDEX, 0.9, entry)
            if any(x in norm for x in ("drivee", "драйви", "драйв")):
                entry = self._best_for_aggregator(Aggregator.DRIVEE, text)
                return IntentMatch(entry.intent if entry else Intent.WITHDRAW_DRIVEE, 0.9, entry)

        # FGIS type clarification
        if state and state.awaiting_clarification == "fgis_type":
            if "перевоз" in norm:
                entries = self.kb.get_by_intent(Intent.CARRIER_REGISTRY)
                return IntentMatch(Intent.CARRIER_REGISTRY, 0.9, entries[0] if entries else None)
            if any(x in norm for x in ("тс", "авто", "машин", "реестр тс")):
                entries = self.kb.get_by_intent(Intent.TRANSPORT_REGISTRY)
                return IntentMatch(Intent.TRANSPORT_REGISTRY, 0.9, entries[0] if entries else None)

        results = self.kb.search(text, top_k=5)
        if results:
            entry, score, trigger = results[0]
            # Prefer more specific intents when withdraw+yandex/drivee both present
            score = self._adjust_score(norm, entry, score)
            if score >= self.config.clarify_confidence_threshold:
                return IntentMatch(entry.intent, min(score, 0.99), entry, trigger)

        # Keyword hint fallback
        hint_scores: Dict[Intent, float] = {}
        for intent, keys in self.KEYWORD_HINTS.items():
            hits = sum(1 for k in keys if k in norm)
            if hits:
                hint_scores[intent] = hits / len(keys)
        if hint_scores:
            intent = max(hint_scores, key=hint_scores.get)
            conf = hint_scores[intent]
            entries = self.kb.get_by_intent(intent)
            entry = entries[0] if entries else None
            return IntentMatch(intent, conf, entry)

        if not tokens:
            return IntentMatch(Intent.UNKNOWN, 0.0)
        return IntentMatch(Intent.UNKNOWN, 0.1)

    def _best_for_aggregator(self, agg: Aggregator, text: str) -> Optional[KBEntry]:
        if agg == Aggregator.YANDEX:
            found = self.kb.search("как вывести деньги в яндекс", top_k=1)
        else:
            found = self.kb.search("как вывести деньги с drivee", top_k=1)
        return found[0][0] if found else None

    def _adjust_score(self, norm: str, entry: KBEntry, score: float) -> float:
        if entry.intent == Intent.WITHDRAW_DRIVEE and any(
            x in norm for x in ("яндекс", "yandex")
        ) and not any(x in norm for x in ("drivee", "драйви", "mozen", "мозен", "jump")):
            return score * 0.5
        if entry.intent == Intent.WITHDRAW_YANDEX and any(
            x in norm for x in ("drivee", "драйви")
        ):
            return score * 0.5
        if entry.intent == Intent.GREETING and len(tokenize(norm)) > 4:
            return score * 0.4
        return score


# ---------------------------------------------------------------------------
# amoCRM client
# ---------------------------------------------------------------------------


class AmoCRMError(Exception):
    pass


class AmoCRMClient:
    """Клиент amoCRM с retry/backoff и антидублем по телефону."""

    def __init__(self, config: BotConfig):
        self.config = config
        self._phone_index: Dict[str, int] = {}  # local anti-dupe cache
        self._dry_store: Dict[str, Any] = {"contacts": {}, "leads": {}, "notes": [], "tasks": []}

    @property
    def enabled(self) -> bool:
        return bool(self.config.amo_base_url and self.config.amo_access_token) and not self.config.amo_dry_run

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.config.amo_access_token}",
            "Content-Type": "application/json",
            "User-Agent": "ArmadaSupportBot/1.0",
        }

    def _request_sync(self, method: str, path: str, payload: Optional[dict] = None) -> Any:
        url = f"{self.config.amo_base_url}{path}"
        data = None if payload is None else json.dumps(payload).encode("utf-8")
        req = urlrequest.Request(url, data=data, headers=self._headers(), method=method)
        try:
            with urlrequest.urlopen(req, timeout=20) as resp:
                body = resp.read().decode("utf-8")
                return json.loads(body) if body else {}
        except urlerror.HTTPError as exc:
            err_body = exc.read().decode("utf-8", errors="replace")
            raise AmoCRMError(f"HTTP {exc.code}: {err_body}") from exc
        except urlerror.URLError as exc:
            raise AmoCRMError(str(exc)) from exc

    async def _request(self, method: str, path: str, payload: Optional[dict] = None) -> Any:
        last_err: Optional[Exception] = None
        for attempt in range(1, self.config.amo_max_retries + 1):
            try:
                return await asyncio.to_thread(self._request_sync, method, path, payload)
            except AmoCRMError as exc:
                last_err = exc
                delay = self.config.amo_retry_base_delay * (2 ** (attempt - 1))
                logger.warning("amoCRM attempt %s failed: %s; retry in %.1fs", attempt, exc, delay)
                await asyncio.sleep(delay)
        raise AmoCRMError(f"amoCRM failed after retries: {last_err}")

    async def find_contact_by_phone(self, phone: str) -> Optional[Dict[str, Any]]:
        phone_n = normalize_phone(phone) or phone
        if phone_n in self._phone_index and not self.enabled:
            cid = self._phone_index[phone_n]
            return self._dry_store["contacts"].get(str(cid))

        if not self.enabled:
            for contact in self._dry_store["contacts"].values():
                if contact.get("phone") == phone_n:
                    return contact
            return None

        # query API
        query = phone_n
        data = await self._request("GET", f"/api/v4/contacts?query={query}&limit=5")
        embedded = (data or {}).get("_embedded", {}).get("contacts", [])
        for contact in embedded:
            self._index_contact_phones(contact)
            if self._contact_has_phone(contact, phone_n):
                return contact
        return embedded[0] if embedded else None

    def _contact_has_phone(self, contact: Dict[str, Any], phone_n: str) -> bool:
        for field_item in contact.get("custom_fields_values") or []:
            for v in field_item.get("values") or []:
                val = normalize_phone(str(v.get("value", "")))
                if val == phone_n:
                    return True
        return False

    def _index_contact_phones(self, contact: Dict[str, Any]) -> None:
        cid = contact.get("id")
        if not cid:
            return
        for field_item in contact.get("custom_fields_values") or []:
            for v in field_item.get("values") or []:
                phone_n = normalize_phone(str(v.get("value", "")))
                if phone_n:
                    self._phone_index[phone_n] = int(cid)

    async def create_or_update_contact(
        self,
        name: Optional[str],
        phone: Optional[str],
        tags: Optional[List[str]] = None,
        extra: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        phone_n = normalize_phone(phone) if phone else None
        existing = await self.find_contact_by_phone(phone_n) if phone_n else None

        if not self.enabled:
            if existing:
                existing.update({"name": name or existing.get("name"), "tags": tags or existing.get("tags"), "extra": extra})
                return existing
            cid = int(hashlib.md5((phone_n or name or str(uuid.uuid4())).encode()).hexdigest()[:8], 16)
            contact = {"id": cid, "name": name or "Клиент", "phone": phone_n, "tags": tags or [], "extra": extra or {}}
            self._dry_store["contacts"][str(cid)] = contact
            if phone_n:
                self._phone_index[phone_n] = cid
            logger.info("DRY amoCRM contact created/updated: %s", contact)
            return contact

        custom_fields = []
        if phone_n:
            field_payload: Dict[str, Any] = {
                "field_code": "PHONE",
                "values": [{"value": phone_n, "enum_code": "WORK"}],
            }
            if self.config.amo_phone_field_id:
                field_payload = {
                    "field_id": self.config.amo_phone_field_id,
                    "values": [{"value": phone_n, "enum_code": "WORK"}],
                }
            custom_fields.append(field_payload)

        body: Dict[str, Any] = {
            "name": name or "Клиент Парк Армада",
            "custom_fields_values": custom_fields,
        }
        if tags:
            body["_embedded"] = {"tags": [{"name": t} for t in tags]}

        if existing and existing.get("id"):
            body["id"] = existing["id"]
            data = await self._request("PATCH", "/api/v4/contacts", [body])
        else:
            data = await self._request("POST", "/api/v4/contacts", [body])
        contact = (data or {}).get("_embedded", {}).get("contacts", [{}])[0]
        self._index_contact_phones(contact)
        return contact

    async def create_lead(
        self,
        payload: CRMPayload,
        contact_id: Optional[int] = None,
    ) -> Dict[str, Any]:
        name = f"[{payload.intent}] {payload.name or 'Клиент'} / {payload.channel}"
        if not self.enabled:
            lid = int(time.time() * 1000) % 10_000_000
            lead = {
                "id": lid,
                "name": name,
                "contact_id": contact_id,
                "payload": payload.to_dict(),
            }
            self._dry_store["leads"][str(lid)] = lead
            logger.info("DRY amoCRM lead: %s", json.dumps(lead, ensure_ascii=False))
            return lead

        lead_body: Dict[str, Any] = {
            "name": name,
            "price": 0,
            "tags": [{"name": t} for t in payload.tags],
        }
        if self.config.amo_pipeline_id:
            lead_body["pipeline_id"] = self.config.amo_pipeline_id
        if self.config.amo_status_id:
            lead_body["status_id"] = self.config.amo_status_id
        if self.config.amo_responsible_user_id:
            lead_body["responsible_user_id"] = self.config.amo_responsible_user_id
        if contact_id:
            lead_body["_embedded"] = {"contacts": [{"id": contact_id}]}

        data = await self._request("POST", "/api/v4/leads", [lead_body])
        return (data or {}).get("_embedded", {}).get("leads", [{}])[0]

    async def add_note(self, entity_id: int, text: str, entity_type: str = "leads") -> Dict[str, Any]:
        if not self.enabled:
            note = {"entity_id": entity_id, "entity_type": entity_type, "text": text}
            self._dry_store["notes"].append(note)
            logger.info("DRY amoCRM note on %s/%s", entity_type, entity_id)
            return note
        body = [
            {
                "entity_id": entity_id,
                "note_type": "common",
                "params": {"text": text},
            }
        ]
        return await self._request("POST", f"/api/v4/{entity_type}/notes", body)

    async def create_task(
        self,
        text: str,
        entity_id: Optional[int] = None,
        entity_type: str = "leads",
        complete_till: Optional[int] = None,
        priority: Priority = Priority.NORMAL,
    ) -> Dict[str, Any]:
        if complete_till is None:
            complete_till = int(time.time()) + (2 * 3600 if priority in {Priority.HIGH, Priority.URGENT} else 8 * 3600)
        if not self.enabled:
            task = {
                "text": text,
                "entity_id": entity_id,
                "entity_type": entity_type,
                "complete_till": complete_till,
                "priority": priority.value,
            }
            self._dry_store["tasks"].append(task)
            logger.info("DRY amoCRM task: %s", task)
            return task
        body: Dict[str, Any] = {
            "text": text,
            "complete_till": complete_till,
            "task_type_id": 1,
        }
        if entity_id:
            body["entity_id"] = entity_id
            body["entity_type"] = entity_type
        if self.config.amo_responsible_user_id:
            body["responsible_user_id"] = self.config.amo_responsible_user_id
        return await self._request("POST", "/api/v4/tasks", [body])

    async def escalate(self, payload: CRMPayload) -> Dict[str, Any]:
        contact = await self.create_or_update_contact(
            name=payload.name,
            phone=payload.phone,
            tags=payload.tags,
            extra=payload.extra,
        )
        contact_id = int(contact.get("id")) if contact.get("id") else None
        lead = await self.create_lead(payload, contact_id=contact_id)
        lead_id = int(lead.get("id")) if lead.get("id") else None
        note_text = (
            f"Intent: {payload.intent}\n"
            f"Priority: {payload.priority}\n"
            f"Channel: {payload.channel}\n"
            f"Source: {payload.source}\n"
            f"Aggregator: {payload.aggregator}\n"
            f"Question: {payload.question_text}\n"
            f"Tags: {', '.join(payload.tags)}\n"
            f"---\n{payload.dialog_summary}"
        )
        if lead_id:
            await self.add_note(lead_id, note_text, entity_type="leads")
            await self.create_task(
                text=f"Обработать обращение: {payload.intent} / {payload.question_text[:120]}",
                entity_id=lead_id,
                priority=Priority(payload.priority) if payload.priority in Priority._value2member_map_ else Priority.NORMAL,
            )
        return {"contact": contact, "lead": lead, "payload": payload.to_dict()}


# ---------------------------------------------------------------------------
# Dialog manager
# ---------------------------------------------------------------------------


class DialogStore:
    """In-memory история диалогов. Точка расширения: Redis/DB."""

    def __init__(self) -> None:
        self._dialogs: Dict[str, DialogState] = {}

    def get_or_create(
        self,
        dialog_id: Optional[str] = None,
        channel: str = "cli",
        source: str = "support_bot",
        external_user_id: Optional[str] = None,
    ) -> DialogState:
        if dialog_id and dialog_id in self._dialogs:
            return self._dialogs[dialog_id]
        did = dialog_id or str(uuid.uuid4())
        state = DialogState(
            dialog_id=did,
            channel=channel,
            source=source,
            external_user_id=external_user_id,
        )
        self._dialogs[did] = state
        return state

    def save(self, state: DialogState) -> None:
        state.updated_at = datetime.now(timezone.utc).isoformat()
        self._dialogs[state.dialog_id] = state

    def get(self, dialog_id: str) -> Optional[DialogState]:
        return self._dialogs.get(dialog_id)


class DialogManager:
    """intent -> KB -> clarifications -> CRM escalation -> response."""

    def __init__(
        self,
        config: BotConfig,
        kb: KnowledgeBase,
        classifier: IntentClassifier,
        crm: AmoCRMClient,
        store: Optional[DialogStore] = None,
    ):
        self.config = config
        self.kb = kb
        self.classifier = classifier
        self.crm = crm
        self.store = store or DialogStore()

    async def handle_message(
        self,
        text: str,
        *,
        dialog_id: Optional[str] = None,
        channel: str = "cli",
        source: str = "support_bot",
        external_user_id: Optional[str] = None,
        contact_hint: Optional[ContactData] = None,
    ) -> BotResponse:
        state = self.store.get_or_create(dialog_id, channel, source, external_user_id)
        raw = (text or "").strip()
        if not raw:
            return BotResponse(
                text="Напишите, пожалуйста, ваш вопрос — поможем.",
                intent=Intent.UNKNOWN,
                confidence=0.0,
            )

        extracted = extract_contact_fields(raw)
        if contact_hint:
            extracted.merge(contact_hint)
        state.contact.merge(extracted)
        state.history.append(DialogMessage(role="user", text=raw))

        # Detect aggregator mentions
        norm = normalize_text(raw)
        if any(x in norm for x in ("яндекс", "yandex")):
            state.aggregator = Aggregator.YANDEX
        elif any(x in norm for x in ("drivee", "драйви", "драйв", "mozen", "jump", "джамп")):
            state.aggregator = Aggregator.DRIVEE

        match = self.classifier.classify(raw, state)
        state.last_intent = match.intent
        logger.info(
            "dialog=%s intent=%s conf=%.2f trigger=%s",
            state.dialog_id,
            match.intent.value,
            match.confidence,
            match.matched_trigger,
        )

        response = await self._build_response(state, raw, match)
        state.history.append(
            DialogMessage(role="bot", text=response.text, intent=response.intent.value)
        )
        self.store.save(state)
        response.meta.update(
            {
                "dialog_id": state.dialog_id,
                "aggregator": state.aggregator.value,
                "tags": list(state.tags),
                "amo_lead_id": state.amo_lead_id,
                "amo_contact_id": state.amo_contact_id,
            }
        )
        return response

    async def _build_response(self, state: DialogState, raw: str, match: IntentMatch) -> BotResponse:
        clarifications: List[str] = []
        parts: List[str] = []
        entry = match.entry
        intent = match.intent
        confidence = match.confidence
        escalate = False
        priority = Priority.NORMAL
        tags: List[str] = []

        # First message greeting
        if not state.greeted:
            if intent != Intent.GREETING:
                parts.append(
                    f'Здравствуйте! Парк "{self.config.company_name}" на связи.'
                )
            state.greeted = True

        # Low confidence -> clarify / escalate
        if intent == Intent.UNKNOWN or confidence < self.config.clarify_confidence_threshold:
            return await self._unknown_or_escalate(state, raw, match)

        if confidence < self.config.intent_confidence_threshold and entry:
            clarify = entry.follow_up or "Уточните, пожалуйста, ваш вопрос чуть подробнее?"
            state.awaiting_clarification = "generic"
            text = self._compose(parts, [clarify], state, offer_services=False)
            return BotResponse(
                text=text,
                intent=intent,
                confidence=confidence,
                clarifications=[clarify],
                tags=entry.tags,
            )

        # Special: withdraw without aggregator
        if self._is_money_question(raw) and state.aggregator == Aggregator.UNKNOWN:
            if intent in {Intent.WITHDRAW_DRIVEE, Intent.WITHDRAW_YANDEX} or (entry and entry.needs_aggregator):
                if not state.aggregator_asked:
                    state.aggregator_asked = True
                    state.awaiting_clarification = "aggregator"
                    q = "Уточните, пожалуйста: Яндекс Такси или DRIVEE?"
                    text = self._compose(parts, [q], state, offer_services=False)
                    return BotResponse(
                        text=text,
                        intent=intent,
                        confidence=confidence,
                        clarifications=[q],
                        tags=["clarify_aggregator"],
                    )

        # Если агрегатор уже Drivee, а ответ — общий clarify — подменим на инструкцию Drivee.
        if (
            state.aggregator == Aggregator.DRIVEE
            and intent == Intent.WITHDRAW_DRIVEE
            and entry
            and "clarify_aggregator" in (entry.tags or [])
        ):
            found = self.kb.search("как вывести деньги с drivee mozen", top_k=3)
            for cand, score, _trig in found:
                if "instruction" in (cand.tags or []) or "mozen" in (cand.tags or []):
                    entry = cand
                    confidence = max(confidence, score)
                    break

        if state.aggregator == Aggregator.DRIVEE and self._is_money_question(raw):
            nrm = normalize_text(raw)
            if not any(x in nrm for x in ("mozen", "jump", "drivee")):
                if entry and "instruction" not in (entry.tags or []):
                    clarifications.append("Уточните, речь о Drivee, Mozen или JUMP?")
            elif entry and "instruction" not in (entry.tags or []) and "mozen" not in (entry.tags or []):
                # уже указан Drivee/Mozen/JUMP — не переспрашиваем агрегатор
                pass

        # FGIS type clarification
        if (entry and entry.needs_fgis_type) or intent == Intent.FGIS_LICENSE:
            if not state.fgis_type and "перевоз" not in normalize_text(raw) and "реестр тс" not in normalize_text(raw):
                if "фгис" in normalize_text(raw) or "лиценз" in normalize_text(raw):
                    state.awaiting_clarification = "fgis_type"

        # Clear clarification flags on confident answer
        if state.awaiting_clarification and confidence >= self.config.intent_confidence_threshold:
            if state.awaiting_clarification == "aggregator" and state.aggregator != Aggregator.UNKNOWN:
                state.awaiting_clarification = None
            elif state.awaiting_clarification == "fgis_type":
                if "перевоз" in normalize_text(raw):
                    state.fgis_type = "carrier"
                    state.awaiting_clarification = None
                elif any(x in normalize_text(raw) for x in ("тс", "авто", "машин")):
                    state.fgis_type = "transport"
                    state.awaiting_clarification = None
            elif state.awaiting_clarification == "generic":
                state.awaiting_clarification = None

        answer = ""
        if entry:
            answer = split_paragraphs(entry.response)
            tags.extend(entry.tags)
            escalate = entry.escalate or intent in HIGH_RISK_INTENTS
            priority = entry.priority
            if entry.follow_up and state.awaiting_clarification:
                clarifications.append(entry.follow_up)
            state.add_tags(*entry.tags)
        elif intent == Intent.WITHDRAW_YANDEX or state.aggregator == Aggregator.YANDEX:
            answer = YANDEX_FALLBACK
            tags.append("yandex_fallback")
        else:
            return await self._unknown_or_escalate(state, raw, match)

        if intent in HIGH_RISK_INTENTS:
            escalate = True
            if intent == Intent.COMPLAINT:
                priority = Priority.URGENT

        body_parts = [answer]
        if clarifications:
            body_parts.append(clarifications[0])

        # First meaningful answer should ask aggregator if not asked
        if not state.aggregator_asked and state.aggregator == Aggregator.UNKNOWN:
            if intent not in {Intent.GREETING, Intent.FAQ} or intent == Intent.GREETING:
                # greeting response already asks; otherwise append once
                if intent != Intent.GREETING:
                    body_parts.append("Подскажите, вы работаете с Яндекс Такси или DRIVEE?")
                state.aggregator_asked = True

        offer = intent in {
            Intent.CONNECTION, Intent.FGIS_LICENSE, Intent.OSGO,
            Intent.ROUTE_SHEETS, Intent.SELF_EMPLOYED, Intent.EMPLOYMENT_CONTRACT,
        }
        text = self._compose(parts, body_parts, state, offer_services=offer)

        crm_payload = None
        if escalate or (intent == Intent.UNKNOWN and ESCALATE_ON_UNKNOWN):
            crm_payload = self._make_payload(state, raw, intent, tags, priority)
            try:
                result = await self.crm.escalate(crm_payload)
                state.amo_contact_id = (result.get("contact") or {}).get("id")
                state.amo_lead_id = (result.get("lead") or {}).get("id")
                state.add_tags("escalated")
            except AmoCRMError as exc:
                logger.error("CRM escalation failed: %s", exc)
                text += "\n\nНе удалось автоматически создать обращение, но менеджер всё равно получит ваш вопрос — перезвоним по возможности."

        return BotResponse(
            text=text.strip(),
            intent=intent,
            confidence=confidence,
            tags=tags,
            escalate=escalate,
            crm_payload=crm_payload,
            clarifications=clarifications,
        )

    async def _unknown_or_escalate(self, state: DialogState, raw: str, match: IntentMatch) -> BotResponse:
        msg = (
            "Не нашёл точный ответ в базе. Передаю вопрос менеджеру — "
            f"свяжемся в рабочее время ({self.config.work_hours}). "
            f"Также можно позвонить {self.config.support_phone}."
        )
        if not state.greeted:
            msg = f'Здравствуйте! Парк "{self.config.company_name}" на связи.\n\n' + msg
            state.greeted = True
            state.aggregator_asked = True

        payload = self._make_payload(
            state, raw, Intent.UNKNOWN, ["unknown", "escalated"], Priority.NORMAL
        )
        try:
            result = await self.crm.escalate(payload)
            state.amo_contact_id = (result.get("contact") or {}).get("id")
            state.amo_lead_id = (result.get("lead") or {}).get("id")
        except AmoCRMError as exc:
            logger.error("CRM escalation failed: %s", exc)

        text = self._compose([], [msg], state, offer_services=True)
        return BotResponse(
            text=text,
            intent=Intent.UNKNOWN,
            confidence=match.confidence,
            tags=["unknown"],
            escalate=True,
            crm_payload=payload,
        )

    def _compose(
        self,
        prefix: List[str],
        body: List[str],
        state: DialogState,
        offer_services: bool,
    ) -> str:
        chunks = [c.strip() for c in prefix + body if c and c.strip()]
        if (
            offer_services
            and self.config.services_offer_once
            and not state.services_offered
        ):
            chunks.append(SERVICES_OFFER)
            state.services_offered = True
        return "\n\n".join(chunks)

    def _make_payload(
        self,
        state: DialogState,
        question: str,
        intent: Intent,
        tags: List[str],
        priority: Priority,
    ) -> CRMPayload:
        return CRMPayload(
            name=state.contact.name,
            phone=state.contact.phone,
            source=state.source,
            channel=state.channel,
            intent=intent.value,
            question_text=question,
            dialog_summary=state.summary(),
            tags=list(dict.fromkeys(tags + state.tags)),
            priority=priority.value,
            aggregator=state.aggregator.value,
            city=state.contact.city,
            extra=state.contact.as_dict(),
        )

    @staticmethod
    def _is_money_question(text: str) -> bool:
        n = normalize_text(text)
        keys = ("деньг", "вывод", "вывест", "перевод", "снят", "баланс", "mozen", "мозен", "jump")
        return any(k in n for k in keys)


# ---------------------------------------------------------------------------
# Support bot facade + channel adapters
# ---------------------------------------------------------------------------


class SupportBot:
    """Фасад для Telegram / WhatsApp / web-chat / webhook."""

    def __init__(self, config: Optional[BotConfig] = None):
        self.config = config or BotConfig.from_env()
        self.kb = KnowledgeBase(kb_path=self.config.kb_path)
        self.classifier = IntentClassifier(self.kb, self.config)
        self.crm = AmoCRMClient(self.config)
        self.store = DialogStore()
        self.dialog = DialogManager(self.config, self.kb, self.classifier, self.crm, self.store)

    async def on_message(
        self,
        text: str,
        *,
        dialog_id: Optional[str] = None,
        channel: str = "webhook",
        source: str = "support_bot",
        user_id: Optional[str] = None,
        name: Optional[str] = None,
        phone: Optional[str] = None,
    ) -> BotResponse:
        hint = ContactData(name=name, phone=normalize_phone(phone) if phone else None)
        return await self.dialog.handle_message(
            text,
            dialog_id=dialog_id or user_id,
            channel=channel,
            source=source,
            external_user_id=user_id,
            contact_hint=hint if (name or phone) else None,
        )

    def on_message_sync(self, text: str, **kwargs: Any) -> BotResponse:
        return asyncio.run(self.on_message(text, **kwargs))

    # --- channel stubs ---

    async def handle_telegram_update(self, update: Dict[str, Any]) -> Optional[BotResponse]:
        message = update.get("message") or update.get("edited_message") or {}
        text = message.get("text")
        if not text:
            return None
        chat = message.get("chat") or {}
        user = message.get("from") or {}
        return await self.on_message(
            text,
            dialog_id=f"tg:{chat.get('id')}",
            channel="telegram",
            source="telegram",
            user_id=str(user.get("id") or chat.get("id")),
            name=" ".join(
                filter(None, [user.get("first_name"), user.get("last_name")])
            ) or None,
        )

    async def handle_whatsapp_webhook(self, payload: Dict[str, Any]) -> Optional[BotResponse]:
        # Ожидаемый упрощённый payload: {from, text, name?}
        text = payload.get("text") or payload.get("body")
        if not text:
            return None
        phone = payload.get("from") or payload.get("phone")
        return await self.on_message(
            text,
            dialog_id=f"wa:{phone}",
            channel="whatsapp",
            source="whatsapp",
            user_id=phone,
            name=payload.get("name"),
            phone=phone,
        )

    async def handle_webchat(self, payload: Dict[str, Any]) -> BotResponse:
        return await self.on_message(
            payload.get("text", ""),
            dialog_id=payload.get("dialog_id") or payload.get("session_id"),
            channel="webchat",
            source=payload.get("source", "webchat"),
            user_id=payload.get("user_id"),
            name=payload.get("name"),
            phone=payload.get("phone"),
        )


# ---------------------------------------------------------------------------
# Demo / examples
# ---------------------------------------------------------------------------

EXAMPLE_AMO_PAYLOAD = {
    "name": "Иван Иванов",
    "phone": "79001234567",
    "source": "support_bot",
    "channel": "telegram",
    "intent": "block_issue",
    "question_text": "Заблокировали аккаунт, не могу выйти на линию",
    "dialog_summary": "user: Заблокировали аккаунт\nbot: Пришлите скриншот...",
    "tags": ["block", "escalate", "escalated"],
    "priority": "high",
    "aggregator": "yandex",
    "city": "Краснодар",
    "extra": {"employment_status": "self_employed"},
}


async def _demo_conversation(bot: SupportBot) -> None:
    print("=== Demo: Парк АРМАДА support bot ===")
    print(f"AMO dry-run={bot.config.amo_dry_run} enabled_api={bot.crm.enabled}")
    print("Пример amoCRM payload:")
    print(json.dumps(EXAMPLE_AMO_PAYLOAD, ensure_ascii=False, indent=2))
    print("-" * 60)

    dialog_id = "demo-dialog-1"
    script = [
        "Здравствуйте",
        "Как вывести деньги с драйви?",
        "ОСГОП делаете?",
        "Заблокировали аккаунт",
        "Хочу оператора",
    ]
    for msg in script:
        resp = await bot.on_message(
            msg,
            dialog_id=dialog_id,
            channel="cli",
            source="demo",
            user_id="demo-user",
            name="Демо Клиент",
            phone="+7 (900) 123-45-67",
        )
        print(f"USER: {msg}")
        print(f"BOT [{resp.intent.value} | conf={resp.confidence:.2f} | esc={resp.escalate}]:")
        print(resp.text)
        print("-" * 60)


def _interactive(bot: SupportBot) -> None:
    print("Интерактивный режим. Пустая строка / exit — выход.")
    dialog_id = f"cli-{uuid.uuid4().hex[:8]}"
    while True:
        try:
            msg = input("YOU> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if not msg or msg.lower() in {"exit", "quit", "q"}:
            break
        resp = bot.on_message_sync(
            msg,
            dialog_id=dialog_id,
            channel="cli",
            source="cli",
            phone="79001112233",
            name="CLI User",
        )
        print(f"BOT [{resp.intent.value}]> {resp.text}\n")


if __name__ == "__main__":
    # Пример подключения входящего сообщения:
    #
    #   bot = SupportBot()
    #   response = await bot.on_message(
    #       "Как подключить Яндекс такси?",
    #       dialog_id="tg:123",
    #       channel="telegram",
    #       user_id="123",
    #       phone="79001234567",
    #       name="Иван",
    #   )
    #   send_to_channel(response.text)
    #
    # Telegram:
    #   await bot.handle_telegram_update(update_dict)
    # WhatsApp:
    #   await bot.handle_whatsapp_webhook({"from": "7900...", "text": "..."})
    # Webchat webhook:
    #   await bot.handle_webchat({"session_id": "...", "text": "..."})

    mode = os.getenv("BOT_MODE", "demo").lower()
    support_bot = SupportBot()
    if mode == "interactive":
        _interactive(support_bot)
    else:
        asyncio.run(_demo_conversation(support_bot))
