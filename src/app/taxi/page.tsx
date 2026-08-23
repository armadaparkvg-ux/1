import type { Metadata } from "next";
import { TaxiLanding } from "@/components/taxi-landing";
import { JsonLd } from "@/components/json-ld";
import { SITE } from "@/lib/constants";
import {
  breadcrumbJsonLd,
  graphJsonLd,
  webpageJsonLd,
} from "@/lib/schema";

const TAXI_KEYWORDS = [
  "подключение к яндекс такси",
  "подключить яндекс такси",
  "как подключиться к яндекс такси",
  "регистрация в яндекс такси водитель",
  "оформление в яндекс такси",
  "яндекс такси подключение парк",
  "удалённое подключение яндекс такси",
  "парковый самозанятый",
  "парковый самозанятый яндекс такси",
  "самозанятый яндекс такси парк",
  "парковый ИП яндекс такси",
  "подключение ип к яндекс такси",
  "моментальный вывод яндекс такси",
  "трудовой договор яндекс такси",
  "трудовой договор такси",
  "официальное трудоустройство такси",
  "таксопарк комиссия 1.9",
  "низкая комиссия таксопарк",
  "сменить таксопарк яндекс",
  "работа в яндекс такси на своем авто",
  "2ндфл такси",
];

export const metadata: Metadata = {
  title: "Подключение к Яндекс Такси — комиссия от 1,9%",
  description:
    "Подключение к Яндекс Такси через парк «Армада»: самозанятый и ИП от 1,9%, трудовой договор, классы Эконом–Элит. Удалённо по России, активация 10–15 минут.",
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
  const jsonLd = graphJsonLd([
    webpageJsonLd({
      path: "/taxi/",
      name: "Подключение к Яндекс Такси — комиссия от 1,9%",
      description:
        "Подключение к Яндекс Такси через парк «Армада»: самозанятый и ИП от 1,9%, трудовой договор.",
    }),
    breadcrumbJsonLd([
      { name: "Главная", href: "/" },
      { name: "Такси", href: "/taxi/" },
    ]),
  ]);
  return (
    <>
      <JsonLd data={jsonLd} />
      <TaxiLanding />
    </>
  );
}
