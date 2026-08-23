import type { Metadata } from "next";
import { DocumentServiceLanding } from "@/components/document-service-landing";
import { JsonLd } from "@/components/json-ld";
import { PageFaq } from "@/components/page-faq";
import { RelatedGuides } from "@/components/related-guides";
import { SITE } from "@/lib/constants";
import { LICENSE_FAQ } from "@/lib/page-faq";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  graphJsonLd,
  webpageJsonLd,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "Лицензия такси ФГИС",
  description:
    "Внесение автомобиля в реестр такси ФГИС через парк «Армада»: 3 500 ₽ на 5 лет, обычно 1–3 дня.",
  alternates: { canonical: `${SITE.url}/license/` },
};

export default function LicensePage() {
  const jsonLd = graphJsonLd([
    webpageJsonLd({
      path: "/license/",
      name: "Лицензия такси ФГИС",
      description:
        "Внесение автомобиля в реестр такси ФГИС через парк «Армада»: 3 500 ₽ на 5 лет.",
    }),
    breadcrumbJsonLd([
      { name: "Главная", href: "/" },
      { name: "Лицензия ФГИС", href: "/license/" },
    ]),
    faqJsonLd(LICENSE_FAQ, `${SITE.url}/license/`),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <DocumentServiceLanding type="license" />
      <PageFaq title="Частые вопросы про лицензию ФГИС" items={LICENSE_FAQ} />
      <RelatedGuides
        topic="docs"
        title="Статьи про ФГИС и документы"
        excludeHref="/license/"
      />
    </>
  );
}
