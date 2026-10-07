import type { Metadata } from "next";
import { CourierLanding } from "@/components/courier-landing";
import { pageMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = pageMetadata({
  title: "Курьер Яндекс Доставка",
  description:
    "Подключение курьеров к Яндекс Доставке через парк «Армада». Актуальная страница: /delivery/.",
  path: "/delivery/",
  robots: { index: false, follow: true },
});

/** Legacy URL — same UI as /delivery/, canonical points to /delivery/. */
export default function CourierPage() {
  return <CourierLanding />;
}
