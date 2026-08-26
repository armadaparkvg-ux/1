import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Faq } from "@/components/faq";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, graphJsonLd, webpageJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = pageMetadata({
  title: "Частые вопросы (FAQ) — подключение к Яндекс Такси",
  description:
    "Ответы таксопарка «Армада»: самозанятый, ИП, трудовой договор, ФГИС, ОСГОП, курьеры Яндекс Доставка, сроки активации и документы.",
  path: "/faq/",
});

const crumbs = [
  { name: "Главная", href: "/" },
  { name: "FAQ" },
];

const jsonLd = graphJsonLd([
  webpageJsonLd({
    path: "/faq/",
    name: "Частые вопросы (FAQ) — подключение к Яндекс Такси",
    description:
      "Ответы таксопарка «Армада»: самозанятый, ИП, трудовой договор, ФГИС, ОСГОП и доставка.",
  }),
  breadcrumbJsonLd(crumbs),
]);

export default function FaqPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="border-b border-border bg-[#080b11] pt-[72px]">
        <div className="mx-auto max-w-3xl px-4 pb-2 pt-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            На главную
          </Link>
          <div className="mt-4">
            <Breadcrumbs items={crumbs} />
          </div>
        </div>
      </div>
      <Faq />
    </>
  );
}
