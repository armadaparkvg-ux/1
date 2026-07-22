"use client";

import { useState } from "react";
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
import {
  COURIER_BENEFITS,
  COURIER_KB,
  COURIER_STEPS,
  COURIER_TARIFFS,
  type CourierTariff,
} from "@/lib/courier";
import { CONTACTS, SITE } from "@/lib/constants";

const ICONS = {
  foot: PersonStanding,
  auto: Car,
  moto: Bike,
  cargo: Package,
} as const;

function CourierCard({ tariff }: { tariff: CourierTariff }) {
  const [showForm, setShowForm] = useState(false);
  const Icon = ICONS[tariff.id];

  return (
    <article
      id={`courier-${tariff.id}`}
      className="glass flex h-full flex-col rounded-2xl p-6 sm:p-7"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
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
          <li
            key={point}
            className="flex gap-2 text-sm text-foreground/85"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {point}
          </li>
        ))}
      </ul>

      <Button asChild shine className="mt-6 w-full" size="lg">
        <Link
          href={tariff.formUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {tariff.cta}
          <ExternalLink className="h-4 w-4" aria-hidden />
        </Link>
      </Button>
      <div className="mt-3">
        {showForm ? (
          <div className="overflow-hidden rounded-xl border border-border bg-background/40">
            <iframe
              title={`Форма: ${tariff.title}`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
              src={tariff.formIframe}
              className="h-[420px] w-full max-w-full sm:h-[500px]"
              loading="lazy"
            />
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setShowForm(true)}
          >
            Открыть форму на сайте
          </Button>
        )}
      </div>
    </article>
  );
}

export function CourierLanding() {
  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-[#121a28] to-background pt-28 pb-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 0%, rgba(245,158,11,0.22), transparent 55%), radial-gradient(ellipse at 80% 40%, rgba(16,185,129,0.12), transparent 45%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-wide text-accent">
            {SITE.fullName} · Яндекс Доставка
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Подключение курьеров к Яндекс Доставке
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Пеший, авто, мото и грузовой — удалённо через парк «Армада».
            Парковый самозанятый, авторегистрация и поддержка{" "}
            {CONTACTS.hours}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild shine size="lg">
              <Link href="#courier-tariffs">Выбрать тариф</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Написать в Telegram
              </Link>
            </Button>
            <Button asChild variant="emerald" size="lg">
              <Link
                href={CONTACTS.max}
                target="_blank"
                rel="noopener noreferrer"
              >
                Сообщение в MAX
              </Link>
            </Button>
          </div>
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
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
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
        id="courier-tariffs"
        className="section-anchor py-16 sm:py-20"
        aria-labelledby="courier-tariffs-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="courier-tariffs-heading"
              eyebrow="Тарифы"
              title="Выберите формат курьера"
              description="Авторегистрация онлайн для пешего, авто, мото и грузового курьера."
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

      <section className="py-16 sm:py-20" aria-labelledby="courier-steps">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="courier-steps"
              eyebrow="Как подключиться"
              title="4 шага до заказов"
              description="Короткий путь от заявки до линии в Яндекс Про."
            />
          </FadeIn>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COURIER_STEPS.map((step, i) => (
              <li key={step.title} className="relative">
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
              <Link href="/#tariffs" className="text-sm text-accent hover:underline">
                ← К тарифам такси на главной
              </Link>
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
