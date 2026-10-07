import Link from "next/link";
import type { Article } from "@/lib/articles";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/rich-text";
import { CONTACTS, SITE } from "@/lib/constants";
import { getRelatedArticles } from "@/lib/topics";
import { headingId } from "@/lib/utils";

export function ArticlePage({ article }: { article: Article }) {
  const sections = article.sections ?? [];
  const relatedArticles = getRelatedArticles(article.slug, 4);

  return (
    <article className="mx-auto max-w-3xl px-4 pb-8 pt-24 sm:pb-12 sm:pt-28 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Главная", href: "/" },
          { name: "Статьи", href: "/blog/" },
          { name: article.title },
        ]}
      />

      <p className="mt-4 text-sm text-muted-foreground">
        <Link href="/blog/" className="text-accent hover:underline">
          Статьи
        </Link>
        <span aria-hidden> · </span>
        <time dateTime={article.date}>{article.date}</time>
        <span aria-hidden> · </span>
        {article.readingMinutes} мин
        <span aria-hidden> · </span>
        {SITE.fullName}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-foreground text-balance sm:text-4xl">
        {article.title}
      </h1>
      <p className="article-summary mt-4 text-base leading-relaxed text-muted-foreground">
        {article.description}
      </p>

      {article.bullets?.length ? (
        <div className="article-takeaways mt-6 rounded-2xl border border-accent/25 bg-accent/5 p-5">
          <p className="text-sm font-semibold text-foreground">Коротко</p>
          <ul className="mt-3 space-y-2 text-sm text-foreground/90">
            {article.bullets.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-accent" aria-hidden>
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {sections.length > 1 ? (
        <nav
          className="mt-8 rounded-2xl border border-border bg-surface/40 p-5"
          aria-label="Содержание"
        >
          <p className="text-sm font-semibold text-foreground">Содержание</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
            {sections.map((section) => (
              <li key={section.heading}>
                <a
                  href={`#${headingId(section.heading)}`}
                  className="text-accent hover:underline"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {article.paragraphs.map((p) => (
          <RichText key={p.slice(0, 48)} text={p} />
        ))}
      </div>

      {sections.map((section) => (
        <section
          key={section.heading}
          id={headingId(section.heading)}
          className="mt-8 scroll-mt-28"
        >
          <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
            {section.heading}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/90 sm:text-base">
            {section.paragraphs.map((p) => (
              <RichText key={p.slice(0, 48)} text={p} />
            ))}
          </div>
        </section>
      ))}

      {article.relatedLinks?.length ? (
        <nav className="mt-8" aria-label="Разделы сайта">
          <p className="text-sm font-semibold text-foreground">Разделы сайта</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {article.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:border-accent/40 hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {relatedArticles.length ? (
        <nav className="mt-8" aria-label="Читайте также">
          <p className="text-sm font-semibold text-foreground">Читайте также</p>
          <ul className="mt-3 space-y-2">
            {relatedArticles.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/blog/${item.slug}/`}
                  className="text-sm text-accent hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
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
