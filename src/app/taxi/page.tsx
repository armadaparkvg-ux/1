import type { Metadata } from "next";
import { TaxiLanding } from "@/components/taxi-landing";
import { SITE } from "@/lib/constants";

const TAXI_KEYWORDS = [
  "подключение к яндекс такси",
  "подключить яндекс такси",
  "парковый самозанятый",
  "парковый ИП яндекс такси",
  "трудовой договор яндекс такси",
  "таксопарк комиссия 1.9",
  "работа в яндекс такси на своем авто",
  "удалённое подключение яндекс такси",
];

export const metadata: Metadata = {
  title: "Подключение к Яндекс Такси — комиссия от 1,9%",
  description:
    "Подключение к Яндекс Такси через парк «Армада»: классы от Эконома до Элит, самозанятый и ИП от 1,9%, трудовой договор. Удалённо по России.",
  keywords: TAXI_KEYWORDS,
  alternates: { canonical: `${SITE.url}/taxi/` },
  openGraph: {
    title: "Подключение к Яндекс Такси — парк «Армада»",
    description:
      "Самозанятый и ИП от 1,9%, трудовой договор, авторегистрация.",
    url: `${SITE.url}/taxi/`,
  },
};

export default function TaxiPage() {
  return <TaxiLanding />;
}
