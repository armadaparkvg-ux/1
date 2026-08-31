#!/usr/bin/env python3
"""Build Yandex Direct Commander CSV for park-armada.ru / login azovpark."""

from __future__ import annotations

import csv
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "source"
OUT = ROOT / "import"

UTM = (
    "utm_source=yandex&utm_medium=cpc&utm_campaign={code}"
    "&utm_content={{ad_id}}&utm_term={{keyword}}"
)


def utm_url(path: str, code: str, anchor: str = "") -> str:
    if path.startswith("http"):
        base = path.split("?")[0].split("#")[0]
    else:
        base = f"https://park-armada.ru{path}"
    if not base.endswith("/"):
        base += "/"
    url = f"{base}?{UTM.format(code=code)}"
    if anchor:
        url = f"{url}#{anchor.lstrip('#')}"
    return url


def sitelink_url(path: str, code: str, anchor: str = "") -> str:
    return utm_url(path, code, anchor)


# --- copy limits (combinatorial ads) ---
TITLE_MAX, TITLE_WORD = 56, 22
TEXT_MAX, TEXT_WORD, TEXT_PUNCT = 81, 23, 15
SITELINK_TITLE_MAX, SITELINK_WORD = 30, 23
SITELINK_TITLES_SUM = 66
SITELINK_DESC_MAX = 60
CALLOUT_MAX = 25
DISPLAY_MAX = 20


def check_text(label: str, value: str, max_len: int, max_word: int, punct_max: int | None = None) -> None:
    if len(value) > max_len:
        raise SystemExit(f"{label}: {len(value)}>{max_len} «{value}»")
    for w in value.replace("—", " ").replace("-", " ").split():
        if len(w) > max_word:
            raise SystemExit(f"{label}: word {len(w)}>{max_word} «{w}»")
    if punct_max is not None:
        punct = sum(1 for ch in value if ch in ".,;:!?…—–-()\"«»%")
        if punct > punct_max:
            raise SystemExit(f"{label}: punct {punct}>{punct_max} «{value}»")


TAXI_CAMPAIGN_MINUS = [
    "заказать такси", "вызвать такси", "заказать яндекс такси", "яндекс такси заказать",
    "такси до аэропорта", "такси недорого", "дешёвое такси", "дешевое такси",
    "яндекс го", "яндекс еда", "яндекс лавка", "яндекс маркет", "доставка еды",
    "курьер", "курьером", "пеший курьер", "вакансия", "вакансии", "вакансия водитель",
    "вакансия в яндексе", "работа в яндексе", "работа в офисе яндекс",
    "hh", "хедхантер", "авито работа", "суперджоб", "работа диспетчером",
    "диспетчер такси", "оператор такси", "менеджер таксопарка",
    "скачать", "скачать яндекс про", "приложение яндекс про", "установить яндекс про",
    "apk", "взлом", "мод", "бесплатно скачать",
    "аренда авто под такси", "аренда машины под такси", "снять авто под такси",
    "работа без авто", "водитель без авто", "авто под ключ такси", "лизинг авто такси",
    "каршеринг", "uber", "убер", "ситимобил", "gett",
    "грузовое такси", "газель", "грузчики", "переезд",
    "автошкола", "обучение на права", "сдать на права", "лишение прав",
    "штраф гибдд", "гибдд",
    "франшиза такси", "франшиза таксопарка", "открыть таксопарк",
    "без гражданства", "иностранный водитель", "работа такси для иностранцев",
    "студентам", "школьник", "торрент",
]

DELIVERY_CAMPAIGN_MINUS = [
    "заказать такси", "вызвать такси", "яндекс го", "яндекс еда заказать",
    "яндекс лавка", "яндекс маркет", "доставка еды заказать",
    "вакансия в яндексе", "работа в яндексе", "работа в офисе яндекс",
    "hh", "хедхантер", "авито работа", "суперджоб",
    "скачать", "скачать яндекс про", "приложение яндекс про",
    "аренда авто", "каршеринг", "uber", "ситимобил",
    "франшиза", "открыть таксопарк",
    "без гражданства", "иностранный водитель",
    "трудовой договор такси", "2ндфл такси",
    "пассажир", "эконом комфорт",
]

BRAND_MINUS = ["вакансия", "франшиза", "открыть таксопарк", "скачать"]

P4_GROUP_MINUS = [
    "курьер", "доставка", "пеший", "мотокурьер",
    "заказать такси", "вызвать такси",
    "аренда авто", "без авто",
    "авторегистрация", "квиз",
]

P2_GROUP_MINUS = [
    "трудовой договор", "без самозанятости", "без ип",
    "курьер", "доставка", "заказать такси",
]

P10_GROUP_MINUS = [
    "заказать еду", "яндекс еда вакансия офис",
    "вызвать такси", "водитель такси эконом",
]


def phrase(keyword: str) -> str:
    k = keyword.strip()
    if k.startswith('"') or k.startswith("["):
        return k
    return f'"{k}"'


ADS = {
    "labor": {
        "titles": [
            "Работа в Яндекс Такси без СМЗ и ИП",
            "Трудовой договор с парком Армада",
            "Налоги платит парк, 3 тарифа",
            "Без самозанятости и без ИП",
            "2-НДФЛ по запросу для такси",
            "Удалённое оформление по России",
            "Лимит НПД — оформите трудовой",
        ],
        "texts": [
            "Налоги платит парк. Тарифы 3%+300₽, 5%+100₽ или 6%",
            "Оформление через поддержку парка. Удалённо, РФ",
            "2-НДФЛ по запросу. Заявка в чат, без авторегистрации",
        ],
        "display": "trudovoj-dogovor",
        "callouts": [
            "Без самозанятости и ИП",
            "Налоги платит парк",
            "2-НДФЛ по запросу",
            "Удалённо по России",
        ],
    },
    "smz": {
        "titles": [
            "Подключение к Яндекс Такси от 1,9%",
            "Парковый самозанятый в Армаде",
            "Активация аккаунта 10–15 минут",
            "Авторегистрация онлайн в парке",
            "Комиссия парка отдельно, от 1,9%",
            "Удалённо по всей России",
            "Моментальный вывод для СМЗ",
        ],
        "texts": [
            "Парковый самозанятый. Комиссия парка от 1,9%",
            "Авторегистрация онлайн. Активация 10–15 минут",
            "Удалённо по России. Своё авто, гражданство РФ",
        ],
        "display": "taxi",
        "callouts": [
            "Комиссия парка от 1,9%",
            "Активация 10–15 минут",
            "Авторегистрация онлайн",
            "Удалённо по России",
        ],
    },
    "connect": {
        "titles": [
            "Подключить Яндекс Такси через парк",
            "Таксопарк Армада, комиссия от 1,9%",
            "Удалённое подключение по России",
            "Самозанятый, ИП или трудовой",
            "Активация аккаунта 10–15 минут",
            "Сменить парк Яндекс Такси",
            "Подключение к Яндекс Про парком",
        ],
        "texts": [
            "Подключаем к Яндекс Такси удалённо по России",
            "Комиссия парка от 1,9%. Активация 10–15 минут",
            "Выберите СМЗ, ИП или трудовой договор на сайте",
        ],
        "display": "taxi",
        "callouts": [
            "Комиссия парка от 1,9%",
            "Активация 10–15 минут",
            "Удалённо по России",
            "СМЗ, ИП или трудовой",
        ],
    },
    "ip": {
        "titles": [
            "Парковый ИП в Яндекс Такси",
            "Моментальный вывод для ИП",
            "Подключение ИП к Яндекс Про",
            "Комиссия парка ИП от 1,9%",
            "Переход с СМЗ на ИП в парке",
            "Таксопарк Армада для ИП",
            "Активация 10–15 минут онлайн",
        ],
        "texts": [
            "Парковый ИП: комиссия от 1,9% и моментальный вывод",
            "Авторегистрация онлайн. Удалённо по России",
            "Поможем перейти с самозанятого на ИП в парке",
        ],
        "display": "taxi",
        "callouts": [
            "Комиссия парка от 1,9%",
            "Моментальный вывод",
            "Авторегистрация онлайн",
            "Удалённо по России",
        ],
    },
    "delivery": {
        "titles": [
            "Курьер Яндекс Доставка в парке",
            "Пеший, авто, мото и грузовой",
            "Парковый самозанятый курьер",
            "Подключение курьера онлайн",
            "Яндекс Доставка через Армаду",
            "Активация 10–15 минут",
            "Удалённо по всей России",
        ],
        "texts": [
            "Пеший, авто, мото и грузовой курьер через парк",
            "Парковый самозанятый. Подключение онлайн",
            "Удалённо по России. Активация 10–15 минут",
        ],
        "display": "delivery",
        "callouts": [
            "Пеший авто мото груз",
            "Парковый самозанятый",
            "Подключение онлайн",
            "Активация 10–15 мин",
        ],
    },
    "fgis": {
        "titles": [
            "Внести авто в реестр такси",
            "Лицензия такси ФГИС 3500₽",
            "Реестр такси на 5 лет онлайн",
            "Оформить лицензию такси",
            "ФГИС такси, оплата по факту",
            "Обычно готово за 1–3 дня",
            "Проверка авто в реестре такси",
        ],
        "texts": [
            "Внесём авто в реестр такси. 3500₽ на 5 лет",
            "Обычно 1–3 дня. Оплата после проверки документа",
            "Нужны фото авто и СТС. Заявка в чат парка",
        ],
        "display": "license",
        "callouts": [
            "3500₽ на 5 лет",
            "Оплата по факту",
            "Обычно 1–3 дня",
            "Удалённо по России",
        ],
    },
    "osgop": {
        "titles": [
            "ОСГОП для работы в такси",
            "Страховка ОСГОП 3400₽ / год",
            "Оформить ОСГОП онлайн",
            "ОСГОП для легальной работы",
            "Страхование такси на 1 год",
            "ОСГОП через парк Армада",
            "Документ для реестра такси",
        ],
        "texts": [
            "ОСГОП для такси: 3400₽ на 1 год, оформление онлайн",
            "Нужно для легальной работы. Заявка в чат парка",
            "Парк Армада оформляет ОСГОП удалённо по России",
        ],
        "display": "osgop",
        "callouts": [
            "3400₽ на 1 год",
            "Для легальной работы",
            "Оформление онлайн",
            "Удалённо по России",
        ],
    },
    "brand": {
        "titles": [
            "Таксопарк Армада — официальный",
            "Подключение к Яндекс Такси",
            "Комиссия парка от 1,9%",
            "Армада Драйвер, удалённо РФ",
            "Такси, доставка, ФГИС, ОСГОП",
            "Активация аккаунта 10–15 мин",
            "Поддержка 8:00–21:00 Мск",
        ],
        "texts": [
            "Таксопарк Армада: такси, доставка, ФГИС и ОСГОП",
            "Комиссия от 1,9%. Удалённо по России",
            "Телефон +7 918 052-10-22, ежедневно 8:00–21:00",
        ],
        "display": "park-armada",
        "callouts": [
            "Комиссия парка от 1,9%",
            "Удалённо по России",
            "Поддержка 8:00–21:00",
            "ООО АРМАДА ДРАЙВЕР",
        ],
    },
    "limit": {
        "titles": [
            "Лимит самозанятого 2,4 млн",
            "Превысили НПД — что делать",
            "Трудовой договор вместо СМЗ",
            "Лимит НПД у водителя такси",
            "Не хотите ИП после лимита",
            "Переход с НПД на трудовой",
            "Статья и оформление в парке",
        ],
        "texts": [
            "Если упёрлись в лимит НПД — оформите трудовой",
            "Разбор лимита 2,4 млн и переход без ИП",
            "Налоги платит парк. Заявка через чат Армады",
        ],
        "display": "limit-npd",
        "callouts": [
            "Лимит НПД 2,4 млн",
            "Можно без ИП",
            "Налоги платит парк",
            "Удалённо по России",
        ],
    },
}


def sl(titles: list[str], descs: list[str], urls: list[str]) -> tuple[str, str, str]:
    joined = "".join(titles[:4])
    if len(joined) > SITELINK_TITLES_SUM:
        raise SystemExit(f"sitelink titles sum {len(joined)}>{SITELINK_TITLES_SUM}: {titles[:4]}")
    for t, d, u in zip(titles, descs, urls):
        check_text("sitelink title", t, SITELINK_TITLE_MAX, SITELINK_WORD)
        check_text("sitelink desc", d, SITELINK_DESC_MAX, 23)
        if not u.startswith("http"):
            raise SystemExit(u)
    return "||".join(titles), "||".join(descs), "||".join(urls)


SITELINKS = {
    "mixed": sl(
        ["Трудовой договор", "Самозанятый 1,9%", "Доставка", "Лицензия ФГИС"],
        ["Без СМЗ и ИП, 3 тарифа", "Парковый СМЗ, такси", "Курьер Яндекс Доставка", "Реестр такси 3500₽ / 5 лет"],
        [
            sitelink_url("/trudovoj-dogovor/", "sitelink_labor"),
            sitelink_url("/taxi/", "sitelink_smz", "formats"),
            sitelink_url("/delivery/", "sitelink_delivery", "courier-tariffs"),
            sitelink_url("/license/", "sitelink_license"),
        ],
    ),
    "p4": sl(
        ["Тарифы 3/5/6%", "FAQ трудового", "Справка 2-НДФЛ", "Лицензия ФГИС"],
        ["Три схемы с парком", "Частые вопросы по ТК", "Статья про 2-НДФЛ", "Реестр такси 3500₽"],
        [
            sitelink_url("/trudovoj-dogovor/", "sitelink_labor_tariffs", "labor-tariffs"),
            sitelink_url("/trudovoj-dogovor/", "sitelink_labor_faq", "faq"),
            sitelink_url("/blog/spravka-2ndfl-voditel-taxi/", "sitelink_2ndfl"),
            sitelink_url("/license/", "sitelink_license"),
        ],
    ),
    "p10": sl(
        ["Тарифы курьера", "FAQ доставки", "Такси от 1,9%", "Лицензия ФГИС"],
        ["Пеший авто мото груз", "Вопросы курьерам", "Парковый самозанятый", "Реестр такси 3500₽"],
        [
            sitelink_url("/delivery/", "sitelink_courier_tariffs", "courier-tariffs"),
            sitelink_url("/delivery/", "sitelink_delivery_faq", "faq"),
            sitelink_url("/taxi/", "sitelink_smz", "formats"),
            sitelink_url("/license/", "sitelink_license"),
        ],
    ),
    "p5": sl(
        ["Подать на ФГИС", "FAQ лицензии", "ОСГОП 3400₽", "Такси от 1,9%"],
        ["Фото авто и СТС", "Сроки и оплата", "Страховка на 1 год", "Подключение водителя"],
        [
            sitelink_url("/license/", "sitelink_fgis_apply", "apply-service"),
            sitelink_url("/license/", "sitelink_fgis_faq", "faq"),
            sitelink_url("/osgop/", "sitelink_osgop"),
            sitelink_url("/taxi/", "sitelink_smz", "formats"),
        ],
    ),
    "p5b": sl(
        ["Оформить ОСГОП", "Лицензия ФГИС", "Такси от 1,9%", "FAQ парка"],
        ["3400₽ на 1 год", "Реестр такси 3500₽", "Парковый самозанятый", "Частые вопросы"],
        [
            sitelink_url("/osgop/", "sitelink_osgop", "apply-service"),
            sitelink_url("/license/", "sitelink_license"),
            sitelink_url("/taxi/", "sitelink_smz", "formats"),
            sitelink_url("/faq/", "sitelink_faq"),
        ],
    ),
    "p8": sl(
        ["Трудовой договор", "Тарифы 3/5/6%", "Самозанятый 1,9%", "Статья лимит НПД"],
        ["Без СМЗ и ИП", "Три схемы с парком", "Комиссия от 1,9%", "Разбор лимита 2,4 млн"],
        [
            sitelink_url("/trudovoj-dogovor/", "sitelink_labor"),
            sitelink_url("/trudovoj-dogovor/", "sitelink_labor_tariffs", "labor-tariffs"),
            sitelink_url("/taxi/", "sitelink_smz", "formats"),
            sitelink_url("/blog/limit-npd-2-4-mln/", "sitelink_limit_article"),
        ],
    ),
}


def validate_ads() -> None:
    for name, ad in ADS.items():
        for t in ad["titles"]:
            check_text(f"{name} title", t, TITLE_MAX, TITLE_WORD)
        for t in ad["texts"]:
            check_text(f"{name} text", t, TEXT_MAX, TEXT_WORD, TEXT_PUNCT)
        if len(ad["display"]) > DISPLAY_MAX:
            raise SystemExit(f"display {ad['display']}")
        for c in ad["callouts"]:
            check_text(f"{name} callout", c, CALLOUT_MAX, 23)


HEADERS = [
    "Название кампании",
    "Тип кампании",
    "Минус-фразы на кампанию",
    "Валюта",
    "Доп. объявление группы",
    "Тип объявления",
    "ID группы",
    "Название группы",
    "Номер группы",
    "ID фразы",
    "Фраза (с минус-словами)",
    "ID объявления",
    "Заголовок 1",
    "Заголовок 2",
    "Заголовок 3",
    "Заголовок 4",
    "Заголовок 5",
    "Заголовок 6",
    "Заголовок 7",
    "Текст 1",
    "Текст 2",
    "Текст 3",
    "Ссылка",
    "Отображаемая ссылка",
    "Регион",
    "Ставка",
    "Заголовки быстрых ссылок",
    "Описания быстрых ссылок",
    "Адреса быстрых ссылок",
    "Уточнения",
    "Минус-фразы на группу",
    "Метки",
]


def empty_row() -> dict[str, str]:
    return {h: "" for h in HEADERS}


def load_keywords() -> list[dict[str, str]]:
    rows = []
    with (SOURCE / "yandex-direct-keywords.csv").open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r["campaign"] == "П4_Поиск_Трудовой":
                continue
            rows.append(r)
    with (SOURCE / "p4-trudovoj-keywords.csv").open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            rows.append(
                {
                    "campaign": r["campaign"],
                    "ad_group": r["cluster"],
                    "keyword": r["keyword"],
                    "intent": r.get("intent", "H"),
                    "landing": r["landing"],
                }
            )
    return rows


DELIVERY_KEYWORDS = [
    ("Пеший курьер", "курьер яндекс доставка"),
    ("Пеший курьер", "подключить курьера яндекс доставка"),
    ("Пеший курьер", "пеший курьер яндекс"),
    ("Пеший курьер", "пеший курьер яндекс доставка"),
    ("Пеший курьер", "работа курьером яндекс доставка"),
    ("Автокурьер", "автокурьер яндекс доставка"),
    ("Автокурьер", "курьер на авто яндекс"),
    ("Автокурьер", "подключение автокурьера"),
    ("Мотокурьер", "мотокурьер яндекс"),
    ("Мотокурьер", "мотокурьер яндекс доставка"),
    ("Грузовой курьер", "грузовой курьер яндекс"),
    ("Грузовой курьер", "грузовой курьер яндекс доставка"),
    ("Парковый курьер", "парковый самозанятый курьер"),
    ("Парковый курьер", "подключение к яндекс доставке"),
    ("Парковый курьер", "курьер яндекс про парк"),
]


def campaigns_spec() -> list[dict]:
    """Launch set: search only, no quiz, no RSYA yet."""
    return [
        {
            "name": "П4_Поиск_Трудовой",
            "utm": "p4_trudovoj",
            "ad": "labor",
            "sitelinks": "p4",
            "minus": TAXI_CAMPAIGN_MINUS,
            "group_minus": P4_GROUP_MINUS,
            "bid": "70",
            "include": lambda r: r["campaign"] == "П4_Поиск_Трудовой" and r.get("ad_group", "").startswith(
                ("A_", "B_", "C_", "D_", "E_", "F_")
            ),
            "group_from": lambda r: {
                "A_ядро": "П4 Трудовой ядро",
                "B_без_смз_ип": "П4 Без СМЗ и ИП",
                "C_лимит_смз": "П4 Лимит НПД",
                "D_налоги_документы": "П4 2-НДФЛ и налоги",
                "E_банкротство_статус": "П4 Банкротство и занятость",
                "F_комиссия_бренд": "П4 Комиссия и бренд",
            }.get(r["ad_group"], r["ad_group"]),
            "url": lambda _r: utm_url("/trudovoj-dogovor/", "p4_trudovoj"),
        },
        {
            "name": "П2_Поиск_Самозанятый",
            "utm": "p2_samozanyatyj",
            "ad": "smz",
            "sitelinks": "mixed",
            "minus": TAXI_CAMPAIGN_MINUS + ["трудовой договор"],
            "group_minus": P2_GROUP_MINUS,
            "bid": "55",
            "include": lambda r: r["campaign"] == "П2_Поиск_Самозанятый",
            "group_from": lambda r: r["ad_group"],
            "url": lambda _r: utm_url("/taxi/", "p2_samozanyatyj", "formats"),
        },
        {
            "name": "П1_Поиск_Подключение",
            "utm": "p1_podklyuchenie",
            "ad": "connect",
            "sitelinks": "mixed",
            "minus": TAXI_CAMPAIGN_MINUS,
            "group_minus": ["трудовой договор", "без самозанятости", "курьер"],
            "bid": "50",
            "include": lambda r: r["campaign"] == "П1_Поиск_Подключение",
            "group_from": lambda r: r["ad_group"],
            "url": lambda _r: utm_url("/taxi/", "p1_podklyuchenie", "formats"),
        },
        {
            "name": "П3_Поиск_ИП",
            "utm": "p3_ip",
            "ad": "ip",
            "sitelinks": "mixed",
            "minus": TAXI_CAMPAIGN_MINUS + ["трудовой договор", "курьер"],
            "group_minus": ["курьер", "заказать такси"],
            "bid": "50",
            "include": lambda r: r["campaign"] == "П3_Поиск_ИП",
            "group_from": lambda r: r["ad_group"],
            "url": lambda _r: utm_url("/taxi/", "p3_ip", "formats"),
        },
        {
            "name": "П10_Поиск_Доставка",
            "utm": "delivery_courier",
            "ad": "delivery",
            "sitelinks": "p10",
            "minus": DELIVERY_CAMPAIGN_MINUS,
            "group_minus": P10_GROUP_MINUS,
            "bid": "45",
            "synthetic": DELIVERY_KEYWORDS,
            "url_fixed": utm_url("/delivery/", "delivery_courier", "courier-tariffs"),
        },
        {
            "name": "П5_Поиск_ФГИС",
            "utm": "p5_fgis",
            "ad": "fgis",
            "sitelinks": "p5",
            "minus": TAXI_CAMPAIGN_MINUS + ["фгис зерно", "фгис меркурий", "честный знак"],
            "group_minus": ["курьер", "заказать такси", "фгис зерно", "фгис меркурий"],
            "bid": "35",
            "include": lambda r: r["campaign"] == "П5_Поиск_ФГИС" and r["ad_group"] != "ОСГОП",
            "group_from": lambda r: r["ad_group"],
            "url": lambda _r: utm_url("/license/", "p5_fgis"),
        },
        {
            "name": "П5b_Поиск_ОСГОП",
            "utm": "p5_osgop",
            "ad": "osgop",
            "sitelinks": "p5b",
            "minus": TAXI_CAMPAIGN_MINUS + ["фгис зерно", "фгис меркурий"],
            "group_minus": ["курьер", "заказать такси"],
            "bid": "30",
            "include": lambda r: r["campaign"] == "П5_Поиск_ФГИС" and r["ad_group"] == "ОСГОП",
            "group_from": lambda r: "ОСГОП такси",
            "url": lambda _r: utm_url("/osgop/", "p5_osgop"),
        },
        {
            "name": "П6_Поиск_Бренд",
            "utm": "p6_brand",
            "ad": "brand",
            "sitelinks": "mixed",
            "minus": BRAND_MINUS,
            "group_minus": ["вакансия", "франшиза"],
            "bid": "20",
            "include": lambda r: r["campaign"] == "П6_Поиск_Бренд",
            "group_from": lambda r: r["ad_group"],
            "url": lambda r: r["landing"]
            if "park-armada.ru" in r["landing"]
            else utm_url("/", "p6_brand"),
        },
        {
            "name": "П8_Поиск_Лимит_НПД",
            "utm": "p8_limit_npd",
            "ad": "limit",
            "sitelinks": "p8",
            "minus": TAXI_CAMPAIGN_MINUS,
            "group_minus": ["курьер", "заказать такси"],
            "bid": "40",
            "include": lambda r: r["campaign"] == "П8_Поиск_Лимит_НПД",
            "group_from": lambda r: r["ad_group"],
            "url": lambda _r: utm_url("/blog/limit-npd-2-4-mln/", "p8_limit_npd"),
        },
    ]


def build_rows(all_kw: list[dict[str, str]]) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    group_no = 1
    for spec in campaigns_spec():
        grouped: dict[str, list] = defaultdict(list)
        if spec.get("synthetic"):
            for gname, kw in spec["synthetic"]:
                grouped[gname].append({"keyword": kw})
        else:
            for r in all_kw:
                if spec["include"](r):
                    grouped[spec["group_from"](r)].append(r)
        if not grouped:
            continue
        ad = ADS[spec["ad"]]
        sl_t, sl_d, sl_u = SITELINKS[spec["sitelinks"]]
        camp_minus = ", ".join(spec["minus"])
        grp_minus = ", ".join(spec["group_minus"])
        for gname, kws in grouped.items():
            seen = set()
            uniq = []
            for r in kws:
                k = r["keyword"].strip().lower()
                if k in seen:
                    continue
                seen.add(k)
                uniq.append(r)
            first = True
            for r in uniq:
                row = empty_row()
                row["Название кампании"] = spec["name"]
                row["Тип кампании"] = "Единая перфоманс-кампания"
                row["Минус-фразы на кампанию"] = camp_minus
                row["Валюта"] = "RUB"
                row["Доп. объявление группы"] = "-"
                row["Тип объявления"] = "Комбинаторное"
                row["Название группы"] = gname
                row["Номер группы"] = str(group_no)
                row["Фраза (с минус-словами)"] = phrase(r["keyword"])
                row["Регион"] = "Россия"
                row["Ставка"] = spec["bid"]
                row["Минус-фразы на группу"] = grp_minus
                row["Метки"] = spec["utm"]
                if first:
                    titles = ad["titles"]
                    texts = ad["texts"]
                    for i, t in enumerate(titles, start=1):
                        row[f"Заголовок {i}"] = t
                    for i, t in enumerate(texts, start=1):
                        row[f"Текст {i}"] = t
                    if spec.get("url_fixed"):
                        row["Ссылка"] = spec["url_fixed"]
                    else:
                        row["Ссылка"] = spec["url"](r)
                    row["Отображаемая ссылка"] = ad["display"]
                    row["Заголовки быстрых ссылок"] = sl_t
                    row["Описания быстрых ссылок"] = sl_d
                    row["Адреса быстрых ссылок"] = sl_u
                    row["Уточнения"] = "||".join(ad["callouts"])
                    first = False
                out.append(row)
            group_no += 1
    return out


def write_csv(rows: list[dict[str, str]]) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / "commander-azovpark-search.csv"
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=HEADERS, delimiter=";", extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)
    return path


def write_minus_files() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "minus-taxi-campaigns.txt").write_text(
        "\n".join(TAXI_CAMPAIGN_MINUS) + "\n", encoding="utf-8"
    )
    (OUT / "minus-delivery-campaign.txt").write_text(
        "\n".join(DELIVERY_CAMPAIGN_MINUS) + "\n", encoding="utf-8"
    )


def write_map(rows: list[dict[str, str]]) -> Path:
    path = OUT / "campaign-url-map.csv"
    seen = set()
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["campaign", "group", "keyword", "url", "utm"])
        for r in rows:
            key = (r["Название кампании"], r["Название группы"], r["Фраза (с минус-словами)"])
            if key in seen:
                continue
            seen.add(key)
            url = r["Ссылка"]
            # fill-down url from first row of group for map readability
            w.writerow(
                [
                    r["Название кампании"],
                    r["Название группы"],
                    r["Фраза (с минус-словами)"],
                    url,
                    r["Метки"],
                ]
            )
    # second pass fill-down
    filled = []
    last_url = ""
    last_utm = ""
    last_camp = ""
    last_group = ""
    with path.open(encoding="utf-8") as f:
        rd = csv.DictReader(f)
        for r in rd:
            if r["url"]:
                last_url, last_utm = r["url"], r["utm"]
                last_camp, last_group = r["campaign"], r["group"]
            else:
                r["url"], r["utm"] = last_url, last_utm
            filled.append(r)
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["campaign", "group", "keyword", "url", "utm"])
        w.writeheader()
        w.writerows(filled)
    return path


def write_ads_md() -> None:
    lines = ["# Объявления для кабинета azovpark\n"]
    for key, ad in ADS.items():
        lines.append(f"## {key}\n")
        for i, t in enumerate(ad["titles"], 1):
            lines.append(f"- H{i} ({len(t)}): {t}")
        for i, t in enumerate(ad["texts"], 1):
            lines.append(f"- T{i} ({len(t)}): {t}")
        lines.append(f"- display: `{ad['display']}`")
        lines.append(f"- callouts: {', '.join(ad['callouts'])}")
        lines.append("")
    (OUT / "ads.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    validate_ads()
    kws = load_keywords()
    rows = build_rows(kws)
    path = write_csv(rows)
    write_minus_files()
    write_map(rows)
    write_ads_md()
    camps = sorted({r["Название кампании"] for r in rows})
    groups = len({(r["Название кампании"], r["Название группы"]) for r in rows})
    phrases = sum(1 for r in rows if r["Фраза (с минус-словами)"])
    print(f"wrote {path}")
    print(f"campaigns={len(camps)} groups={groups} phrase_rows={phrases}")
    for c in camps:
        print(" -", c)
    return 0


if __name__ == "__main__":
    sys.exit(main())
