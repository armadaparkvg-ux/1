"use client";

import Image from "next/image";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { DualPathActions } from "@/components/funnel-actions";
import { LABOR_OPTIONS } from "@/lib/constants";
import type { ApplyTopic } from "@/lib/apply";

const OPTIONS: {
  id: string;
  topic: ApplyTopic;
  title: string;
  badge: string | null;
  body: string[];
  image: string;
  imageAlt: string;
}[] = [
  {
    id: "opt-3pct",
    topic: LABOR_OPTIONS[0].value,
    title: "3% + 300₽ ежедневные списания",
    badge: "Популярный",
    image: "/images/tariff-labor.jpg",
    imageAlt:
      "Водитель подписывает трудовой договор с парком: схема 3% плюс 300 ₽ ежедневных списаний на налоги",
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
    image: "/images/tariff-ip.jpg",
    imageAlt:
      "Трудовой договор с пониженными ежедневными списаниями: 5% комиссии и 100 ₽ в день",
    body: [
      "Более низкие ежедневные списания при чуть большем проценте комиссии. Подходит тем, кто хочет снизить фиксированную часть расходов на налоги.",
    ],
  },
  {
    id: "opt-6pct",
    topic: LABOR_OPTIONS[2].value,
    title: "6% без ежедневных списаний",
    badge: "Без фикс. списаний",
    image: "/images/tariff-selfemployed.jpg",
    imageAlt:
      "Трудовой договор без ежедневных списаний — комиссия 6% для подтверждения занятости в Яндекс Про",
    body: [
      "Суть документа (трудового договора) — только для подтверждения типа занятости в аккаунте Яндекса. Раз в месяц для прохождения проверки в аккаунте парка делаете нам запрос и мы вас оформляем, проходите проверку — увольняем по договору, но продолжаете работать в парке.",
    ],
  },
];

type LaborContractProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function LaborContract({
  eyebrow = "Шаг 3 · Трудовой договор",
  title = "Выберите один из трёх форматов",
  description = "Авторегистрации для трудового договора нет — оформление только через поддержку парка. Выберите вариант и отправьте заявку в чат.",
}: LaborContractProps = {}) {
  return (
    <section
      id="labor-contract"
      className="section-anchor relative py-12 sm:py-20 lg:py-24"
      aria-labelledby="labor-heading"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(67,56,202,0.12),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="labor-heading"
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </FadeIn>

        <Stagger className="mt-14 grid gap-6 lg:grid-cols-3" stagger={0.1}>
          {OPTIONS.map((opt) => (
            <StaggerItem key={opt.id}>
              <article
                id={opt.id}
                className="premium-card flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={opt.image}
                    alt={opt.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1724] via-transparent to-transparent" />
                  {opt.badge ? (
                    <span className="absolute left-4 top-4 rounded-full bg-accent/95 px-3 py-1 text-xs font-semibold text-accent-foreground">
                      {opt.badge}
                    </span>
                  ) : null}
                </div>
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
