"use client";

import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/json-ld";
import { useRegisterChooser } from "@/components/register-chooser";
import type { CityPage } from "@/lib/cities";
import { getCityNeighbors } from "@/lib/cities";
import { CONTACTS } from "@/lib/constants";
import { breadcrumbJsonLd, graphJsonLd, webpageJsonLd } from "@/lib/schema";

export function CityLanding({ city }: { city: CityPage }) {
  const { openRegister } = useRegisterChooser();
  const path = `/goroda/${city.slug}/`;
  const crumbs = [
    { name: "Главная", href: "/" },
    { name: "Города", href: "/goroda/" },
    { name: `Подключение к Яндекс Такси ${city.inCity}` },
  ];
  const neighbors = getCityNeighbors(city.slug);
  const jsonLd = graphJsonLd([
    webpageJsonLd({
      path,
      name: city.title,
      description: city.description,
    }),
    breadcrumbJsonLd(crumbs),
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <div
        hidden
        dangerouslySetInnerHTML={{
          __html: `<!-- {{УТОЧНИТЬ У ВЛАДЕЛЬЦА: число водителей парка в ${city.prepositional}}} -->\n<!-- {{УТОЧНИТЬ У ВЛАДЕЛЬЦА: диапазон недельного заработка в ${city.prepositional}}} -->`,
        }}
      />
      <section
        data-hero
        className="border-b border-border bg-[#080b11] pt-[72px]"
      >
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-6 sm:px-6 sm:pb-14 lg:px-8">
          <Link
            href="/goroda/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Все города
          </Link>
          <div className="mt-5">
            <Breadcrumbs
              items={[
                { name: "Главная", href: "/" },
                { name: "Города", href: "/goroda/" },
                { name: city.name, href: path },
              ]}
            />
          </div>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {city.region} · удалённо
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
            {city.h1}
          </h1>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <p>{city.lead}</p>
            {city.intro.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              shine
              size="lg"
              onClick={() => openRegister()}
            >
              Зарегистрироваться
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/taxi/">Такси</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/delivery/">Доставка</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Спрос {city.inCity}
          </h2>
          <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
            {city.demandSubheading}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {city.demand}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { href: "/taxi/", label: "Такси от 1,9%" },
              { href: "/trudovoj-dogovor/", label: "Трудовой договор" },
              { href: "/delivery/", label: "Курьер Доставки" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-2xl border border-border bg-surface/40 px-4 py-3 text-sm font-medium text-foreground hover:border-accent/40"
                >
                  {item.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Условия подключения
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Федеральные условия парка «Армада» одинаковы {city.inCity} и в
            остальных регионах. Локальные цифры по водителям и заработку на
            странице не публикуем, пока их не подтвердит парк.
          </p>

          <h3 className="mt-6 font-display text-lg font-semibold text-foreground">
            Гражданство и формат работы
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Нужно гражданство РФ. Самозанятый и ИП подключаются авторегистрацией
            на странице такси. Трудовой договор — только через поддержку парка,
            авторегистрации на этот формат нет.
          </p>

          <h3 className="mt-6 font-display text-lg font-semibold text-foreground">
            Какие документы нужны
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Паспорт, водительское удостоверение, СТС. Для трудового договора —
            ИНН и СНИЛС. Для ФГИС — фото автомобиля с четырёх сторон и СТС с
            двух сторон.
          </p>

          <h3 className="mt-6 font-display text-lg font-semibold text-foreground">
            ФГИС и ОСГОП
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Внесение авто в реестр такси — 3 500 ₽ на 5 лет, обычно 1–3 дня.
            ОСГОП — 3 400 ₽ в год. Оплата по факту оформления, без ежемесячной
            «подписки парка».
          </p>

          <h3 className="mt-6 font-display text-lg font-semibold text-foreground">
            Комиссия парка
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Самозанятый и ИП — от 1,9%. По трудовому договору три схемы: 3% +
            300 ₽ в день, 5% + 100 ₽ в день или 6% без ежедневных списаний.
            Комиссия Яндекс Такси начисляется отдельно.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-8 sm:py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Частые вопросы {city.inCity}
          </h2>
          <dl className="mt-6 space-y-5">
            {city.faq.map((item) => (
              <div key={item.q}>
                <dt className="font-medium text-foreground">{item.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm text-muted-foreground">
            Телефон {CONTACTS.phoneDisplay}, {CONTACTS.hours}. Другие города — на
            странице{" "}
            <Link href="/goroda/" className="text-accent hover:underline">
              подключения по России
            </Link>
            .
          </p>
          {neighbors.length ? (
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Соседние города
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {neighbors.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/goroda/${item.slug}/`}
                      className="inline-flex rounded-full border border-border px-3 py-1.5 text-sm text-foreground hover:border-accent/40 hover:text-accent"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
