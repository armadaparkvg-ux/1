"use client";

import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { PromoActionsBanner } from "@/components/promo-actions-banner";
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
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-[#1a1408] via-surface to-surface-elevated px-4 py-10 sm:px-10 sm:py-14 lg:px-12">
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl"
              aria-hidden
            />

            <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
              <div className="order-2 lg:order-1">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                  Акции и бонусы
                </p>
                <h2
                  id="max-heading"
                  className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl"
                >
                  Регулярные розыгрыши и акции парка «Армада»
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Подключайтесь к парку, участвуйте в розыгрышах и получайте
                  бонусы. Анонсы публикуем в канале MAX — подпишитесь, чтобы не
                  пропустить.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    asChild
                    size="lg"
                    variant="emerald"
                    shine
                    className="w-full shadow-[0_0_40px_-8px_rgba(16,185,129,0.55)] sm:w-auto"
                  >
                    <Link
                      href={CONTACTS.maxChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Подписаться в MAX
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    shine
                    className="w-full sm:w-auto"
                  >
                    <Link href="/#directions">Подключиться к парку</Link>
                  </Button>
                </div>
              </div>

              <div className="order-1 mx-auto w-full max-w-[520px] lg:order-2 lg:max-w-none">
                <Link
                  href={CONTACTS.maxChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-transform duration-300 hover:scale-[1.015] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Открыть канал MAX — акции и бонусы"
                >
                  <PromoActionsBanner />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
