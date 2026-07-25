import type { Metadata } from "next";
import { CourierLanding } from "@/components/courier-landing";
import { SITE } from "@/lib/constants";

const DELIVERY_KEYWORDS = [
  "курьер яндекс доставка",
  "курьер яндекс такси",
  "вакансия курьер яндекс",
  "работа курьером яндекс",
  "пеший курьер яндекс",
  "автокурьер яндекс",
  "грузовой курьер яндекс",
  "подключение курьеров к яндекс доставке",
  "сколько зарабатывает курьер яндекс",
  "регистрация курьера яндекс",
];

export const metadata: Metadata = {
  title: "Курьер Яндекс Доставка — подключение и вакансии",
  description:
    "Вакансия курьера Яндекс Доставка через парк «Армада»: пеший, авто, мото и грузовой. Авторегистрация, официальный доход, поддержка 8:00–21:00 Мск.",
  keywords: DELIVERY_KEYWORDS,
  alternates: { canonical: `${SITE.url}/delivery/` },
  openGraph: {
    title: "Курьер Яндекс Доставка — парк «Армада»",
    description:
      "Пеший, авто, мото и грузовой курьер. Подключение удалённо по России.",
    url: `${SITE.url}/delivery/`,
    images: [
      {
        url: "/images/delivery-hero-banner.jpg",
        width: 1536,
        height: 1024,
        alt: "Армада — партнёр Яндекс Доставки",
      },
    ],
  },
};

export default function DeliveryPage() {
  return <CourierLanding />;
}
