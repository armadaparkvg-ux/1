import type { Metadata } from "next";
import { FleetGoClient } from "@/components/fleet-go-client";

export const metadata: Metadata = {
  title: "Переход к авторегистрации",
  robots: { index: false, follow: false },
};

/**
 * Intermediate page so Metrika can see a same-site URL hit
 * (`/go/fleet/`) before redirecting to forms.fleet.yandex.ru.
 */
export default function FleetGoPage() {
  return <FleetGoClient />;
}
