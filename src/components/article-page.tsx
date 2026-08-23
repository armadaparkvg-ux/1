import Link from "next/link";
import type { Article } from "@/lib/articles";
import { Button } from "@/components/ui/button";
import { CONTACTS } from "@/lib/constants";

export function ArticlePage({ article }: { article: Article }) {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-8 pt-24 sm:pb-12 sm:pt-28 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">
        <Link href="/blog/" className="text-accent hover:underline">
          Статьи
        </Link>
        <span aria-hidden> · </span>
        {article.date} · {article.readingMinutes} мин
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground text-balance sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        {article.description}
      </p>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {article.paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>

      {article.bullets?.length ? (
        <ul className="mt-6 space-y-2 rounded-2xl border border-border bg-surface/40 p-5 text-sm text-foreground/90">
          {article.bullets.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-accent" aria-hidden>
                •
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {article.ctaHref ? (
          <Button asChild shine>
            <Link href={article.ctaHref}>{article.ctaLabel ?? "На главную"}</Link>
          </Button>
        ) : null}
        <Button asChild variant="outline" pulse>
          <a href={CONTACTS.phoneHref}>Позвонить {CONTACTS.phoneDisplay}</a>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/blog/">Все статьи</Link>
        </Button>
      </div>
    </article>
  );
}
