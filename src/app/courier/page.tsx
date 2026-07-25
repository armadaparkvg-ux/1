import type { Metadata } from "next";
import { CourierLanding } from "@/components/courier-landing";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Курьер Яндекс Доставка",
  description:
    "Подключение курьеров к Яндекс Доставке через парк «Армада». Актуальная страница: /delivery/.",
  alternates: { canonical: `${SITE.url}/delivery/` },
  robots: { index: false, follow: true },
};

/** Legacy URL — same UI as /delivery/, canonical points to /delivery/. */
export default function CourierPage() {
  return <CourierLanding />;
}
