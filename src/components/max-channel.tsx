"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { CONTACTS } from "@/lib/constants";

export function MaxChannel() {
  return (
    <section
      id="max-channel"
      className="section-anchor relative py-20 sm:py-24"
      aria-labelledby="max-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/80 via-surface to-surface-elevated px-6 py-12 sm:px-12 sm:py-16">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl"
              aria-hidden
            />

            <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 animate-pulse-soft">
                  <Gift className="h-7 w-7" aria-hidden />
                </div>
                <h2
                  id="max-heading"
                  className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance"
                >
                  Наш канал в MAX — акции и бонусы
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  В нашем канале мы регулярно проводим акции и разыгрываем бонусы
                  для водителей. Подпишитесь, чтобы не пропустить выгодные
                  предложения.
                </p>
              </div>

              <Button
                asChild
                size="lg"
                variant="emerald"
                shine
                className="w-full shrink-0 text-base shadow-[0_0_40px_-8px_rgba(16,185,129,0.55)] md:w-auto"
              >
                <Link
                  href={CONTACTS.max}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Подписаться на канал в MAX
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
