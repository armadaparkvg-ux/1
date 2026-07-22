"use client";

import Link from "next/link";
import { ArrowRight, Car, Package } from "lucide-react";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { trackGoal } from "@/lib/metrika";

const DIRECTIONS = [
  {
    key: "taxi",
    href: "/#yandex-tariffs",
    icon: Car,
    stepLabel: "Такси",
    title: "Яндекс Такси",
    text: "Пассажирские заказы: от Эконома и Комфорта до Бизнеса, Ultima, Premier и Элит. Дальше — класс авто и оформление в парке.",
    cta: "Смотреть классы такси",
    accent: "accent" as const,
    goal: "directions_taxi" as const,
  },
  {
    key: "delivery",
    href: "/courier/",
    icon: Package,
    stepLabel: "Доставка",
    title: "Яндекс Доставка",
    text: "Пеший, авто, мото и грузовой курьер. Авторегистрация и поддержка парка «Армада».",
    cta: "Перейти к курьерам",
    accent: "emerald" as const,
    goal: "directions_delivery" as const,
  },
] as const;

export function Directions() {
  return (
    <section
      id="directions"
      className="section-anchor relative py-16 sm:py-20"
      aria-labelledby="directions-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="directions-heading"
            eyebrow="Шаг 2 · Направления"
            title="Куда подключаемся: такси или доставка"
            description="Сначала выберите направление. Затем откроются классы заказов и форматы оформления — без путаницы."
          />
        </FadeIn>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {DIRECTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.key} delay={item.key === "delivery" ? 0.08 : 0}>
                <article
                  className={`relative flex h-full flex-col overflow-hidden border-l-2 pl-6 ${
                    item.accent === "emerald"
                      ? "border-emerald-glow"
                      : "border-accent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                        item.accent === "emerald"
                          ? "bg-emerald-glow/15 text-emerald-glow"
                          : "bg-accent/15 text-accent"
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p
                        className={`text-xs font-medium uppercase tracking-wide ${
                          item.accent === "emerald"
                            ? "text-emerald-glow"
                            : "text-accent"
                        }`}
                      >
                        {item.stepLabel}
                      </p>
                      <h3 className="font-display text-2xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.text}
                  </p>
                  <div className="mt-6">
                    <Button
                      asChild
                      shine
                      size="lg"
                      variant={
                        item.accent === "emerald" ? "emerald" : "default"
                      }
                      className="w-full sm:w-auto"
                    >
                      <Link
                        href={item.href}
                        onClick={() => trackGoal(item.goal)}
                      >
                        {item.cta}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </Button>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Не уверены? После выбора направления можно пройти{" "}
          <Link href="/#quiz" className="text-accent hover:underline">
            квиз подбора тарифа
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
