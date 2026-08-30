import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { pageMetadata } from "@/lib/seo-meta";
import {
  TOPIC_META,
  articlesByTopic,
  type ContentTopic,
} from "@/lib/topics";

export const metadata: Metadata = pageMetadata({
  title: "Статьи: подключение к Яндекс Такси и доставка",
  description:
    "Гайды таксопарка «Армада»: как подключиться к Яндекс Такси, сменить парк, парковый самозанятый и ИП, трудовой договор, ФГИС, ОСГОП, курьер Яндекс Доставка.",
  path: "/blog/",
  keywords: [
    "подключение к яндекс такси",
    "сменить таксопарк",
    "парковый самозанятый",
    "трудовой договор яндекс такси",
    "работа курьером яндекс",
    "лицензия такси фгис",
  ],
});

const TOPIC_ORDER: ContentTopic[] = [
  "taxi",
  "labor",
  "delivery",
  "docs",
  "park",
];

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-24 sm:pb-12 sm:pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Полезные статьи
      </h1>
      <p className="mt-3 text-muted-foreground">
        Такси и доставка: подключение, смена парка, комиссия, трудовой договор,
        ФГИС, ОСГОП и работа курьером.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Темы">
        {TOPIC_ORDER.map((topic) => (
          <a
            key={topic}
            href={`#tema-${topic}`}
            className="inline-flex rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:border-accent/40 hover:text-accent"
          >
            {TOPIC_META[topic].title}
          </a>
        ))}
      </nav>

      {TOPIC_ORDER.map((topic) => {
        const articles = articlesByTopic(topic);
        if (!articles.length) return null;
        const meta = TOPIC_META[topic];
        return (
          <section
            key={topic}
            id={`tema-${topic}`}
            className="mt-10 scroll-mt-28"
          >
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {meta.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {meta.description}
                </p>
              </div>
              <Link
                href={meta.landing}
                className="text-sm text-accent hover:underline"
              >
                К разделу →
              </Link>
            </div>
            <ul className="mt-5 space-y-3">
              {articles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/blog/${article.slug}/`}
                    className="block rounded-2xl border border-border bg-surface/40 p-5 transition-colors hover:border-accent/40 hover:bg-muted/30"
                  >
                    <p className="text-xs text-muted-foreground">
                      {article.date} · {article.readingMinutes} мин чтения
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {article.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <p className="mt-10 text-xs text-muted-foreground">
        Всего материалов: {ARTICLES.length}
      </p>

      <p className="mt-6 flex flex-wrap gap-4">
        <Link href="/delivery/" className="text-accent hover:underline">
          Доставка →
        </Link>
        <Link href="/taxi/" className="text-accent hover:underline">
          Такси →
        </Link>
        <Link href="/" className="text-accent hover:underline">
          ← На главную
        </Link>
      </p>
    </div>
  );
}
