import { FAQ_ITEMS } from "@/lib/seo";
import type { ApplyTopic } from "@/lib/apply";

export type SiteEntryKind = "page" | "service" | "city" | "faq" | "article";

export type SiteEntry = {
  id: string;
  kind: SiteEntryKind;
  title: string;
  href: string;
  keywords: string[];
  /** Короткий ответ с сайта, без выдуманных цифр */
  snippet: string;
  applyTopic?: ApplyTopic;
};

export type SiteIntent = {
  id: string;
  label: string;
  href: string;
  query: string;
};

/** Стартовые пути — пустой пульт и полоса на главной */
export const SITE_INTENTS: SiteIntent[] = [
  {
    id: "taxi",
    label: "Подключиться к такси",
    href: "/taxi/",
    query: "подключиться к яндекс такси",
  },
  {
    id: "labor",
    label: "Трудовой договор",
    href: "/trudovoj-dogovor/",
    query: "трудовой договор",
  },
  {
    id: "license",
    label: "Лицензия ФГИС",
    href: "/license/",
    query: "лицензия такси фгис",
  },
  {
    id: "osgop",
    label: "ОСГОП",
    href: "/osgop/",
    query: "осгоп страхование",
  },
  {
    id: "delivery",
    label: "Доставка",
    href: "/delivery/",
    query: "яндекс доставка курьер",
  },
  {
    id: "city",
    label: "Город",
    href: "/goroda/",
    query: "подключение по городам",
  },
];

const PAGES: SiteEntry[] = [
  {
    id: "page-taxi",
    kind: "page",
    title: "Подключение к Яндекс Такси",
    href: "/taxi/",
    keywords: [
      "такси",
      "подключиться",
      "регистрация",
      "самозанятый",
      "ип",
      "1,9",
      "яндекс про",
    ],
    snippet:
      "Самозанятый или ИП от 1,9%, трудовой договор на отдельной странице. Активация обычно 10–15 минут, удалённо по России.",
    applyTopic: "общая заявка",
  },
  {
    id: "page-labor",
    kind: "page",
    title: "Трудовой договор без СМЗ и ИП",
    href: "/trudovoj-dogovor/",
    keywords: [
      "трудовой",
      "тк",
      "ндфл",
      "банкротство",
      "3%",
      "5%",
      "6%",
      "списания",
    ],
    snippet:
      "Оформление через поддержку парка. Три схемы: 3%+300 ₽, 5%+100 ₽ или 6% без ежедневных списаний. Налог платит парк.",
    applyTopic: "3% + 300₽",
  },
  {
    id: "page-delivery",
    kind: "page",
    title: "Курьер Яндекс Доставка",
    href: "/delivery/",
    keywords: ["доставка", "курьер", "пеший", "мото", "грузовой", "автокурьер"],
    snippet:
      "Пеший, авто, мото и грузовой курьер — у каждого формата своя форма. Подключение через тот же парк.",
    applyTopic: "курьер доставка",
  },
  {
    id: "page-license",
    kind: "service",
    title: "Лицензия такси ФГИС",
    href: "/license/",
    keywords: [
      "лицензия",
      "фгис",
      "выписка",
      "реестр",
      "стс",
      "3500",
      "3 500",
    ],
    snippet:
      "Чат, фото авто и СТС с двух сторон, документ 1–3 дня по региону, проверка в реестре, затем оплата 3 500 ₽ на 5 лет.",
    applyTopic: "лицензия ФГИС",
  },
  {
    id: "page-osgop",
    kind: "service",
    title: "ОСГОП для такси",
    href: "/osgop/",
    keywords: ["осгоп", "страховка", "страхование", "3400", "3 400"],
    snippet: "Страхование ОСГОП — 3 400 ₽ на 1 год. Оформление через чат парка.",
    applyTopic: "ОСГОП",
  },
  {
    id: "page-about",
    kind: "page",
    title: "О парке «Армада»",
    href: "/o-parke/",
    keywords: ["о парке", "армада", "история", "водители"],
    snippet:
      "Таксопарк подключает к Яндекс Такси и Доставке удалённо. Машины не сдаём, офиса приёма нет, поддержка 8:00–21:00 Мск.",
  },
  {
    id: "page-faq",
    kind: "page",
    title: "Частые вопросы",
    href: "/faq/",
    keywords: ["faq", "вопрос", "ответы"],
    snippet: "Ответы про тарифы, ФГИС, ОСГОП, доставку и оформление в парке.",
  },
  {
    id: "page-cities",
    kind: "page",
    title: "Подключение по городам",
    href: "/goroda/",
    keywords: ["города", "москва", "россия", "регион"],
    snippet:
      "Удалённое подключение по России. Отдельные страницы для десяти городов кластера.",
  },
  {
    id: "page-blog",
    kind: "page",
    title: "Статьи для водителей",
    href: "/blog/",
    keywords: ["блог", "статьи", "гайд"],
    snippet: "Разборы документов, ФГИС, тарифов и первого выхода на линию.",
  },
  {
    id: "page-requisites",
    kind: "page",
    title: "Реквизиты ООО «АРМАДА ДРАЙВЕР»",
    href: "/requisites/",
    keywords: ["реквизиты", "инн", "огрн", "ооо"],
    snippet:
      "ИНН 5050165896, КПП 505001001, ОГРН 1245000114369, Щёлково, ул. Неделина, д. 23.",
  },
];

const CITIES_SLIM: { slug: string; name: string; region: string }[] = [
  { slug: "moskva", name: "Москва", region: "Москва" },
  { slug: "sankt-peterburg", name: "Санкт-Петербург", region: "Санкт-Петербург" },
  { slug: "krasnodar", name: "Краснодар", region: "Краснодарский край" },
  { slug: "rostov-na-donu", name: "Ростов-на-Дону", region: "Ростовская область" },
  { slug: "kazan", name: "Казань", region: "Татарстан" },
  { slug: "ekaterinburg", name: "Екатеринбург", region: "Свердловская область" },
  { slug: "novosibirsk", name: "Новосибирск", region: "Новосибирская область" },
  {
    slug: "nizhniy-novgorod",
    name: "Нижний Новгород",
    region: "Нижегородская область",
  },
  { slug: "samara", name: "Самара", region: "Самарская область" },
  { slug: "voronezh", name: "Воронеж", region: "Воронежская область" },
];

const ARTICLES_SLIM: { slug: string; title: string }[] = [
  { slug: "kak-podklyuchitsya-k-yandex-taxi", title: "Как подключиться к Яндекс Такси в 2026 году" },
  { slug: "samozanyatyj-ip-trudovoj", title: "Самозанятый, ИП или трудовой договор — что выбрать" },
  { slug: "licenziya-fgis-cheklist", title: "Оформить лицензию такси ФГИС: чеклист документов" },
  { slug: "limit-npd-2-4-mln", title: "Лимит самозанятого 2,4 млн: что делать водителю" },
  { slug: "rabota-kurerom-yandex-dohod", title: "Работа курьером Яндекс Доставка: сколько можно заработать" },
  { slug: "vidy-sotrudnichestva-kurer", title: "Виды сотрудничества курьера с парком" },
  { slug: "vidy-dostavki-peshiy-avto-gruzovoy", title: "Виды доставки: пеший, авто, мото и грузовой" },
  { slug: "smenit-taksopark-yandex", title: "Как сменить таксопарк в Яндекс Такси" },
  { slug: "komissiya-parka-i-yandex-taxi", title: "Комиссия парка и комиссия Яндекс Такси" },
  { slug: "parkovyj-samozanyatyj", title: "Парковый самозанятый в Яндекс Такси" },
  { slug: "parkovyj-ip-momentalnyj-vyvod", title: "Парковый ИП и моментальный вывод" },
  { slug: "tip-zanyatosti-ne-podtverzhden", title: "«Тип занятости не подтверждён» в Яндекс Такси" },
  { slug: "osgop-dlya-taxi-chto-eto", title: "ОСГОП для такси: что это и сколько стоит" },
  { slug: "klassifikator-avto-yandex-taxi", title: "Классификатор авто Яндекс Такси" },
  { slug: "dokumenty-dlya-voditelya-yandex", title: "Какие документы нужны водителю Яндекс Такси" },
  { slug: "udalennoe-podklyuchenie-po-rossii", title: "Удалённое подключение по всей России" },
  { slug: "spravka-2ndfl-voditel-taxi", title: "Справка 2‑НДФЛ водителю такси" },
  { slug: "bankrotstvo-i-rabota-v-taxi", title: "Работа в Яндекс Такси при банкротстве" },
  { slug: "proverit-avto-v-fgis", title: "Проверка авто в ФГИС Такси" },
  { slug: "pervyj-vyhod-na-liniyu", title: "Первый выход на линию после подключения" },
  { slug: "motokurer-yandex-dostavka", title: "Мотокурьер Яндекс Доставка" },
  { slug: "kak-vybrat-taksopark", title: "Как выбрать таксопарк" },
];

function cityEntries(): SiteEntry[] {
  return CITIES_SLIM.map((city) => ({
    id: `city-${city.slug}`,
    kind: "city" as const,
    title: `Яндекс Такси в городе ${city.name}`,
    href: `/goroda/${city.slug}/`,
    keywords: [city.name.toLowerCase(), city.region.toLowerCase(), "город"],
    snippet:
      "Удалённое подключение через парк «Армада»: формат, документы в чат или форма Fleet, активация обычно 10–15 минут.",
  }));
}

function faqEntries(): SiteEntry[] {
  return FAQ_ITEMS.map((item, index) => ({
    id: `faq-${index}`,
    kind: "faq" as const,
    title: item.q,
    href: "/faq/",
    keywords: [item.q.toLowerCase()],
    snippet: item.a,
  }));
}

function articleEntries(): SiteEntry[] {
  return ARTICLES_SLIM.map((article) => ({
    id: `article-${article.slug}`,
    kind: "article" as const,
    title: article.title,
    href: `/blog/${article.slug}/`,
    keywords: [article.title.toLowerCase(), "статья"],
    snippet: article.title,
  }));
}

let cached: SiteEntry[] | null = null;

export function getSiteIndex(): SiteEntry[] {
  if (cached) return cached;
  cached = [...PAGES, ...cityEntries(), ...faqEntries(), ...articleEntries()];
  return cached;
}

export const CITY_PATH_LABELS: Record<string, string> = Object.fromEntries(
  CITIES_SLIM.map((city) => [`/goroda/${city.slug}/`, city.name])
);

export const DESTINATION_LABELS: Record<string, string> = {
  "/taxi/": "Такси",
  "/trudovoj-dogovor/": "Трудовой договор",
  "/delivery/": "Доставка",
  "/license/": "Лицензия ФГИС",
  "/osgop/": "ОСГОП",
  "/courier/": "Курьер",
  "/goroda/": "Города",
  ...CITY_PATH_LABELS,
};
