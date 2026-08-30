import type { Metadata } from "next";
import { CourierLanding } from "@/components/courier-landing";
import { JsonLd } from "@/components/json-ld";
import { PageFaq } from "@/components/page-faq";
import { DELIVERY_FAQ } from "@/lib/page-faq";
import {
  breadcrumbJsonLd,
  graphJsonLd,
  serviceJsonLd,
  webpageJsonLd,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/seo-meta";

const DELIVERY_KEYWORDS = [
  "курьер яндекс доставка",
  "яндекс доставка курьер",
  "курьер яндекс такси",
  "курьер яндекс",
  "вакансия курьер яндекс",
  "работа курьером яндекс",
  "подключить курьера яндекс",
  "регистрация курьера яндекс",
  "стать курьером яндекс",
  "пеший курьер яндекс",
  "автокурьер яндекс",
  "автокурьер подключение",
  "мотокурьер яндекс",
  "грузовой курьер яндекс",
  "сколько зарабатывает курьер яндекс",
  "доход курьера яндекс",
  "курьер самозанятый",
  "подключение курьеров к яндекс доставке",
  "вакансия курьер",
  "работа курьером",
];

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Курьер Яндекс Доставка — подключение и вакансии",
    description:
      "Вакансия курьера Яндекс Доставка через парк «Армада»: пеший, авто, мото и грузовой. Авторегистрация, официальный доход, поддержка 8:00–21:00 Мск.",
    path: "/delivery/",
    keywords: DELIVERY_KEYWORDS,
    images: [
      {
        url: "/images/delivery-hero-banner-og.jpg",
        width: 1200,
        height: 630,
        alt: "Армада — партнёр Яндекс Доставки",
      },
    ],
  }),
};

export default function DeliveryPage() {
  const jsonLd = graphJsonLd([
    webpageJsonLd({
      path: "/delivery/",
      name: "Курьер Яндекс Доставка — подключение и вакансии",
      description:
        "Пеший, авто, мото и грузовой курьер Яндекс Доставки через парк «Армада».",
    }),
    breadcrumbJsonLd([
      { name: "Главная", href: "/" },
      { name: "Доставка" },
    ]),
    serviceJsonLd({
      name: "Подключение курьеров к Яндекс Доставке",
      serviceType: "Подключение курьеров к Яндекс Доставке",
      description:
        "Пеший, авто, мото и грузовой курьер Яндекс Доставки через парк «Армада».",
      path: "/delivery/",
    }),
  ]);
  return (
    <>
      <JsonLd id="jsonld-page" data={jsonLd} />
      <CourierLanding />
      <PageFaq
        title="Частые вопросы про курьера Яндекс Доставки"
        items={DELIVERY_FAQ}
      />
    </>
  );
}
