"use client";

import Link from "next/link";
import { FileCheck, Shield, Truck } from "lucide-react";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { Button } from "@/components/ui/button";

const SERVICES = [
  {
    icon: FileCheck,
    title: "Лицензия такси (ФГИС)",
    description:
      "Оформляем официальную запись в реестре такси. Стоимость — 3 500 ₽ на 5 лет, оплата по факту выполненной работы, без ежемесячных платежей. Срок оформления — в среднем 1–3 дня, редко до 7 дней.",
    docs: "Документы: фото СТС (2 стороны) + фото авто с 4 сторон под прямым углом.",
    cta: "Узнать про лицензию",
    href: "#lead-form",
  },
  {
    icon: Truck,
    title: "Реестр перевозчиков",
    description:
      "Если авто уже внесено нашим парком — оформим реестр перевозчика. Потребуются: справка об отсутствии судимости, договор с агрегатором, статус самозанятого или ИП.",
    docs: null,
    cta: "Уточнить условия",
    href: "#contacts",
  },
  {
    icon: Shield,
    title: "ОСГОП (страхование)",
    description:
      "Оформляем страхование ОСГОП. Стоимость — 3 400 ₽ на 1 год.",
    docs: null,
    cta: "Оформить ОСГОП",
    href: "#lead-form",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="section-anchor relative py-20 sm:py-24"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="services-heading"
            eyebrow="Доп. услуги"
            title="Лицензия такси, реестр перевозчиков и ОСГОП"
            description="Дополнительные услуги парка «Армада»: внесение авто в реестр такси (ФГИС), реестр перевозчиков и страхование ОСГОП."
          />
        </FadeIn>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" stagger={0.1}>
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <StaggerItem key={service.title}>
                <article className="glass flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-7">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  {service.docs ? (
                    <p className="mt-3 text-sm text-foreground/80">{service.docs}</p>
                  ) : null}
                  <Button asChild variant="outline" shine className="mt-6 w-full">
                    <Link href={service.href}>{service.cta}</Link>
                  </Button>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>

      </div>
    </section>
  );
}
