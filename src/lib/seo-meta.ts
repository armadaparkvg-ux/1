import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

const BRAND = "Армада";

export const DEFAULT_OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "Подключение к Яндекс Такси — таксопарк Армада",
} as const;

export type OgImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

/** Title без дубля бренда. В блоге хвост « | Армада» не ставится. */
export function documentTitle(
  pageTitle: string,
  opts?: { blog?: boolean }
): string {
  const title = pageTitle.trim();
  if (opts?.blog) return title;
  if (title.toLowerCase().includes("армада")) return title;
  return `${title} | ${BRAND}`;
}

export function pageOpenGraph(opts: {
  title: string;
  description: string;
  url: string;
  type?: "website" | "article";
  images?: OgImage[];
  publishedTime?: string;
  modifiedTime?: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: opts.type ?? "website",
    locale: "ru_RU",
    siteName: SITE.fullName,
    title: opts.title,
    description: opts.description,
    url: opts.url,
    images: opts.images ?? [{ ...DEFAULT_OG_IMAGE }],
    ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    ...(opts.modifiedTime ? { modifiedTime: opts.modifiedTime } : {}),
  };
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  if (path === "/" || path === "") return SITE.url;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  blog?: boolean;
  ogType?: "website" | "article";
  images?: OgImage[];
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: Metadata["keywords"];
  robots?: Metadata["robots"];
}): Metadata {
  const title = documentTitle(opts.title, { blog: opts.blog });
  const url = absoluteUrl(opts.path);
  return {
    title: { absolute: title },
    description: opts.description,
    ...(opts.keywords ? { keywords: opts.keywords } : {}),
    ...(opts.robots ? { robots: opts.robots } : {}),
    alternates: { canonical: url },
    openGraph: pageOpenGraph({
      title,
      description: opts.description,
      url,
      type: opts.ogType ?? "website",
      images: opts.images,
      publishedTime: opts.publishedTime,
      modifiedTime: opts.modifiedTime,
    }),
  };
}
