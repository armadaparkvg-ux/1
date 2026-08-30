import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LicenseLanding } from "@/components/license-landing";
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

const TITLE = "Лицензия такси ФГИС: оформить выписку за 1–3 дня";
const DESCRIPTION =
  "Оформите лицензию такси ФГИС в «Армаде»: напишите в чат, пришлите фото авто и СТС с двух сторон, ждите 1–3 дня по региону, проверьте запись и оплатите 3 500 ₽.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
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
      name: TITLE,
      description: DESCRIPTION,
    }),
    breadcrumbJsonLd([
      { name: "Главная", href: "/" },
      { name: "Лицензия такси ФГИС" },
    ]),
    serviceJsonLd({
      name: "Лицензия такси ФГИС",
      serviceType: "Внесение автомобиля в реестр такси",
      description: DESCRIPTION,
      path: "/license/",
    }),
  ]);
  return (
    <>
      <JsonLd id="jsonld-page" data={jsonLd} />
      <LicenseLanding />
      <PageFaq title="Частые вопросы про лицензию такси ФГИС" items={LICENSE_FAQ} />
      <RelatedGuides
        topic="docs"
        title="Статьи про ФГИС и документы"
        excludeHref="/license/"
      />
    </>
  );
}
