import type { Metadata } from "next";
import { DocumentServiceLanding } from "@/components/document-service-landing";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Лицензия такси ФГИС",
  description:
    "Внесение автомобиля в реестр такси ФГИС через парк «Армада»: 3 500 ₽ на 5 лет, обычно 1–3 дня.",
  alternates: { canonical: `${SITE.url}/license/` },
};

export default function LicensePage() {
  return <DocumentServiceLanding type="license" />;
}
