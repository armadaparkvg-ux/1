import type { Metadata } from "next";
import { CourierLanding } from "@/components/courier-landing";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Подключение курьеров к Яндекс Доставке",
  description:
    "Пеший, авто, мото и грузовой курьер через таксопарк «Армада». Парковый самозанятый, авторегистрация, Telegram и MAX.",
  alternates: { canonical: `${SITE.url}/courier/` },
  openGraph: {
    title: "Курьеры Яндекс Доставка — парк «Армада»",
    description:
      "Подключение пешего, авто, мото и грузового курьера. Авторегистрация и поддержка в мессенджерах.",
    url: `${SITE.url}/courier/`,
  },
};

export default function CourierPage() {
  return <CourierLanding />;
}
