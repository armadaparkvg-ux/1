"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bike,
  Car,
  ExternalLink,
  Package,
  PersonStanding,
} from "lucide-react";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { ContactButtons } from "@/components/contact-buttons";
import { FORMS } from "@/lib/constants";
import { COURIER_TARIFFS } from "@/lib/courier";
import { fleetGoPath } from "@/lib/fleet-forms";
import { trackFleetRegistration } from "@/lib/metrika";

const TARIFFS = [
  {
    key: "self",
    image: "/images/tariff-selfemployed.jpg",
    imageAlt: "Парковый самозанятый — подключение водителя к Яндекс Такси",
    eyebrow: "Комиссия парка",
    title: "Парковый самозанятый",
    price: "1,9%",
    text: "Самый простой и удобный вариант для большинства водителей. Минимальная комиссия парка, быстрая регистрация и подключение к Яндекс Такси.",
    cta: "Авторегистрация (самозанятый)",
    href: FORMS.selfEmployed,
    iframe: FORMS.selfEmployedIframe,
    iframeTitle: "Форма авторегистрации самозанятого",
    featured: false,
  },
  {
    key: "ip",
    image: "/images/tariff-ip.jpg",
    imageAlt: "Парковый ИП — моментальный вывод и комиссия 1,9%",
    eyebrow: "Комиссия парка",
    title: "Парковый ИП",
    price: "1,9%",
    text: "Подходит водителям, которые хотят работать как ИП, но в структуре парка. Низкая комиссия и моментальный вывод средств.",
    cta: "Авторегистрация (ИП)",
    href: FORMS.ip,
    iframe: FORMS.ipIframe,
    iframeTitle: "Форма авторегистрации ИП",
    featured: true,
    badge: "Моментальный вывод",
  },
  {
    key: "labor",
    image: "/images/tariff-labor.jpg",
    imageAlt: "Трудовой договор для работы в Яндекс Такси по ТК РФ",
    eyebrow: "По ТК РФ",
    title: "Трудовой договор",
    price: "3 варианта",
    text: "Для водителей, которым важно официальное трудоустройство по ТК РФ: стабильность, легальный статус и понятные условия с парком.",
    cta: "Узнать подробнее",
    href: "/trudovoj-dogovor/",
    iframe: null as string | null,
    iframeTitle: "",
    featured: false,
    emerald: true,
  },
] as const;

function TariffCard({
  tariff,
}: {
  tariff: (typeof TARIFFS)[number];
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <article
      id={`tariff-${tariff.key}`}
      className={`section-anchor premium-card relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
        tariff.featured ? "ring-1 ring-accent/40 shadow-[0_0_45px_-28px_rgba(245,158,11,0.8)]" : ""
      }`}
    >
      {"badge" in tariff && tariff.badge ? (
        <span className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-lg">
          {tariff.badge}
        </span>
      ) : null}

      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={tariff.image}
          alt={tariff.imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1420] via-[#0d1420]/10 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p
          className={`text-sm font-medium ${
            "emerald" in tariff && tariff.emerald
              ? "text-emerald-glow"
              : "text-accent"
          }`}
        >
          {tariff.eyebrow}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
          {tariff.title}
        </h3>
        <p
          className={`mt-1 font-display font-bold ${
            tariff.key === "labor"
              ? "text-2xl text-foreground/90"
              : "text-4xl gradient-text"
          }`}
        >
          {tariff.price}
        </p>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {tariff.text}
        </p>

        {tariff.key === "labor" ? (
          <>
            <Button
              asChild
              shine
              className="mt-6 w-full"
              size="lg"
              variant="secondary"
            >
              <Link href={tariff.href}>{tariff.cta}</Link>
            </Button>
            <div className="mt-6">
              <ContactButtons showLabels size="sm" />
            </div>
          </>
        ) : (
          <>
            <Button asChild shine className="mt-6 w-full" size="lg">
              <a
                href={fleetGoPath("taxi", tariff.key)}
                onClick={() =>
                  trackFleetRegistration({
                    channel: "taxi",
                    type: tariff.key,
                    action: "link",
                  })
                }
              >
                {tariff.cta}
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </Button>
            {tariff.iframe ? (
              <div className="mt-4">
                {showForm ? (
                  <div className="overflow-hidden rounded-xl border border-border bg-background/40">
                    <iframe
                      title={tariff.iframeTitle}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                      src={tariff.iframe}
                      className="h-[420px] w-full max-w-full sm:h-[520px]"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      trackFleetRegistration({
                        channel: "taxi",
                        type: tariff.key,
                        action: "iframe",
                      });
                      setShowForm(true);
                    }}
                  >
                    Открыть форму на сайте
                  </Button>
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
    </article>
  );
}

export function Tariffs() {
  return (
    <section
      id="tariffs"
      className="section-anchor relative py-12 sm:py-20 lg:py-24"
      aria-labelledby="tariffs-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="tariffs-heading"
            eyebrow="Шаг 4 · Оформление в парке"
            title="Выберите формат подключения"
            description="Самозанятый, ИП или трудовой договор — затем авторегистрация или заявка. Курьерам — отдельный блок и страница /courier/."
          />
        </FadeIn>

        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline" size="sm">
            <Link href="/#quiz">Подобрать тариф в квизе</Link>
          </Button>
        </div>

        <Stagger className="mt-10 grid gap-6 lg:grid-cols-3" stagger={0.12}>
          {TARIFFS.map((tariff) => (
            <StaggerItem key={tariff.key}>
              <TariffCard tariff={tariff} />
            </StaggerItem>
          ))}
        </Stagger>

        <FadeIn delay={0.1} className="mt-12">
          <CourierTeaser />
        </FadeIn>
      </div>
    </section>
  );
}

const COURIER_ICONS = {
  foot: PersonStanding,
  auto: Car,
  moto: Bike,
  cargo: Package,
} as const;

function CourierTeaser() {
  return (
    <aside
      id="tariff-courier"
      className="section-anchor relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-surface-elevated/90 via-surface/80 to-[#0c121c] p-6 sm:p-8"
      aria-labelledby="courier-teaser-heading"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div className="relative">
        <p className="text-sm font-medium text-accent">
          Шаг 4b · Если выбрали доставку
        </p>
        <h3
          id="courier-teaser-heading"
          className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl"
        >
          Курьер
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Пеший, авто, мото и грузовой — отдельная страница с тарифами и
          авторегистрацией. Сначала направление «Доставка», затем регистрация.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COURIER_TARIFFS.map((item) => {
            const Icon = COURIER_ICONS[item.id];
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-border/80 bg-background/30 px-3 py-3"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.title}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
          <Button asChild shine size="lg" className="w-full sm:w-auto sm:min-w-[220px]">
            <Link href="/delivery/">Подробнее</Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
