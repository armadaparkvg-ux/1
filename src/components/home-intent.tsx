"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { ContinueChip } from "@/components/continue-path";
import { useSiteAssistant } from "@/components/site-assistant";
import { Button } from "@/components/ui/button";
import { SITE_INTENTS } from "@/lib/site-index";

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
              С чего начать
            </p>
            <h2
              id="intent-heading"
              className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl"
            >
              Что вам нужно на сайте
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Выберите путь или откройте пульт: поиск ведёт на страницы и
              готовые ответы с сайта.
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

        <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {SITE_INTENTS.map((intent) => (
            <li key={intent.id}>
              <Link
                href={intent.href}
                className="flex min-h-12 items-center justify-center rounded-2xl border border-border bg-surface px-3 py-3 text-center text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent"
              >
                {intent.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
