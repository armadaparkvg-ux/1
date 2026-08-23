"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Car,
  FileCheck2,
  Package,
  ShieldCheck,
} from "lucide-react";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { trackGoal } from "@/lib/metrika";
import { cn } from "@/lib/utils";

const PRIMARY = [
  {
    href: "/trudovoj-dogovor/",
    registerHref: "/trudovoj-dogovor/#labor-final-cta",
    image: "/images/legal-card.webp",
    icon: Briefcase,
    eyebrow: "Главное направление",
    title: "Трудовой договор",
    text: "Без СМЗ и ИП: 3%+300 / 5%+100 / 6%. Больничные, отпуск, стаж.",
    tone: "emerald" as const,
    imageAlt: "Трудовой договор в таксопарке Армада",
    goal: "click_labor_apply" as const,
    ctaPrimary: "Условия трудового",
    ctaSecondary: "Оформить",
  },
  {
    href: "/taxi/",
    registerHref: "/taxi/#formats",
    image: "/images/taxi-card.webp",
    icon: Car,
    eyebrow: "Яндекс Такси",
    title: "Такси",
    text: "Самозанятый и ИП от 1,9%, классы Эконом–Элит, авторегистрация.",
    tone: "accent" as const,
    imageAlt: "Подключение к Яндекс Такси через парк Армада",
    goal: "directions_taxi" as const,
    ctaPrimary: "Подробнее",
    ctaSecondary: "Регистрация",
  },
  {
    href: "/delivery/",
    registerHref: "/delivery/#courier-tariffs",
    image: "/images/delivery-card.webp",
    icon: Package,
    eyebrow: "Яндекс Доставка",
    title: "Доставка",
    text: "Пеший, авто, мото и грузовой курьер — отдельные тарифы и формы.",
    tone: "emerald" as const,
    imageAlt: "Подключение курьеров к Яндекс Доставке через парк Армада",
    goal: "directions_delivery" as const,
    ctaPrimary: "Подробнее",
    ctaSecondary: "Регистрация",
  },
] as const;

const DOCS = [
  {
    href: "/license/",
    icon: FileCheck2,
    title: "Лицензия ФГИС",
    text: "3 500 ₽ на 5 лет",
    tone: "accent" as const,
  },
  {
    href: "/osgop/",
    icon: ShieldCheck,
    title: "ОСГОП",
    text: "3 400 ₽ на 1 год",
    tone: "emerald" as const,
  },
] as const;

export function HomeDestinations() {
  return (
    <section
      id="directions"
      className="section-anchor premium-grid relative overflow-hidden py-8 sm:py-14 lg:py-20"
      aria-labelledby="directions-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="directions-heading"
            eyebrow="Выберите направление"
            title="Куда подключаемся"
            description="Трудовой договор, такси или доставка — откройте посадочную и оформите онлайн."
          />
        </FadeIn>

        <Stagger className="mt-6 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3" stagger={0.06}>
          {PRIMARY.map((item) => {
            const Icon = item.icon;
            const isEmerald = item.tone === "emerald";
            return (
              <StaggerItem key={item.href}>
                <article
                  className={cn(
                    "premium-card group relative flex flex-col overflow-hidden rounded-2xl p-5 sm:min-h-[280px] sm:rounded-3xl sm:p-7",
                    item.href === "/trudovoj-dogovor/" &&
                      "ring-1 ring-emerald-glow/35 sm:col-span-2 lg:col-span-1"
                  )}
                >
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover opacity-45 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#080b11] via-[#080b11]/90 to-[#080b11]/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080b11]/90 to-transparent" />

                  <div className="relative flex h-full flex-col">
                    <span
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-xl border sm:h-12 sm:w-12 sm:rounded-2xl",
                        isEmerald
                          ? "border-emerald-glow/30 bg-emerald-glow/15 text-emerald-glow"
                          : "border-accent/30 bg-accent/15 text-accent"
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p
                      className={cn(
                        "mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] sm:mt-5 sm:text-xs",
                        isEmerald ? "text-emerald-glow" : "text-accent"
                      )}
                    >
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>

                    <div className="mt-5 flex flex-col gap-2 sm:mt-auto sm:flex-row sm:gap-2.5 sm:pt-6">
                      <Button
                        asChild
                        shine
                        variant={isEmerald ? "emerald" : "default"}
                        className="flex-1"
                      >
                        <Link
                          href={item.href}
                          onClick={() =>
                            item.goal ? trackGoal(item.goal) : undefined
                          }
                        >
                          {item.ctaPrimary}
                          <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        shine
                        variant="secondary"
                        className="flex-1"
                      >
                        <Link
                          href={item.registerHref}
                          onClick={() =>
                            item.goal ? trackGoal(item.goal) : undefined
                          }
                        >
                          {item.ctaSecondary}
                          <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>

        <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2">
          {DOCS.map((item) => {
            const Icon = item.icon;
            const isEmerald = item.tone === "emerald";
            return (
              <Link
                key={item.href}
                href={item.href}
                className="premium-card flex items-center gap-3 rounded-2xl p-4 transition-colors hover:border-accent/35"
              >
                <span
                  className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                    isEmerald
                      ? "border-emerald-glow/30 bg-emerald-glow/15 text-emerald-glow"
                      : "border-accent/30 bg-accent/15 text-accent"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.text}
                  </span>
                </span>
                <ArrowUpRight
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isEmerald ? "text-emerald-glow" : "text-accent"
                  )}
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
