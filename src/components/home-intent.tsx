"use client";

import { Search } from "lucide-react";
import { ContinueChip } from "@/components/continue-path";
import { RouteHint } from "@/components/route-hint";
import { useSiteAssistant } from "@/components/site-assistant";
import { Button } from "@/components/ui/button";

const ROUTE = [
  {
    n: "1",
    title: "Направление",
    text: "Карточки ниже: такси, трудовой, доставка или лицензия ФГИС.",
  },
  {
    n: "2",
    title: "Формат",
    text: "На открытой странице — комиссия, тариф и кому писать заявку.",
  },
  {
    n: "3",
    title: "Заявка",
    text: "Форма Fleet для самозанятого и ИП. Трудовой и ФГИС — только чат.",
  },
] as const;

export function HomeIntent() {
  const { openAssistant } = useSiteAssistant();

  return (
    <section
      className="border-b border-border/80 bg-[#080c12] py-6 sm:py-8"
      aria-labelledby="intent-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Маршрут
            </p>
            <h2
              id="intent-heading"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl"
            >
              Три шага, без обходных кнопок
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Сначала направление, потом формат, потом заявка. Пульт ищет по
              страницам сайта и не подставляет чужие цифры.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ContinueChip />
            <Button
              type="button"
              variant="secondary"
              onClick={() => openAssistant({ place: "home-intent" })}
            >
              <Search className="h-4 w-4" aria-hidden />
              Открыть пульт
            </Button>
          </div>
        </div>

        <ol className="mt-5 grid gap-3 sm:grid-cols-3">
          {ROUTE.map((step) => (
            <li key={step.n} className="premium-card rounded-2xl p-4">
              <p className="font-display text-sm font-semibold text-accent">
                Шаг {step.n}
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-foreground">
                {step.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-4">
          <RouteHint id="home" />
        </div>
      </div>
    </section>
  );
}
