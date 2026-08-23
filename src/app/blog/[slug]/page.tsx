import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import {
  ARTICLES,
  getAllArticleSlugs,
  getArticle,
} from "@/lib/articles";
import { SITE } from "@/lib/constants";

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `${SITE.url}/blog/${article.slug}/` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${SITE.url}/blog/${article.slug}/`,
    },
  };
}

export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: SITE.fullName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.fullName,
      url: SITE.url,
    },
    mainEntityOfPage: `${SITE.url}/blog/${article.slug}/`,
    image: `${SITE.url}/og.jpg`,
    inLanguage: "ru-RU",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlePage article={article} />
      <nav
        className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8"
        aria-label="Другие статьи"
      >
        <p className="text-sm font-semibold text-foreground">Читайте также</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {ARTICLES.filter((a) => a.slug !== article.slug)
            .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
            .slice(0, 5)
            .map((a) => (
              <li key={a.slug}>
                <a
                  href={`/blog/${a.slug}/`}
                  className="text-accent hover:underline"
                >
                  {a.title}
                </a>
              </li>
            ))}
        </ul>
      </nav>
    </>
  );
}
