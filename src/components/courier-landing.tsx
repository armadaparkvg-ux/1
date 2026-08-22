"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bike,
  Car,
  Package,
  PersonStanding,
} from "lucide-react";
import { DeliveryHeroBanner } from "@/components/delivery-hero-banner";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { DualPathActions } from "@/components/funnel-actions";
import { ContactButtons } from "@/components/contact-buttons";
import { Button } from "@/components/ui/button";
import {
  COURIER_BENEFITS,
  COURIER_KB,
  COURIER_STEPS,
  COURIER_TARIFFS,
  type CourierTariff,
} from "@/lib/courier";
import { CONTACTS } from "@/lib/constants";
import { fleetGoPath } from "@/lib/fleet-forms";
import { trackFleetRegistration } from "@/lib/metrika";

const ICONS = {
  foot: PersonStanding,
  auto: Car,
  moto: Bike,
  cargo: Package,
} as const;

const RELATED_ARTICLES = [
  {
    href: "/blog/rabota-kurerom-yandex-dohod/",
    title: "Работа курьером и доходы",
  },
  {
    href: "/blog/vidy-sotrudnichestva-kurer/",
    title: "Виды сотрудничества курьера",
  },
  {
    href: "/blog/vidy-dostavki-peshiy-avto-gruzovoy/",
    title: "Пеший, авто и грузовой",
  },
] as const;

function CourierCard({ tariff }: { tariff: CourierTariff }) {
  const Icon = ICONS[tariff.id];

  return (
    <article
      id={`courier-${tariff.id}`}
      className="premium-card flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 sm:p-7"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/15 text-accent">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            {tariff.eyebrow}
          </p>
          <h3 className="font-display text-xl font-semibold text-foreground">
            {tariff.title}
          </h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {tariff.description}
      </p>

      <ul className="mt-4 flex-1 space-y-2">
        {tariff.points.map((point) => (
          <li key={point} className="flex gap-2 text-sm text-foreground/85">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {point}
          </li>
        ))}
      </ul>

      <DualPathActions
        registerHref={tariff.formUrl}
        registerLabel="Зарегистрироваться"
        iframeSrc={tariff.formIframe}
        iframeTitle={`Форма: ${tariff.title}`}
        fleetTrack={{ channel: "courier", type: tariff.id, place: "card" }}
      />
    </article>
  );
}

export function CourierLanding() {
  const registerHref = fleetGoPath("courier", "smz");

  return (
    <div className="pb-20">
      <section
        data-hero
        className="relative isolate overflow-hidden border-b border-border bg-[#080b11] pt-[72px]"
      >
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            На главную
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] bg-[#0a0a0a]">
          <div className="relative w-full">
            <DeliveryHeroBanner />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,13,0.12),transparent_50%,rgba(7,9,13,0.22))]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07090d] via-[#07090d]/55 to-transparent sm:h-24"
              aria-hidden
            />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-glow">
            Яндекс Доставка · парк «Армада»
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Подключение курьеров к Яндекс Доставке
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Пеший, авто, мото или грузовой. Активация 1,5–2 часа, удалённо по
            России. Выплаты через парк.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild shine size="lg" variant="emerald">
              <Link
                href={registerHref}
                onClick={() =>
                  trackFleetRegistration({
                    channel: "courier",
                    type: "smz",
                    action: "link",
                    place: "hero",
                  })
                }
              >
                Зарегистрироваться — активация 1,5–2 часа
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#courier-tariffs">Выбрать тариф курьера</Link>
            </Button>
          </div>
          <ol className="mt-8 grid gap-2 sm:grid-cols-3">
            {[
              "1. Регистрация",
              "2. Тариф курьера",
              "3. Первые заказы",
            ].map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-[#0b111c]/75 px-3 py-2 text-sm font-medium text-foreground/90 backdrop-blur"
              >
                {item}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="courier-benefits">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="courier-benefits"
              eyebrow="Почему через Армаду"
              title="Выгоды паркового самозанятого"
              description="По официальной базе знаний Яндекс Про: приоритет, официальный доход и выплаты через парк."
            />
          </FadeIn>
          <Stagger
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.08}
          >
            {COURIER_BENEFITS.map((item) => (
              <StaggerItem key={item.title}>
                <div className="h-full border-l-2 border-accent/50 pl-4">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section
        id="courier-steps"
        className="section-anchor py-16 sm:py-20"
        aria-labelledby="courier-steps-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="courier-steps-heading"
              eyebrow="Шаг 1 · Как подключиться"
              title="4 шага до заказов"
              description="Сначала поймите путь, затем выберите тариф и пройдите авторегистрацию."
            />
          </FadeIn>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COURIER_STEPS.map((step, i) => (
              <li key={step.title} className="premium-card rounded-2xl p-5">
                <p className="font-display text-3xl font-bold text-accent/80">
                  {i + 1}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex justify-center">
            <Button asChild shine size="lg">
              <Link href="#courier-tariffs">Далее: выбрать тариф →</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="courier-tariffs"
        className="section-anchor premium-grid relative overflow-hidden py-16 sm:py-20"
        aria-labelledby="courier-tariffs-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="courier-tariffs-heading"
              eyebrow="Шаг 2 · Тариф"
              title="Выберите формат курьера"
              description="Пеший, легковой авто, мото или грузовой — затем авторегистрация или поддержка парка в чате."
            />
          </FadeIn>

          <Stagger
            className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
            stagger={0.1}
          >
            {COURIER_TARIFFS.map((tariff) => (
              <StaggerItem key={tariff.id}>
                <CourierCard tariff={tariff} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="courier-guides">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="courier-guides"
              eyebrow="Полезные статьи"
              title="Доходы, оформление и виды доставки"
              description="Короткие гайды под запросы «работа курьером», «сколько зарабатывает курьер» и выбор формата."
            />
          </FadeIn>
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {RELATED_ARTICLES.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="premium-card block rounded-2xl p-5 transition-colors hover:border-accent/40"
                >
                  <p className="font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-accent">Читать →</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="courier-contacts">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              id="courier-contacts"
              className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
            >
              Остались вопросы? Напишите в чат
            </h2>
            <p className="mt-3 text-muted-foreground">
              Подскажем тариф, документы и поможем с регистрацией.{" "}
              {CONTACTS.hours}.
            </p>
            <div className="mt-8 flex justify-center">
              <ContactButtons showLabels size="lg" />
            </div>
            <p className="mt-8 text-xs text-muted-foreground">
              Справка Яндекс Про:{" "}
              <Link
                href={COURIER_KB.hub}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                база знаний Доставки
              </Link>
              {" · "}
              <Link
                href={COURIER_KB.parkSmz}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                парковый самозанятый
              </Link>
            </p>
            <p className="mt-6">
              <Link href="/taxi/" className="text-sm text-accent hover:underline">
                ← К подключению в Яндекс Такси
              </Link>
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
