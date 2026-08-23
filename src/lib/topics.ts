import { ARTICLES, type Article } from "@/lib/articles";

export type ContentTopic = "taxi" | "labor" | "delivery" | "docs" | "park";

export const TOPIC_META: Record<
  ContentTopic,
  { title: string; description: string; landing: string }
> = {
  taxi: {
    title: "Такси и подключение",
    description: "Регистрация в Яндекс Такси, комиссия парка, смена парка, документы.",
    landing: "/taxi/",
  },
  labor: {
    title: "Трудовой договор",
    description: "Работа без СМЗ и ИП, деприоритет, 2‑НДФЛ, лимит самозанятости.",
    landing: "/trudovoj-dogovor/",
  },
  delivery: {
    title: "Курьеры и доставка",
    description: "Пеший, авто, мото и грузовой курьер Яндекс Доставки.",
    landing: "/delivery/",
  },
  docs: {
    title: "ФГИС и ОСГОП",
    description: "Лицензия такси, реестр, страхование ОСГОП.",
    landing: "/license/",
  },
  park: {
    title: "О парке и выбор",
    description: "Как выбрать парк, удалённое подключение по России.",
    landing: "/o-parke/",
  },
};

const SLUG_TOPIC: Record<string, ContentTopic> = {
  "kak-podklyuchitsya-k-yandex-taxi": "taxi",
  "samozanyatyj-ip-trudovoj": "labor",
  "licenziya-fgis-cheklist": "docs",
  "limit-npd-2-4-mln": "labor",
  "rabota-kurerom-yandex-dohod": "delivery",
  "vidy-sotrudnichestva-kurer": "delivery",
  "vidy-dostavki-peshiy-avto-gruzovoy": "delivery",
  "smenit-taksopark-yandex": "taxi",
  "komissiya-parka-i-yandex-taxi": "taxi",
  "parkovyj-samozanyatyj": "taxi",
  "parkovyj-ip-momentalnyj-vyvod": "taxi",
  "tip-zanyatosti-ne-podtverzhden": "labor",
  "osgop-dlya-taxi-chto-eto": "docs",
  "klassifikator-avto-yandex-taxi": "taxi",
  "dokumenty-dlya-voditelya-yandex": "taxi",
  "udalennoe-podklyuchenie-po-rossii": "park",
  "spravka-2ndfl-voditel-taxi": "labor",
  "bankrotstvo-i-rabota-v-taxi": "labor",
  "proverit-avto-v-fgis": "docs",
  "pervyj-vyhod-na-liniyu": "taxi",
  "motokurer-yandex-dostavka": "delivery",
  "kak-vybrat-taksopark": "park",
};

export function getArticleTopic(article: Pick<Article, "slug" | "ctaHref">): ContentTopic {
  const mapped = SLUG_TOPIC[article.slug];
  if (mapped) return mapped;
  const href = article.ctaHref ?? "";
  if (href.includes("/delivery")) return "delivery";
  if (href.includes("/trudovoj")) return "labor";
  if (href.includes("/license") || href.includes("/osgop")) return "docs";
  if (href.includes("/o-parke") || href.includes("/goroda")) return "park";
  return "taxi";
}

export function articlesByTopic(topic: ContentTopic): Article[] {
  return ARTICLES.filter((article) => getArticleTopic(article) === topic).sort(
    (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
  );
}

export function getRelatedArticles(slug: string, limit = 4): Article[] {
  const current = ARTICLES.find((article) => article.slug === slug);
  const topic = current ? getArticleTopic(current) : "taxi";
  const sameTopic = articlesByTopic(topic).filter((article) => article.slug !== slug);
  if (sameTopic.length >= limit) return sameTopic.slice(0, limit);
  const extra = ARTICLES.filter(
    (article) =>
      article.slug !== slug &&
      !sameTopic.some((item) => item.slug === article.slug)
  ).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return [...sameTopic, ...extra].slice(0, limit);
}

export function latestArticleDate(): string {
  return ARTICLES.reduce(
    (max, article) => (article.date > max ? article.date : max),
    "2026-01-01"
  );
}

export const SERVICE_LINKS: Record<
  ContentTopic,
  { href: string; label: string }[]
> = {
  taxi: [
    { href: "/taxi/", label: "Подключение к Яндекс Такси" },
    { href: "/trudovoj-dogovor/", label: "Трудовой договор" },
    { href: "/goroda/", label: "По городам" },
  ],
  labor: [
    { href: "/trudovoj-dogovor/", label: "Трудовой договор" },
    { href: "/taxi/", label: "Самозанятый и ИП" },
    { href: "/faq/", label: "Частые вопросы" },
  ],
  delivery: [
    { href: "/delivery/", label: "Курьер Яндекс Доставка" },
    { href: "/taxi/", label: "Такси" },
    { href: "/goroda/", label: "По городам" },
  ],
  docs: [
    { href: "/license/", label: "Лицензия ФГИС" },
    { href: "/osgop/", label: "ОСГОП" },
    { href: "/taxi/", label: "Подключение к такси" },
  ],
  park: [
    { href: "/o-parke/", label: "О парке" },
    { href: "/taxi/", label: "Такси" },
    { href: "/delivery/", label: "Доставка" },
  ],
};
