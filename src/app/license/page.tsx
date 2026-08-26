import type { Metadata } from "next";
import { DocumentServiceLanding } from "@/components/document-service-landing";
import { JsonLd } from "@/components/json-ld";
import { PageFaq } from "@/components/page-faq";
import { RelatedGuides } from "@/components/related-guides";
import { LICENSE_FAQ } from "@/lib/page-faq";
import {
  breadcrumbJsonLd,
  graphJsonLd,
  serviceJsonLd,
  webpageJsonLd,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Лицензия такси ФГИС: внесение авто в реестр",
    description:
      "Внесение автомобиля в реестр такси ФГИС через парк «Армада»: 3 500 ₽ на 5 лет, обычно 1–3 дня. Фото СТС и авто с четырёх сторон, оплата по факту.",
    path: "/license/",
    images: [
      {
        url: "/images/service-license.jpg",
        width: 1200,
        height: 800,
        alt: "СТС и автомобиль: документы для внесения машины в реестр такси ФГИС",
      },
    ],
  }),
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
      { name: "Лицензия ФГИС" },
    ]),
    serviceJsonLd({
      name: "Лицензия такси ФГИС",
      serviceType: "Внесение автомобиля в реестр такси",
      description:
        "Внесение автомобиля в реестр такси ФГИС через парк «Армада»: 3 500 ₽ на 5 лет.",
      path: "/license/",
    }),
  ]);
  return (
    <>
      <JsonLd id="jsonld-page" data={jsonLd} />
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
