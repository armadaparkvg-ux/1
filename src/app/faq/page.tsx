import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Faq } from "@/components/faq";
import { SITE } from "@/lib/constants";
import { FAQ_ITEMS } from "@/lib/seo";

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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="border-b border-border bg-[#080b11] pt-[72px]">
        <div className="mx-auto max-w-3xl px-4 pb-2 pt-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            На главную
          </Link>
        </div>
      </div>
      <Faq />
    </>
  );
}
