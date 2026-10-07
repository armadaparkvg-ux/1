import type { Metadata } from "next";
import { FleetGoClient } from "@/components/fleet-go-client";
import { pageMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Открываем заявку",
    description: "Переход к заявке на подключение через парк «Армада».",
    path: "/go/fleet/",
    robots: { index: false, follow: false },
  }),
};

/**
 * Intermediate page so Metrika can see a same-site URL hit
 * (`/go/fleet/`) before redirecting to forms.fleet.yandex.ru.
 */
export default function FleetGoPage() {
  return <FleetGoClient />;
}
