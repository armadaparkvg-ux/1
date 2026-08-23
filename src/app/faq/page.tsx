import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Faq } from "@/components/faq";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/constants";
import { FAQ_ITEMS } from "@/lib/seo";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  graphJsonLd,
  webpageJsonLd,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "Частые вопросы (FAQ) — подключение к Яндекс Такси",
  description:
    "Ответы таксопарка «Армада»: самозанятый, ИП, трудовой договор, ФГИС, ОСГОП, курьеры Яндекс Доставка, сроки активации и документы.",
  alternates: { canonical: `${SITE.url}/faq/` },
  openGraph: {
    title: "FAQ — частые вопросы | Армада",
    description:
      "Самозанятый, ИП, трудовой договор, ФГИС, ОСГОП и доставка — ответы парка «Армада».",
    url: `${SITE.url}/faq/`,
  },
};

const crumbs = [
  { name: "Главная", href: "/" },
  { name: "FAQ", href: "/faq/" },
];

const jsonLd = graphJsonLd([
  webpageJsonLd({
    path: "/faq/",
    name: "Частые вопросы (FAQ) — подключение к Яндекс Такси",
    description:
      "Ответы таксопарка «Армада»: самозанятый, ИП, трудовой договор, ФГИС, ОСГОП и доставка.",
  }),
  breadcrumbJsonLd(crumbs),
  faqJsonLd(FAQ_ITEMS, `${SITE.url}/faq/`),
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
