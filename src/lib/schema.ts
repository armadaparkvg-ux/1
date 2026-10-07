import type { Article } from "@/lib/articles";
import { CONTACTS, LEGAL, SITE } from "@/lib/constants";

export type BreadcrumbItem = {
  name: string;
  href?: string;
};

const SITE_PARTS = [
  { path: "/taxi/", name: "Подключение к Яндекс Такси" },
  { path: "/trudovoj-dogovor/", name: "Трудовой договор" },
  { path: "/delivery/", name: "Курьер Яндекс Доставка" },
  { path: "/license/", name: "Лицензия такси ФГИС" },
  { path: "/goroda/", name: "Подключение по городам" },
  { path: "/faq/", name: "Частые вопросы" },
  { path: "/blog/", name: "Статьи" },
] as const;

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: `${SITE.url}/`,
    name: SITE.fullName,
    description: SITE.description,
    inLanguage: "ru-RU",
    publisher: { "@id": `${SITE.url}/#organization` },
    about: { "@id": `${SITE.url}/#organization` },
    hasPart: SITE_PARTS.map((part) => ({
      "@type": "WebPage",
      "@id": `${SITE.url}${part.path}#webpage`,
      url: `${SITE.url}${part.path}`,
      name: part.name,
      isPartOf: { "@id": `${SITE.url}/#website` },
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.fullName,
    legalName: LEGAL.legalName,
    description: SITE.description,
    url: `${SITE.url}/`,
    logo: `${SITE.url}/icon.svg`,
    image: `${SITE.url}/og.jpg`,
    taxID: LEGAL.inn,
    vatID: LEGAL.inn,
    identifier: [
      { "@type": "PropertyValue", name: "ОГРН", value: LEGAL.ogrn },
      { "@type": "PropertyValue", name: "КПП", value: LEGAL.kpp },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Неделина, д. 23",
      addressLocality: "Щёлково",
      addressRegion: "Московская область",
      postalCode: "141107",
      addressCountry: "RU",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+7-918-052-10-22",
      contactType: "customer service",
      areaServed: "RU",
      availableLanguage: "Russian",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        opens: "08:00",
        closes: "21:00",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    },
    sameAs: [CONTACTS.telegram, CONTACTS.max],
    knowsAbout: [
      "Яндекс Такси",
      "Яндекс Доставка",
      "трудовой договор для водителей такси",
      "лицензия такси ФГИС",
    ],
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => {
      const isLast = i === items.length - 1;
      const node: {
        "@type": "ListItem";
        position: number;
        name: string;
        item?: string;
      } = {
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
      };
      if (!isLast && item.href) {
        node.item = item.href.startsWith("http")
          ? item.href
          : `${SITE.url}${item.href}`;
      }
      return node;
    }),
  };
}

export function webpageJsonLd(opts: {
  path: string;
  name: string;
  description: string;
}) {
  const url = `${SITE.url}${opts.path}`;
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#organization` },
    inLanguage: "ru-RU",
  };
}

export function serviceJsonLd(opts: {
  name: string;
  serviceType: string;
  description: string;
  path: string;
}) {
  return {
    "@type": "Service",
    name: opts.name,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: { "@type": "Country", name: "Россия" },
    serviceType: opts.serviceType,
    description: opts.description,
    url: `${SITE.url}${opts.path}`,
  };
}

export function graphJsonLd(nodes: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function articlePlainText(article: Article) {
  return [
    article.description,
    ...article.paragraphs,
    ...(article.sections?.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
    ]) ?? []),
    ...(article.bullets ?? []),
  ].join(" ");
}

export function articleJsonLd(article: Article) {
  const path = `/blog/${article.slug}/`;
  const url = `${SITE.url}${path}`;

  return graphJsonLd([
    breadcrumbJsonLd([
      { name: "Главная", href: "/" },
      { name: "Блог", href: "/blog/" },
      { name: article.title },
    ]),
    {
      "@type": "Article",
      headline: article.title.slice(0, 110),
      description: article.description,
      image: `${SITE.url}/og.jpg`,
      datePublished: article.date,
      dateModified: article.date,
      inLanguage: "ru-RU",
      isAccessibleForFree: true,
      author: { "@id": `${SITE.url}/#organization` },
      publisher: { "@id": `${SITE.url}/#organization` },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
    },
  ]);
}
