import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

/** Trailing slashes match static export (`trailingSlash: true`). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.url}/`,
      lastModified: new Date("2026-07-18"),
      changeFrequency: "weekly",
      priority: 1,
    },
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
      lastModified: new Date("2026-07-01"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
