import type { Metadata } from "next";
import { DocumentServiceLanding } from "@/components/document-service-landing";
import { JsonLd } from "@/components/json-ld";
import { PageFaq } from "@/components/page-faq";
import { RelatedGuides } from "@/components/related-guides";
import { OSGOP_FAQ } from "@/lib/page-faq";
import {
  breadcrumbJsonLd,
  graphJsonLd,
  webpageJsonLd,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "ОСГОП для такси: оформить страховку пассажиров",
    description:
      "Оформление ОСГОП для работы в такси через парк «Армада»: 3 400 ₽ на 1 год, консультация по документам. Это не ОСАГО — полис перевозчика перед пассажирами.",
    path: "/osgop/",
    images: [
      {
        url: "/images/service-osgop-og.jpg",
        width: 1200,
        height: 630,
        alt: "Полис ОСГОП — страхование гражданской ответственности перевозчика в такси",
      },
    ],
  }),
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
      { name: "ОСГОП" },
    ]),
  ]);
  return (
    <>
      <JsonLd id="jsonld-page" data={jsonLd} />
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
