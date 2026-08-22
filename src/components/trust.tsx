"use client";

import { Clock, ShieldCheck, Users, Calendar } from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/fade-in";
import Image from "next/image";

const FACTS = [
  {
    icon: Calendar,
    value: "7+",
    label: "лет на рынке",
    hint: "стабильная работа парка",
  },
  {
    icon: Users,
    value: "3 500+",
    label: "водителей",
    hint: "уже работают с нами",
  },
  {
    icon: Clock,
    value: "1,5–2 ч",
    label: "среднее время подключения",
    hint: "от заявки до активации",
  },
  {
    icon: ShieldCheck,
    value: "98%",
    label: "одобрения заявок",
    hint: "при полном пакете документов",
  },
];

export function Trust() {
  return (
    <section
      id="about"
      className="section-anchor relative py-20 sm:py-24"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="premium-card relative mb-12 overflow-hidden rounded-3xl">
            <div className="relative aspect-[21/9] min-h-[210px] w-full sm:min-h-[270px]">
              <Image
                src="/images/trust-city.webp"
                alt="Ночной город и работа такси"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#06080d]/95 via-[#0b0f14]/65 to-[#0b0f14]/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14]/60 to-transparent" />
              <div className="absolute inset-0 flex items-end p-6 sm:p-10">
                <div className="max-w-xl">
                  <p className="inline-flex rounded-full border border-accent/30 bg-background/55 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur">
                    Шаг 1 · О парке
                  </p>
                  <h2
                    id="trust-heading"
                    className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl text-balance"
                  >
                    Знакомство с таксопарком «Армада»
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            Подключаем к{" "}
            <strong className="font-medium text-foreground/90">
              Яндекс Такси
            </strong>{" "}
            и{" "}
            <strong className="font-medium text-foreground/90">
              Яндекс Доставке
            </strong>
            : прозрачные условия, быстрая активация и поддержка на каждом шаге
            до регистрации.
          </p>
        </FadeIn>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
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
                  <p className="mt-2 text-sm text-muted-foreground">{fact.hint}</p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
