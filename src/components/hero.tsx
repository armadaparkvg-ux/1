"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduce = useReducedMotion();
  const { openRegister } = useRegisterChooser();

  return (
    <section
      id="hero"
      data-hero
      className="relative isolate overflow-hidden border-b border-border bg-[#080b11] pt-[72px]"
    >
      <Image
        src="/images/hero-bg.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right opacity-65"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#07090d] via-[#07090d]/88 to-[#07090d]/35"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-[#07090d]/40"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl"
        >
          <p className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent backdrop-blur">
            Таксопарк «Армада» · 7 лет на рынке · 3 800+ самозанятых
          </p>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Подключение к Яндекс Такси и Доставке за 10–15 минут
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
            Комиссия парка от 1,9%. Самозанятый, ИП или трудовой договор.
            Удалённо по всей России, без визита в офис.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Button
              type="button"
              shine
              size="lg"
              className="w-full shadow-glow sm:w-auto"
              onClick={() => openRegister()}
            >
              Зарегистрироваться онлайн
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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
                  Написать в MAX
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

          {/* SLOT: форма «имя + телефон» — этап 2, см. раздел «Отложено» */}

          <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-foreground/85 sm:text-sm">
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
        </motion.div>
      </div>
    </section>
  );
}
