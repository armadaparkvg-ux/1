import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { RelatedGuides } from "@/components/related-guides";
import { CITIES } from "@/lib/cities";
import { SITE } from "@/lib/constants";
import { breadcrumbJsonLd, graphJsonLd, webpageJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Подключение к Яндекс Такси по городам России",
  description:
    "Таксопарк «Армада» подключает водителей и курьеров удалённо: Москва, Санкт-Петербург, Краснодар, Казань, Екатеринбург и другие города. Комиссия от 1,9%.",
  alternates: { canonical: `${SITE.url}/goroda/` },
  openGraph: {
    title: "Подключение к Яндекс Такси по городам",
    description:
      "Удалённое оформление в парк «Армада» по всей России — выберите свой город.",
    url: `${SITE.url}/goroda/`,
  },
};

const crumbs = [
  { name: "Главная", href: "/" },
  { name: "Города", href: "/goroda/" },
];

export default function CitiesIndexPage() {
  const jsonLd = graphJsonLd([
    webpageJsonLd({
      path: "/goroda/",
      name: "Подключение к Яндекс Такси по городам России",
      description:
        "Список городов, где таксопарк «Армада» подключает водителей и курьеров удалённо.",
    }),
    breadcrumbJsonLd(crumbs),
    {
      "@type": "ItemList",
      name: "Города подключения к Яндекс Такси",
      itemListElement: CITIES.map((city, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: city.name,
        url: `${SITE.url}/goroda/${city.slug}/`,
      })),
    },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="border-b border-border bg-[#080b11] pt-[72px]">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            На главную
          </Link>
          <div className="mt-5">
            <Breadcrumbs items={crumbs} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Подключение к Яндекс Такси по городам
          </h1>
          <p className="mt-4 text-muted-foreground">
            Офиса нет — оформляем удалённо по всей России. Выберите город, чтобы
            увидеть условия подключения именно для вашего региона: такси,
            трудовой договор и Яндекс Доставка.
          </p>
        </div>
      </div>
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ul className="grid gap-3 sm:grid-cols-2">
            {CITIES.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/goroda/${city.slug}/`}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-surface/40 p-4 transition-colors hover:border-accent/40"
                >
                  <MapPin
                    className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                    aria-hidden
                  />
                  <span>
                    <span className="block font-display text-lg font-semibold text-foreground">
                      {city.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {city.region}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted-foreground">
            Нет вашего города в списке? Всё равно пишите — подключаем удалённо
            по РФ. Откройте{" "}
            <Link href="/#directions" className="text-accent hover:underline">
              направления
            </Link>{" "}
            или{" "}
            <Link href="/faq/" className="text-accent hover:underline">
              FAQ
            </Link>
            .
          </p>
        </div>
      </section>
      <RelatedGuides
        topic="park"
        title="Как подключаемся по России"
        excludeHref="/goroda/"
      />
    </>
  );
}
