import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Статьи о подключении к Яндекс Такси",
  description:
    "Короткие гайды таксопарка «Армада»: как подключиться, какой тариф выбрать, лицензия ФГИС и лимит самозанятого.",
  alternates: { canonical: `${SITE.url}/blog/` },
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
        Полезные статьи
      </h1>
      <p className="mt-3 text-muted-foreground">
        Короткие материалы для водителей — без перегруза главной страницы.
      </p>

      <ul className="mt-10 space-y-4">
        {ARTICLES.map((article) => (
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

      <p className="mt-10">
        <Link href="/" className="text-accent hover:underline">
          ← На главную
        </Link>
      </p>
    </div>
  );
}
