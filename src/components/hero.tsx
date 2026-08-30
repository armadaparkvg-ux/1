"use client";

import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegisterChooser } from "@/components/register-chooser";
import { CONTACTS } from "@/lib/constants";
import { trackGoal } from "@/lib/metrika";

const FACTS = [
  "выплаты ежедневно",
  "комиссия от 1,9%",
  "поддержка 8:00–21:00",
  "7+ лет на рынке",
] as const;

export function Hero() {
  const { openRegister } = useRegisterChooser();

  return (
    <section
      id="hero"
      data-hero
      className="relative isolate overflow-hidden border-b border-border bg-[#080b11] pt-[72px]"
    >
      <picture>
        <source
          media="(max-width: 768px)"
          srcSet="/images/hero-bg-768.webp"
          type="image/webp"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-bg.webp"
          alt=""
          width={1600}
          height={900}
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-55 sm:object-right sm:opacity-65"
          aria-hidden
        />
      </picture>
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#07090d] via-[#07090d]/92 to-[#07090d]/55 sm:via-[#07090d]/88 sm:to-[#07090d]/35"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-[#07090d]/40"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-5 pt-4 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent backdrop-blur sm:text-xs sm:tracking-[0.14em]">
            Таксопарк «Армада» · 7 лет · 3 800+ самозанятых
          </p>
          <h1 className="mt-3 font-display text-[1.7rem] font-semibold leading-tight tracking-tight text-foreground text-balance sm:mt-5 sm:text-4xl lg:text-5xl">
            Подключение к Яндекс Такси и Доставке за 10–15 минут
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base lg:text-lg">
            Комиссия от 1,9%. Самозанятый, ИП или трудовой договор. Удалённо по
            всей России.
          </p>

          <div className="mt-5 flex flex-col gap-2.5 sm:mt-8 sm:gap-3">
            <Button
              type="button"
              shine
              size="lg"
              className="w-full shadow-glow sm:w-auto"
              onClick={() => openRegister()}
            >
              Зарегистрироваться онлайн
            </Button>
            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
              <Button
                asChild
                size="lg"
                variant="emerald"
                shine
                className="w-full sm:w-auto"
              >
                <a
                  href={CONTACTS.max}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackGoal("lead_messenger", {
                      place: "hero",
                      channel: "max",
                    })
                  }
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  MAX
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <a
                  href={CONTACTS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackGoal("lead_messenger", {
                      place: "hero",
                      channel: "telegram",
                    })
                  }
                >
                  <Send className="h-4 w-4" aria-hidden />
                  Telegram
                </a>
              </Button>
            </div>
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] font-medium text-foreground/85 sm:mt-7 sm:gap-x-4 sm:gap-y-2 sm:text-sm">
            {FACTS.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0 text-emerald-glow"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
