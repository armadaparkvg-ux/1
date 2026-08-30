import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/articles";
import { CITIES } from "@/lib/cities";
import { SITE } from "@/lib/constants";
import { latestArticleDate } from "@/lib/topics";

/** Trailing slashes match static export (`trailingSlash: true`). */
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = ARTICLES.map((article) => ({
    url: `${SITE.url}/blog/${article.slug}/`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const contentUpdated = new Date(latestArticleDate());
  const today = new Date("2026-08-23");

  return [
    {
      url: `${SITE.url}/`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE.url}/blog/`,
      lastModified: contentUpdated,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/o-parke/`,
      lastModified: new Date("2026-08-22"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/taxi/`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/trudovoj-dogovor/`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/delivery/`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/license/`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE.url}/osgop/`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE.url}/faq/`,
      lastModified: new Date("2026-08-23"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE.url}/goroda/`,
      lastModified: new Date("2026-08-23"),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...CITIES.map((city) => ({
      url: `${SITE.url}/goroda/${city.slug}/`,
      lastModified: new Date("2026-08-23"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...articles,
    {
      url: `${SITE.url}/privacy/`,
      lastModified: new Date("2026-07-01"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE.url}/offer/`,
      lastModified: new Date("2026-07-01"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE.url}/requisites/`,
      lastModified: new Date("2026-07-18"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
