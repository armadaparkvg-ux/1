import type { Metadata } from "next";
import { CourierLanding } from "@/components/courier-landing";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Подключение курьеров к Яндекс Доставке",
  description:
    "Пеший, авто, мото и грузовой курьер через парк «Армада». Авторегистрация и поддержка в Telegram и MAX.",
  alternates: { canonical: `${SITE.url}/delivery/` },
};

export default function DeliveryPage() {
  return <CourierLanding />;
}
