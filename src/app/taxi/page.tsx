import type { Metadata } from "next";
import { TaxiLanding } from "@/components/taxi-landing";
import { JsonLd } from "@/components/json-ld";
import { PageFaq } from "@/components/page-faq";
import { RelatedGuides } from "@/components/related-guides";
import { TAXI_FAQ } from "@/lib/page-faq";
import {
  breadcrumbJsonLd,
  graphJsonLd,
  serviceJsonLd,
  webpageJsonLd,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/seo-meta";

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
  ...pageMetadata({
    title: "Подключение к Яндекс Такси — комиссия от 1,9%",
    description:
      "Подключение к Яндекс Такси через парк «Армада»: самозанятый и ИП от 1,9%, трудовой договор, классы Эконом–Элит. Удалённо по России, активация 10–15 минут.",
    path: "/taxi/",
    keywords: TAXI_KEYWORDS,
    images: [
      {
        url: "/images/taxi-premium-hero.webp",
        width: 1536,
        height: 1024,
        alt: "Автомобиль для работы в Яндекс Такси на вечерней городской улице",
      },
    ],
  }),
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
      { name: "Такси" },
    ]),
    serviceJsonLd({
      name: "Подключение к Яндекс Такси",
      serviceType: "Подключение водителей к Яндекс Такси",
      description:
        "Подключение к Яндекс Такси через парк «Армада»: самозанятый и ИП от 1,9%, трудовой договор.",
      path: "/taxi/",
    }),
  ]);
  return (
    <>
      <JsonLd id="jsonld-page" data={jsonLd} />
      <TaxiLanding />
      <PageFaq title="Частые вопросы про подключение к такси" items={TAXI_FAQ} />
      <RelatedGuides
        topic="taxi"
        title="Гайды по подключению и комиссии"
        excludeHref="/taxi/"
      />
    </>
  );
}
