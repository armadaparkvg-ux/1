import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { JsonLd } from "@/components/json-ld";
import { getAllArticleSlugs, getArticle } from "@/lib/articles";
import { articleJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo-meta";

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
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${article.slug}/`,
    blog: true,
    ogType: "article",
    publishedTime: article.date,
    modifiedTime: article.date,
  });
}

export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  return (
    <>
      <JsonLd id="jsonld-page" data={articleJsonLd(article)} />
      <ArticlePage article={article} />
    </>
  );
}
