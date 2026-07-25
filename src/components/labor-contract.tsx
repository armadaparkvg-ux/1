"use client";

import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import {
  LaborContractBanner,
  LaborTariffCardImage,
} from "@/components/labor-contract-banner";
import { DualPathActions } from "@/components/funnel-actions";
import { LABOR_OPTIONS } from "@/lib/constants";
import type { ApplyTopic } from "@/lib/apply";

const OPTIONS: {
  id: string;
  topic: ApplyTopic;
  title: string;
  badge: string | null;
  body: string[];
  imageAlt: string;
}[] = [
  {
    id: "opt-3pct",
    topic: LABOR_OPTIONS[0].value,
    title: "3% + 300₽ ежедневные списания",
    badge: "Популярный",
    imageAlt: "Трудовой договор 3% + 300₽ — парк Армада",
    body: [
      "Преимущества этого вида трудоустройства: если превышен лимит по доходам самозанятого и не хотите открывать ИП, легальность перед контролирующими органами, возможность прохождения процедуры банкротства, получения пособий и т.д. По запросу парк может предоставить: справку 2НДФЛ, сам договор.",
      "Важно: списания 300₽ ежедневные рассчитаны на каждый день месяца от оклада ровными частями, так как налог мы платим фиксированный за Вас вне зависимости от суммы дохода и количества дней работы.",
    ],
  },
  {
    id: "opt-5pct",
    topic: LABOR_OPTIONS[1].value,
    title: "5% + 100₽ ежедневные списания",
    badge: null,
    imageAlt: "Трудовой договор 5% + 100₽ — парк Армада",
    body: [
      "Более низкие ежедневные списания при чуть большем проценте комиссии. Подходит тем, кто хочет снизить фиксированную часть расходов на налоги.",
    ],
  },
  {
    id: "opt-6pct",
    topic: LABOR_OPTIONS[2].value,
    title: "6% без ежедневных списаний",
    badge: "Без фикс. списаний",
    imageAlt: "Трудовой договор 6% без ежедневных списаний — парк Армада",
    body: [
      "Суть документа (трудового договора) — только для подтверждения типа занятости в аккаунте Яндекса. Раз в месяц для прохождения проверки в аккаунте парка делаете нам запрос и мы вас оформляем, проходите проверку — увольняем по договору, но продолжаете работать в парке.",
    ],
  },
];

export function LaborContract() {
  return (
    <section
      id="labor-contract"
      className="section-anchor relative py-20 sm:py-24"
      aria-labelledby="labor-heading"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.1),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="labor-heading"
            eyebrow="Шаг 3 · Трудовой договор"
            title="Не можете оформить самозанятость или ИП — есть решение"
            description="Три формата трудового договора через парк «Армада». Авторегистрации нет — оформление через поддержку парка: выберите тариф и отправьте заявку."
          />
        </FadeIn>

        <FadeIn delay={0.06} className="mx-auto mt-10 max-w-xl lg:max-w-2xl">
          <LaborContractBanner />
        </FadeIn>

        <Stagger className="mt-12 grid gap-6 lg:grid-cols-3" stagger={0.1}>
          {OPTIONS.map((opt) => (
            <StaggerItem key={opt.id}>
              <article
                id={opt.id}
                className="premium-card flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <LaborTariffCardImage badge={opt.badge} alt={opt.imageAlt} />
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="font-display text-xl font-semibold text-foreground text-balance">
                    {opt.title}
                  </h3>
                  <div className="mt-4 flex-1 space-y-3">
                    {opt.body.map((p) => (
                      <p
                        key={p.slice(0, 40)}
                        className="text-sm leading-relaxed text-muted-foreground"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                  <DualPathActions
                    applyTopic={opt.topic}
                    applyLabel="Оформить через поддержку парка"
                    chats={false}
                  />
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
