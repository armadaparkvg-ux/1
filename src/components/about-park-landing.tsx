"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Car,
  FileCheck2,
  Package,
} from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { fleetGoPath } from "@/lib/fleet-forms";
import { trackFleetRegistration } from "@/lib/metrika";

const FACTS = [
  {
    icon: Calendar,
    value: "7+",
    label: "лет на рынке",
    hint: "стабильная работа парка по всей России",
  },
  {
    icon: Car,
    value: "3 800+",
    label: "водителей такси самозанятых",
    hint: "парковый СМЗ и ИП",
  },
  {
    icon: Briefcase,
    value: "1 180",
    label: "водителей по трудовым отношениям",
    hint: "официальное оформление с парком",
  },
  {
    icon: Package,
    value: "2 368+",
    label: "курьеров",
    hint: "пеший, авто, мото и грузовой",
  },
  {
    icon: FileCheck2,
    value: "5 000+",
    label: "реестров ФГИС",
    hint: "оформили внесение авто в реестр такси",
  },
] as const;

export function AboutParkLanding() {
  const registerHref = fleetGoPath("taxi", "smz");

  return (
    <div className="pb-20">
      <section
        data-hero
        className="relative isolate overflow-hidden border-b border-border bg-[#080b11] pt-[72px]"
      >
        <div className="relative mx-auto w-full max-w-[1600px]">
          <div className="relative aspect-[21/9] min-h-[220px] w-full sm:min-h-[300px]">
            <Image
              src="/images/trust-city.webp"
              alt="Ночной город и работа такси"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-70"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#07090d] via-[#07090d]/85 to-[#07090d]/35"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-[#07090d]/40"
              aria-hidden
            />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            На главную
          </Link>
          <p className="mt-8 inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur">
            О парке «Армада»
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Знакомство с таксопарком «Армада»
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Подключаем к Яндекс Такси и Яндекс Доставке: прозрачные условия,
            поддержка на каждом шаге и оформление удалённо по всей России.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild shine size="lg">
              <Link
                href={registerHref}
                onClick={() =>
                  trackFleetRegistration({
                    channel: "taxi",
                    type: "smz",
                    action: "link",
                    place: "hero",
                  })
                }
              >
                Зарегистрироваться
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/#directions">Выбрать направление</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="section-anchor py-16 sm:py-20"
        aria-labelledby="about-facts-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              id="about-facts-heading"
              className="text-center font-display text-2xl font-semibold text-foreground sm:text-3xl"
            >
              Парк в цифрах
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              Масштаб парка по водителям, курьерам и оформленным реестрам ФГИС.
            </p>
          </FadeIn>

          <Stagger
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.08}
          >
            {FACTS.map((fact) => {
              const Icon = fact.icon;
              return (
                <StaggerItem key={fact.label}>
                  <article className="premium-card group h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
                    <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <p className="font-display text-3xl font-semibold text-foreground">
                      {fact.value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground/90">
                      {fact.label}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {fact.hint}
                    </p>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Button asChild shine size="lg">
              <Link href="/taxi/">Подключение к такси</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/delivery/">Курьеры</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/trudovoj-dogovor/">Трудовой договор</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
