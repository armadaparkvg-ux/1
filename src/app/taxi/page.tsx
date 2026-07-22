import type { Metadata } from "next";
import { TaxiLanding } from "@/components/taxi-landing";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Подключение к Яндекс Такси",
  description:
    "Подключение к Яндекс Такси через парк «Армада»: классы от Эконома до Элит, самозанятый и ИП от 1,9%, трудовой договор.",
  alternates: { canonical: `${SITE.url}/taxi/` },
};

export default function TaxiPage() {
  return <TaxiLanding />;
}
