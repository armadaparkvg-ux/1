"use client";

import { Clock, ShieldCheck, Users, Calendar } from "lucide-react";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";

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
    <section className="relative py-20 sm:py-24" aria-labelledby="trust-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="trust-heading"
            eyebrow="Почему Армада"
            title="Таксопарк «Армада» — цифры, которым доверяют водители"
            description="Прозрачные условия подключения к Яндекс Такси, быстрая активация и поддержка на каждом этапе."
          />
        </FadeIn>

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
          {FACTS.map((fact) => {
            const Icon = fact.icon;
            return (
              <StaggerItem key={fact.label}>
                <article className="glass group h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
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
