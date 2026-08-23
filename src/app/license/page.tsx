import type { Metadata } from "next";
import { DocumentServiceLanding } from "@/components/document-service-landing";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/constants";
import {
  breadcrumbJsonLd,
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
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <DocumentServiceLanding type="license" />
    </>
  );
}
