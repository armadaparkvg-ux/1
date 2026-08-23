import type { Metadata } from "next";
import { DocumentServiceLanding } from "@/components/document-service-landing";
import { JsonLd } from "@/components/json-ld";
import { PageFaq } from "@/components/page-faq";
import { RelatedGuides } from "@/components/related-guides";
import { SITE } from "@/lib/constants";
import { OSGOP_FAQ } from "@/lib/page-faq";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  graphJsonLd,
  webpageJsonLd,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "ОСГОП для такси",
  description:
    "Оформление ОСГОП для работы в такси через парк «Армада»: 3 400 ₽ на 1 год, консультация по документам.",
  alternates: { canonical: `${SITE.url}/osgop/` },
};

export default function OsgopPage() {
  const jsonLd = graphJsonLd([
    webpageJsonLd({
      path: "/osgop/",
      name: "ОСГОП для такси",
      description:
        "Оформление ОСГОП для работы в такси через парк «Армада»: 3 400 ₽ на 1 год.",
    }),
    breadcrumbJsonLd([
      { name: "Главная", href: "/" },
      { name: "ОСГОП", href: "/osgop/" },
    ]),
    faqJsonLd(OSGOP_FAQ, `${SITE.url}/osgop/`),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <DocumentServiceLanding type="osgop" />
      <PageFaq title="Частые вопросы про ОСГОП" items={OSGOP_FAQ} />
      <RelatedGuides
        topic="docs"
        title="Статьи про документы такси"
        excludeHref="/osgop/"
      />
    </>
  );
}
