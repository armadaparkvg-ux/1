"use client";

import { FadeIn, SectionHeading } from "@/components/fade-in";

const ITEMS = [
  {
    title: "Кто платит налоги",
    text: "При трудовом договоре налог платит парк. Ежедневные списания 300₽ или 100₽ — это фиксированная часть, рассчитанная на каждый день месяца от оклада ровными частями, так как налог уплачивается фиксированно вне зависимости от суммы дохода и количества дней работы.",
  },
  {
    title: "Документы по запросу",
    text: "По запросу парк может предоставить справку 2НДФЛ и сам трудовой договор — для банков, пособий, контролирующих органов и подтверждения занятости.",
  },
  {
    title: "Проверка в аккаунте Яндекса (вариант 6%)",
    text: "Раз в месяц для прохождения проверки в аккаунте парка вы делаете запрос — мы оформляем вас, вы проходите проверку, после чего увольняем по договору, но вы продолжаете работать в парке.",
  },
];

export function Taxes() {
  return (
    <section
      id="taxes"
      className="section-anchor relative py-20 sm:py-24"
      aria-labelledby="taxes-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Прозрачность"
            title="Налоги и документы"
            description="Понятная схема: кто платит налоги, какие документы вы получаете и как проходит проверка в Яндексе."
          />
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <article className="h-full rounded-2xl border border-border bg-surface/50 p-6 sm:p-7">
                <div className="mb-3 font-display text-sm font-semibold text-accent">
                  0{i + 1}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>

        <h2 id="taxes-heading" className="sr-only">
          Налоги и документы
        </h2>
      </div>
    </section>
  );
}
