"use client";

import {
  Bike,
  Car,
  Package,
  PersonStanding,
} from "lucide-react";
import Link from "next/link";
import { DestinationHero } from "@/components/destination-hero";
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

const ICONS = {
  foot: PersonStanding,
  auto: Car,
  moto: Bike,
  cargo: Package,
} as const;

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
        registerLabel={tariff.cta}
        iframeSrc={tariff.formIframe}
        iframeTitle={`Форма: ${tariff.title}`}
      />
    </article>
  );
}

export function CourierLanding() {
  return (
    <div className="pb-20">
      <DestinationHero
        eyebrow="Яндекс Доставка · парк «Армада»"
        title="Подключение курьеров к Яндекс Доставке"
        description="Последовательность: как подключиться → выбрать тариф → авторегистрация или поддержка парка. Пеший, авто, мото и грузовой — удалённо."
        image="/images/delivery-premium-hero.webp"
        imageAlt="Курьер и транспорт для работы в Яндекс Доставке"
        primaryHref="#courier-steps"
        primaryLabel="Начать: как подключиться"
        accent="emerald"
      >
        <ol className="grid gap-2 sm:grid-cols-3">
          {["1. 4 шага", "2. Тариф курьера", "3. Регистрация или чат"].map(
            (item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-[#0b111c]/75 px-3 py-2 text-sm font-medium text-foreground/90 backdrop-blur"
              >
                {item}
              </li>
            )
          )}
        </ol>
      </DestinationHero>

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
              description="Шаг 3 — авторегистрация онлайн или поддержка парка в чате."
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
