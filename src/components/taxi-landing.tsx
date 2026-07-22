"use client";

import Link from "next/link";
import { Car, CheckCircle2, ExternalLink, Landmark, Sparkles } from "lucide-react";
import { DestinationHero } from "@/components/destination-hero";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { DualPathActions } from "@/components/funnel-actions";
import { LaborContract } from "@/components/labor-contract";
import { Button } from "@/components/ui/button";
import { ContactButtons } from "@/components/contact-buttons";
import { FORMS, CONTACTS } from "@/lib/constants";

const CLASSES = [
  {
    icon: Car,
    title: "Эконом и Комфорт",
    text: "Базовые классы для ежедневных пассажирских заказов.",
  },
  {
    icon: Sparkles,
    title: "Бизнес и премиум",
    text: "Бизнес, Ultima, Premier и Элит — если автомобиль подходит по классификатору.",
  },
  {
    icon: Landmark,
    title: "Любой подходящий класс",
    text: "Сначала проверьте авто в классификаторе — затем выберите формат оформления ниже.",
  },
] as const;

const FORMATS = [
  {
    id: "smz",
    title: "Парковый самозанятый",
    value: "1,9%",
    text: "Быстрый старт и минимальная комиссия парка.",
    registerHref: FORMS.selfEmployed,
    iframeSrc: FORMS.selfEmployedIframe,
    featured: false,
  },
  {
    id: "ip",
    title: "Парковый ИП",
    value: "1,9%",
    text: "Формат ИП и моментальный вывод средств.",
    registerHref: FORMS.ip,
    iframeSrc: FORMS.ipIframe,
    featured: true,
  },
  {
    id: "labor",
    title: "Трудовой договор",
    value: "3 формата",
    text: "Официальное оформление: выберите один из трёх вариантов ниже.",
    registerHref: null as string | null,
    iframeSrc: null as string | null,
    featured: false,
  },
] as const;

export function TaxiLanding() {
  return (
    <div className="pb-20">
      <DestinationHero
        eyebrow="Яндекс Такси · парк «Армада»"
        title="Подключение к Яндекс Такси"
        description="Последовательность простая: класс авто → формат работы → авторегистрация или поддержка парка. Удалённо по России, комиссия от 1,9%."
        image="/images/taxi-premium-hero.webp"
        imageAlt="Автомобиль для работы в Яндекс Такси на вечерней городской улице"
        primaryHref="#step-class"
        primaryLabel="Начать: выбрать класс"
      >
        <ol className="grid gap-2 sm:grid-cols-3">
          {[
            "1. Класс авто",
            "2. Формат работы",
            "3. Регистрация или чат",
          ].map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-[#0b111c]/75 px-3 py-2 text-sm font-medium text-foreground/90 backdrop-blur"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-glow" aria-hidden />
              {item}
            </li>
          ))}
        </ol>
      </DestinationHero>

      <section
        id="step-class"
        className="section-anchor py-20 sm:py-24"
        aria-labelledby="taxi-class-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="taxi-class-heading"
              eyebrow="Шаг 1 · Класс авто"
              title="На каких тарифах можно работать"
              description="Проверьте автомобиль в официальном классификаторе Яндекса, затем переходите к формату оформления."
            />
          </FadeIn>
          <Stagger className="mt-12 grid gap-5 md:grid-cols-3" stagger={0.08}>
            {CLASSES.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.title}>
                  <article className="premium-card h-full rounded-2xl p-6">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h2 className="mt-5 font-display text-xl font-semibold text-foreground">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild shine size="lg">
              <Link
                href={CONTACTS.autoClassifier}
                target="_blank"
                rel="noopener noreferrer"
              >
                Проверить авто в классификаторе
                <ExternalLink className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild shine size="lg" variant="secondary">
              <Link href="#formats">Далее: выбрать формат →</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="formats"
        className="section-anchor premium-grid relative overflow-hidden py-20 sm:py-24"
        aria-labelledby="taxi-formats-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="taxi-formats-heading"
              eyebrow="Шаг 2 · Формат работы"
              title="Выберите оформление с парком"
              description="После выбора формата — авторегистрация онлайн или оформление через поддержку парка в чате."
            />
          </FadeIn>
          <Stagger className="mt-12 grid gap-5 lg:grid-cols-3" stagger={0.1}>
            {FORMATS.map((format) => (
              <StaggerItem key={format.id}>
                <article
                  className={`premium-card flex h-full flex-col rounded-2xl p-6 ${
                    format.featured ? "ring-1 ring-accent/35" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-accent">{format.title}</p>
                  <p className="mt-3 font-display text-4xl font-bold gradient-text">
                    {format.value}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {format.text}
                  </p>

                  {format.id === "labor" ? (
                    <div className="mt-7 flex flex-col gap-3">
                      <Button asChild shine size="lg" className="w-full">
                        <Link href="#labor-contract">
                          Узнать подробнее · 3 формата
                        </Link>
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        Дальше выберите вариант и оформите через поддержку парка
                      </p>
                    </div>
                  ) : (
                    <DualPathActions
                      registerHref={format.registerHref!}
                      iframeSrc={format.iframeSrc!}
                      iframeTitle={`Регистрация: ${format.title}`}
                    />
                  )}
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <LaborContract />

      <section className="py-16 sm:py-20" aria-labelledby="taxi-help">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              id="taxi-help"
              className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
            >
              Не уверены, какой формат выбрать?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Напишите в чат — подскажем по документам и подключению.{" "}
              {CONTACTS.hours}.
            </p>
            <div className="mt-8 flex justify-center">
              <ContactButtons showLabels size="lg" />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
