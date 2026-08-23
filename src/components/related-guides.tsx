import Link from "next/link";
import {
  SERVICE_LINKS,
  articlesByTopic,
  type ContentTopic,
} from "@/lib/topics";

type RelatedGuidesProps = {
  topic: ContentTopic;
  title?: string;
  description?: string;
  excludeHref?: string;
  articleLimit?: number;
};

export function RelatedGuides({
  topic,
  title = "По теме",
  description,
  excludeHref,
  articleLimit = 4,
}: RelatedGuidesProps) {
  const services = SERVICE_LINKS[topic].filter(
    (link) => link.href !== excludeHref
  );
  const articles = articlesByTopic(topic)
    .filter((article) => `/blog/${article.slug}/` !== excludeHref)
    .slice(0, articleLimit);

  if (!services.length && !articles.length) return null;

  return (
    <section className="border-t border-border py-10 sm:py-14" aria-labelledby="related-guides">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2
          id="related-guides"
          className="font-display text-2xl font-semibold text-foreground"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        ) : null}

        {services.length ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {services.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-accent/40 hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {articles.length ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/blog/${article.slug}/`}
                  className="block h-full rounded-2xl border border-border bg-surface/40 p-4 transition-colors hover:border-accent/40"
                >
                  <p className="font-medium text-foreground">{article.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {article.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
