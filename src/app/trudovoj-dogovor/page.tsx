import type { Metadata } from "next";
import { LaborLanding } from "@/components/labor-landing";
import { RelatedGuides } from "@/components/related-guides";
import { SITE } from "@/lib/constants";
import { buildLaborJsonLd } from "@/lib/labor-faq";
import { pageMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Трудовой договор в такси без самозанятости и ИП",
    description:
      "Работа в Яндекс Такси без СМЗ и ИП через таксопарк «Армада»: трудовой договор, снятие деприоритета по типу занятости. Тарифы 3%+300₽, 5%+100₽, 6% без списаний.",
    path: "/trudovoj-dogovor/",
    keywords: [
      "трудовой договор яндекс такси",
      "работа в такси без самозанятости",
      "работа в такси без ИП",
      "деприоритет тип занятости",
      "официальное трудоустройство такси",
      "2ндфл такси",
      "таксопарк Армада трудовой договор",
      "превышен лимит самозанятого такси",
      "работа в яндекс такси по тк",
    ],
    images: [
      {
        url: "/images/labor-limit-hero.jpg",
        width: 1024,
        height: 1024,
        alt: "Превысил лимит по самозанятости — подключайся в парк Армада по ТК РФ",
      },
    ],
  }),
};

export default function TrudovojDogovorPage() {
  const jsonLd = buildLaborJsonLd(SITE.url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LaborLanding />
      <RelatedGuides
        topic="labor"
        title="Гайды про трудовой договор и 2‑НДФЛ"
        excludeHref="/trudovoj-dogovor/"
      />
    </>
  );
}
