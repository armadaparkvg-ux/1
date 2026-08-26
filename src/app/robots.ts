import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

const DISALLOW = ["/api/", "/docs/", "/go/"];

/** Поисковые и ответные боты: Яндекс Нейро берёт источники из обычного индекса. */
const AI_USER_AGENTS = [
  "Yandex",
  "Googlebot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "GoogleOther",
  "Amazonbot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
