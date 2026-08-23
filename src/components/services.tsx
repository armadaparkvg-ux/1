"use client";

import Image from "next/image";
import Link from "next/link";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { ApplyButton } from "@/components/messenger-apply";
import { ContactButtons } from "@/components/contact-buttons";
import { FgisCheckButton } from "@/components/fgis-check-button";
import type { ApplyTopic } from "@/lib/apply";
import { CONTACTS } from "@/lib/constants";

const SERVICES: {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  docs: string | null;
  cta: string;
  topic: ApplyTopic;
  externalLink?: { href: string; label: string };
}[] = [
  {
    image: "/images/service-license.jpg",
    imageAlt: "Оформление лицензии такси и документов на авто",
    title: "Лицензия такси (ФГИС)",
    description:
      "Оформляем официальную запись в реестре такси. Стоимость — 3 500 ₽ на 5 лет, оплата по факту выполненной работы, без ежемесячных платежей. Срок оформления — в среднем 1–3 дня, редко до 7 дней.",
    docs: "Документы: фото СТС (2 стороны) + фото авто с 4 сторон под прямым углом.",
    cta: "Узнать про лицензию",
    topic: "лицензия ФГИС",
    externalLink: {
      href: CONTACTS.fgisCheck,
      label: "Проверить ФГИС Такси",
    },
  },
  {
    image: "/images/service-carriers.jpg",
    imageAlt: "Автомобиль для внесения в реестр перевозчиков",
    title: "Реестр перевозчиков",
    description:
      "Если авто уже внесено нашим парком — оформим реестр перевозчика. Потребуются: справка об отсутствии судимости, договор с агрегатором, статус самозанятого или ИП.",
    docs: null,
    cta: "Уточнить условия",
    topic: "реестр перевозчиков",
  },
  {
    image: "/images/service-osgop.jpg",
    imageAlt: "Страхование ОСГОП для такси",
    title: "ОСГОП (страхование)",
    description: "Оформляем страхование ОСГОП. Стоимость — 3 400 ₽ на 1 год.",
    docs: null,
    cta: "Оформить ОСГОП",
    topic: "ОСГОП",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="section-anchor relative py-12 sm:py-20 lg:py-24"
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
          {SERVICES.map((service) => (
            <StaggerItem key={service.title}>
              <article className="glass flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1724] via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  {service.docs ? (
                    <p className="mt-3 text-sm text-foreground/80">{service.docs}</p>
                  ) : null}
                  <div className="mt-6 grid gap-3">
                    <ApplyButton
                      topic={service.topic}
                      variant="outline"
                      className="w-full"
                    >
                      {service.cta}
                    </ApplyButton>
                    {service.externalLink ? (
                      <FgisCheckButton className="w-full" />
                    ) : null}
                  </div>
                  <div className="mt-3">
                    <ContactButtons showLabels size="sm" />
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/#contacts">Или перейти в контакты</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
