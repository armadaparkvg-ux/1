import type { Metadata } from "next";
import { DocumentServiceLanding } from "@/components/document-service-landing";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ОСГОП для такси",
  description:
    "Оформление ОСГОП для работы в такси через парк «Армада»: 3 400 ₽ на 1 год, консультация по документам.",
  alternates: { canonical: `${SITE.url}/osgop/` },
};

export default function OsgopPage() {
  return <DocumentServiceLanding type="osgop" />;
}
