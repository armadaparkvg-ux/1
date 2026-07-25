import type { Metadata } from "next";
import { LaborLanding } from "@/components/labor-landing";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Трудовой договор без самозанятости и ИП",
  description:
    "Работа в Яндекс Такси без СМЗ и ИП через таксопарк «Армада»: трудовой договор, снятие деприоритета по типу занятости. Тарифы 3%+300₽, 5%+100₽, 6% без списаний.",
  keywords: [
    "трудовой договор яндекс такси",
    "работа в такси без самозанятости",
    "работа в такси без ИП",
    "деприоритет тип занятости",
    "официальное трудоустройство такси",
    "2ндфл такси",
    "таксопарк Армада трудовой договор",
  ],
  alternates: { canonical: `${SITE.url}/trudovoj-dogovor/` },
  openGraph: {
    title: "Трудовой договор без СМЗ и ИП — таксопарк «Армада»",
    description:
      "Официальное оформление в Яндекс Такси через парк «Армада»: три тарифа, документы онлайн, поддержка ежедневно.",
    url: `${SITE.url}/trudovoj-dogovor/`,
    images: [
      {
        url: `${SITE.url}/images/labor-limit-hero.jpg`,
        width: 1280,
        height: 1280,
        alt: "Превысил лимит по самозанятости — подключайся в парк Армада по ТК РФ",
      },
    ],
  },
};

export default function TrudovojDogovorPage() {
  return <LaborLanding />;
}
