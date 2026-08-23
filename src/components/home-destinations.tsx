"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Car,
  FileCheck2,
  Package,
  ShieldCheck,
} from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { trackGoal } from "@/lib/metrika";
import { cn } from "@/lib/utils";

const DIRECTIONS = [
  {
    href: "/trudovoj-dogovor/",
    icon: Briefcase,
    eyebrow: "Главное",
    title: "Трудовой договор",
    text: "Без СМЗ и ИП · 3%+300 / 5%+100 / 6%",
    tone: "emerald" as const,
    goal: "click_labor_apply" as const,
    featured: true,
  },
  {
    href: "/taxi/",
    icon: Car,
    eyebrow: "Яндекс Такси",
    title: "Такси",
    text: "СМЗ и ИП от 1,9% · авторегистрация",
    tone: "accent" as const,
    goal: "directions_taxi" as const,
    featured: false,
  },
  {
    href: "/delivery/",
    icon: Package,
    eyebrow: "Яндекс Доставка",
    title: "Доставка",
    text: "Пеший · авто · мото · грузовой",
    tone: "emerald" as const,
    goal: "directions_delivery" as const,
    featured: false,
  },
  {
    href: "/license/",
    icon: FileCheck2,
    eyebrow: "Документы",
    title: "Лицензия ФГИС",
    text: "3 500 ₽ на 5 лет",
    tone: "accent" as const,
    goal: null,
    featured: false,
  },
  {
    href: "/osgop/",
    icon: ShieldCheck,
    eyebrow: "Документы",
    title: "ОСГОП",
    text: "3 400 ₽ на 1 год",
    tone: "emerald" as const,
    goal: null,
    featured: false,
  },
] as const;

export function HomeDestinations() {
  return (
    <section
      id="directions"
      className="section-anchor relative border-b border-border/60 py-6 sm:py-10 lg:py-14"
      aria-labelledby="directions-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-4 sm:mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent sm:text-xs">
              Направления
            </p>
            <h2
              id="directions-heading"
              className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl"
            >
              Куда подключаемся
            </h2>
          </div>
        </FadeIn>

        <div className="overflow-hidden rounded-2xl border border-border bg-surface/40 sm:rounded-3xl">
          <ul className="divide-y divide-border/80">
            {DIRECTIONS.map((item) => {
              const Icon = item.icon;
              const isEmerald = item.tone === "emerald";
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() =>
                      item.goal ? trackGoal(item.goal) : undefined
                    }
                    className={cn(
                      "group flex items-center gap-3 px-3.5 py-3.5 transition-colors sm:gap-4 sm:px-5 sm:py-4",
                      "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
                      item.featured && "bg-emerald-glow/[0.04]"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border sm:h-11 sm:w-11",
                        isEmerald
                          ? "border-emerald-glow/30 bg-emerald-glow/15 text-emerald-glow"
                          : "border-accent/30 bg-accent/15 text-accent"
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-display text-base font-semibold text-foreground sm:text-lg">
                          {item.title}
                        </span>
                        {item.featured ? (
                          <span className="rounded-full border border-emerald-glow/30 bg-emerald-glow/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-glow">
                            {item.eyebrow}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">
                        {item.text}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                        isEmerald ? "text-emerald-glow" : "text-accent"
                      )}
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
