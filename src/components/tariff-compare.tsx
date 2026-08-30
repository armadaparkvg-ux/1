"use client";

import Link from "next/link";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import { Button } from "@/components/ui/button";

const ROWS = [
  {
    label: "Комиссия парка",
    self: "1,9%",
    ip: "1,9%",
    labor: "3% / 5% / 6%",
  },
  {
    label: "Вывод средств",
    self: "Моментальный",
    ip: "Моментальный",
    labor: "Моментальный",
  },
  {
    label: "Налоги",
    self: "Платит водитель (НПД)",
    ip: "Платит ИП",
    labor: "Платит парк",
  },
  {
    label: "2‑НДФЛ / договор",
    self: "Нет",
    ip: "По запросу (ИП)",
    labor: "Да",
  },
  {
    label: "Кому подходит",
    self: "Большинству водителей",
    ip: "Превышен лимит НПД",
    labor: "Превышен лимит по ИП, банкротство, пособия",
  },
] as const;

export function TariffCompare() {
  return (
    <section
      id="compare"
      className="section-anchor relative py-10 sm:py-16 lg:py-20"
      aria-labelledby="compare-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="compare-heading"
            eyebrow="После шага 4 · Сравнение"
            title="Какой тариф выбрать"
            description="Коротко: у всех форматов моментальный вывод; самозанятый и ИП — комиссия 1,9%; трудовой — официально, налоги платит парк."
          />
        </FadeIn>

        <FadeIn delay={0.08} className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Сравнение тарифов таксопарка Армада для Яндекс Такси
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 py-3 font-medium text-muted-foreground">
                  Параметр
                </th>
                <th className="px-3 py-3 font-semibold text-foreground">
                  Самозанятый
                </th>
                <th className="px-3 py-3 font-semibold text-foreground">ИП</th>
                <th className="px-3 py-3 font-semibold text-foreground">
                  Трудовой
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-b border-border/70">
                  <th className="px-3 py-3 font-medium text-muted-foreground">
                    {row.label}
                  </th>
                  <td className="px-3 py-3 text-foreground/90">{row.self}</td>
                  <td className="px-3 py-3 text-foreground/90">{row.ip}</td>
                  <td className="px-3 py-3 text-foreground/90">{row.labor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </FadeIn>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild shine>
            <Link href="/#quiz">Подобрать в квизе</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/#tariffs">Смотреть тарифы</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
