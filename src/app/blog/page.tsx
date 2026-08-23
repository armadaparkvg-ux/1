import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Статьи: Яндекс Такси и Доставка",
  description:
    "Гайды таксопарка «Армада»: как подключиться к Яндекс Такси, сменить парк, парковый самозанятый и ИП, трудовой договор, ФГИС, ОСГОП, курьер Яндекс Доставка.",
  keywords: [
    "подключение к яндекс такси",
    "сменить таксопарк",
    "парковый самозанятый",
    "трудовой договор яндекс такси",
    "работа курьером яндекс",
    "лицензия такси фгис",
  ],
  alternates: { canonical: `${SITE.url}/blog/` },
};

export default function BlogIndexPage() {
  const articles = [...ARTICLES].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  );

  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-24 sm:pb-12 sm:pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Полезные статьи
      </h1>
      <p className="mt-3 text-muted-foreground">
        Такси и доставка: подключение, смена парка, комиссия, трудовой договор,
        ФГИС, ОСГОП и работа курьером.
      </p>

      <ul className="mt-10 space-y-4">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${article.slug}/`}
              className="block rounded-2xl border border-border bg-surface/40 p-5 transition-colors hover:border-accent/40 hover:bg-muted/30"
            >
              <p className="text-xs text-muted-foreground">
                {article.date} · {article.readingMinutes} мин чтения
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-foreground">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {article.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 flex flex-wrap gap-4">
        <Link href="/blog/" className="text-accent hover:underline">
          Все статьи →
        </Link>
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
