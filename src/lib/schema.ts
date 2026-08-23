import type { Article } from "@/lib/articles";
import { SITE } from "@/lib/constants";

export type BreadcrumbItem = {
  name: string;
  href: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href.startsWith("http")
        ? item.href
        : `${SITE.url}${item.href}`,
    })),
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

export function faqJsonLd(
  items: readonly { q: string; a: string }[],
  pageUrl: string
) {
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
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
  const text = articlePlainText(article);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return graphJsonLd([
    webpageJsonLd({
      path,
      name: article.title,
      description: article.description,
    }),
    breadcrumbJsonLd([
      { name: "Главная", href: "/" },
      { name: "Статьи", href: "/blog/" },
      { name: article.title, href: path },
    ]),
    {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      dateModified: article.date,
      inLanguage: "ru-RU",
      wordCount,
      timeRequired: `PT${article.readingMinutes}M`,
      image: `${SITE.url}/og.jpg`,
      author: { "@id": `${SITE.url}/#organization` },
      publisher: { "@id": `${SITE.url}/#organization` },
      isPartOf: { "@id": `${SITE.url}/#website` },
      mainEntityOfPage: { "@id": `${url}#webpage` },
      about: {
        "@type": "Thing",
        name: article.title,
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".article-summary", ".article-takeaways", "h1", "h2"],
      },
    },
  ]);
}
