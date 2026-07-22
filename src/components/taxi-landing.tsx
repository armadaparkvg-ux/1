"use client";

import Link from "next/link";
import { Car, CheckCircle2, ExternalLink, Landmark, Sparkles } from "lucide-react";
import { DestinationHero } from "@/components/destination-hero";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
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
    title: "Официальный формат",
    text: "Самозанятый, ИП или трудовой договор — под вашу задачу и документы.",
  },
] as const;

const FORMATS = [
  {
    title: "Парковый самозанятый",
    value: "1,9%",
    text: "Быстрый старт и минимальная комиссия парка.",
    href: FORMS.selfEmployed,
  },
  {
    title: "Парковый ИП",
    value: "1,9%",
    text: "Формат ИП и моментальный вывод средств.",
    href: FORMS.ip,
  },
  {
    title: "Трудовой договор",
    value: "3 формата",
    text: "Официальное оформление, налоги платит парк.",
    href: "/#labor-contract",
  },
] as const;

export function TaxiLanding() {
  return (
    <div className="pb-20">
      <DestinationHero
        eyebrow="Яндекс Такси · парк «Армада»"
        title="Подключение к Яндекс Такси"
        description="Выберите класс автомобиля, формат работы и пройдите регистрацию. Удалённо по России, комиссия от 1,9%, поддержка ежедневно."
        image="/images/taxi-premium-hero.webp"
        imageAlt="Автомобиль для работы в Яндекс Такси на вечерней городской улице"
        primaryHref="#formats"
        primaryLabel="Выбрать формат"
      >
        <div className="grid gap-2 sm:grid-cols-3">
          {["Эконом → Элит", "1,9% комиссия", "Активация 1,5–2 ч"].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-[#0b111c]/75 px-3 py-2 text-sm font-medium text-foreground/90 backdrop-blur"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-glow" aria-hidden />
              {item}
            </span>
          ))}
        </div>
      </DestinationHero>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              eyebrow="Шаг 1 · Класс авто"
              title="На каких тарифах можно работать"
              description="Сначала проверьте автомобиль в официальном классификаторе, затем выберите формат подключения через «Армаду»."
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
          <div className="mt-8 flex justify-center">
            <Button asChild shine size="lg">
              <Link
                href={CONTACTS.autoClassifier}
                target="_blank"
                rel="noopener noreferrer"
              >
                Проверить автомобиль в классификаторе
                <ExternalLink className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="formats" className="section-anchor premium-grid relative overflow-hidden py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              eyebrow="Шаг 2 · Оформление"
              title="Выберите формат работы с парком"
              description="У каждого формата — своя регистрация. Если не уверены, напишите менеджеру: поможем выбрать."
            />
          </FadeIn>
          <Stagger className="mt-12 grid gap-5 lg:grid-cols-3" stagger={0.1}>
            {FORMATS.map((format, index) => (
              <StaggerItem key={format.title}>
                <article className={`premium-card flex h-full flex-col rounded-2xl p-6 ${index === 1 ? "ring-1 ring-accent/35" : ""}`}>
                  <p className="text-sm font-medium text-accent">{format.title}</p>
                  <p className="mt-3 font-display text-4xl font-bold gradient-text">{format.value}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{format.text}</p>
                  <Button asChild shine className="mt-7 w-full" size="lg" variant={index === 1 ? "default" : "secondary"}>
                    <Link
                      href={format.href}
                      target={format.href.startsWith("http") ? "_blank" : undefined}
                      rel={format.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {format.href.startsWith("http") ? "Авторегистрация" : "Узнать условия"}
                    </Link>
                  </Button>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-8 flex justify-center">
            <ContactButtons showLabels size="lg" />
          </div>
        </div>
      </section>
    </div>
  );
}
