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
import { FadeIn, Stagger, StaggerItem } from "@/components/fade-in";
import { trackGoal } from "@/lib/metrika";
import { cn } from "@/lib/utils";

const MAIN = [
  {
    href: "/trudovoj-dogovor/",
    image: "/images/legal-card.webp",
    icon: Briefcase,
    eyebrow: "Главное направление",
    title: "Трудовой договор",
    text: "Официальное оформление без СМЗ и ИП. Тарифы 3%+300, 5%+100 и 6% — по ТК РФ с парком.",
    tone: "emerald" as const,
    goal: "click_labor_apply" as const,
    featured: true,
  },
  {
    href: "/taxi/",
    image: "/images/taxi-card.webp",
    icon: Car,
    eyebrow: "Яндекс Такси",
    title: "Такси",
    text: "Самозанятый и ИП от 1,9%. Классы Эконом–Элит, авторегистрация онлайн.",
    tone: "accent" as const,
    goal: "directions_taxi" as const,
    featured: false,
  },
  {
    href: "/delivery/",
    image: "/images/delivery-card.webp",
    icon: Package,
    eyebrow: "Яндекс Доставка",
    title: "Доставка",
    text: "Пеший, авто, мото и грузовой курьер — отдельные тарифы и формы.",
    tone: "emerald" as const,
    goal: "directions_delivery" as const,
    featured: false,
  },
] as const;

const DOCS = [
  {
    href: "/license/",
    icon: FileCheck2,
    title: "Лицензия ФГИС",
    text: "Чат, фото авто и СТС, документ за 1–3 дня",
    meta: "3 500 ₽ · 5 лет",
    tone: "accent" as const,
  },
  {
    href: "/osgop/",
    icon: ShieldCheck,
    title: "ОСГОП",
    text: "Страхование для легальной работы",
    meta: "3 400 ₽ · 1 год",
    tone: "emerald" as const,
  },
] as const;

export function HomeDestinations() {
  return (
    <section
      id="directions"
      className="section-anchor premium-grid relative overflow-hidden py-10 sm:py-14 lg:py-16"
      aria-labelledby="directions-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-7 max-w-2xl sm:mb-9">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Направления парка
            </p>
            <h2
              id="directions-heading"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl lg:text-4xl"
            >
              Выберите путь подключения
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Трудовой договор, такси, доставка и документы — всё в одном парке,
              с переходом на отдельные посадочные.
            </p>
          </div>
        </FadeIn>

        <div className="rounded-[1.75rem] border border-border/80 bg-[#0a0f18]/70 p-3 shadow-[0_30px_80px_-48px_rgba(0,0,0,0.95)] backdrop-blur-sm sm:rounded-[2rem] sm:p-4 lg:p-5">
          <Stagger className="grid gap-3 sm:gap-4 lg:grid-cols-3" stagger={0.07}>
            {MAIN.map((item) => {
              const Icon = item.icon;
              const isEmerald = item.tone === "emerald";
              return (
                <StaggerItem
                  key={item.href}
                  className={cn(
                    item.featured && "lg:col-span-1 sm:col-span-2 lg:row-span-1"
                  )}
                >
                  <Link
                    href={item.href}
                    onClick={() => trackGoal(item.goal)}
                    className={cn(
                      "group relative flex min-h-0 flex-col overflow-hidden rounded-[1.35rem] border border-white/5 p-5 transition-all duration-500 sm:min-h-[240px] sm:p-6",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      item.featured
                        ? "ring-1 ring-emerald-glow/25 sm:min-h-[260px]"
                        : ""
                    )}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-[1.04]"
                      aria-hidden
                    />
                    <div
                      className={cn(
                        "absolute inset-0",
                        isEmerald
                          ? "bg-gradient-to-br from-[#07140f]/95 via-[#0a1210]/88 to-[#080b11]/75"
                          : "bg-gradient-to-br from-[#120e08]/95 via-[#0e1016]/88 to-[#080b11]/75"
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-transparent opacity-80" />

                    <div className="relative flex h-full flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={cn(
                            "inline-flex h-11 w-11 items-center justify-center rounded-2xl border backdrop-blur-sm",
                            isEmerald
                              ? "border-emerald-glow/35 bg-emerald-glow/15 text-emerald-glow"
                              : "border-accent/35 bg-accent/15 text-accent"
                          )}
                        >
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <ArrowUpRight
                          className={cn(
                            "h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                            isEmerald ? "text-emerald-glow/80" : "text-accent/80"
                          )}
                          aria-hidden
                        />
                      </div>

                      <p
                        className={cn(
                          "mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] sm:mt-8",
                          isEmerald ? "text-emerald-glow" : "text-accent"
                        )}
                      >
                        {item.eyebrow}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[1.7rem]">
                        {item.title}
                      </h3>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                        {item.text}
                      </p>
                      <span
                        className={cn(
                          "mt-5 pt-0 text-sm font-semibold sm:mt-auto sm:pt-6",
                          isEmerald ? "text-emerald-glow" : "text-accent"
                        )}
                      >
                        Открыть страницу
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>

          <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-2 sm:gap-4">
            {DOCS.map((item) => {
              const Icon = item.icon;
              const isEmerald = item.tone === "emerald";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-4 overflow-hidden rounded-[1.25rem] border border-white/5 px-4 py-4 transition-all duration-300 sm:px-5 sm:py-5",
                    "bg-gradient-to-r from-[#101722]/95 to-[#0b1018]/90",
                    "hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border",
                      isEmerald
                        ? "border-emerald-glow/30 bg-emerald-glow/12 text-emerald-glow"
                        : "border-accent/30 bg-accent/12 text-accent"
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold text-foreground">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {item.text}
                    </span>
                    <span
                      className={cn(
                        "mt-1.5 block text-xs font-semibold tracking-wide",
                        isEmerald ? "text-emerald-glow" : "text-accent"
                      )}
                    >
                      {item.meta}
                    </span>
                  </span>
                  <ArrowUpRight
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                      isEmerald ? "text-emerald-glow" : "text-accent"
                    )}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
