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
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <DocumentServiceLanding type="osgop" />
    </>
  );
}
