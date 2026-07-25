"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FgisCheckButton } from "@/components/fgis-check-button";
import { PromoBanner } from "@/components/promo-banner";
import { CONTACTS, SITE } from "@/lib/constants";

const HERO_METRICS = [
  { value: "1,9%", label: "комиссия парка" },
  { value: "1,5–2 ч", label: "обычная активация" },
  { value: "8:00–21:00", label: "поддержка ежедневно" },
] as const;

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#07090d] pt-[72px]">
      <PromoBanner />
      <div className="relative mx-auto w-full max-w-[1600px] bg-[#0a0a0a]">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full"
        >
          <Image
            src="/images/hero-banner.jpg"
            alt="Подключение к Яндекс Такси — таксопарк Армада: лицензия, оформление по ТК РФ, низкая комиссия, быстрое подключение по всей России"
            width={1920}
            height={1080}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1600px"
            className="mx-auto h-auto w-full max-w-full object-contain"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,13,0.2),transparent_55%,rgba(7,9,13,0.35))]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07090d] via-[#07090d]/70 to-transparent sm:h-32"
            aria-hidden
          />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-0 sm:px-6 sm:pb-20 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="relative z-10 -mt-7 mb-8 text-center sm:-mt-12"
        >
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-accent/30 bg-[#111827]/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent shadow-[0_10px_30px_-20px_rgba(245,158,11,0.9)] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {SITE.fullName}
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Подключение к Яндекс Такси и Доставке
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Удалённо по всей России · комиссия от 1,9% · активация 1,5–2 часа ·{" "}
            {CONTACTS.hours}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-foreground/80 sm:text-sm">
            {["3 500+ водителей", "7+ лет на рынке", "98% одобрения"].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-glow" aria-hidden />
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="relative z-10 mx-auto mb-4 grid max-w-4xl grid-cols-1 gap-2 sm:grid-cols-3"
        >
          {HERO_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="metric-tile rounded-xl px-4 py-3 text-center sm:px-5"
            >
              <p className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {metric.value}
              </p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                {metric.label}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-stretch justify-center gap-3 rounded-2xl border border-border/90 bg-[#0d1420]/82 p-3 shadow-[0_24px_60px_-38px_rgba(0,0,0,1)] backdrop-blur-xl sm:p-4"
        >
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              asChild
              size="lg"
              shine
              className="shadow-glow sm:min-w-[240px]"
            >
              <Link href="/#directions">Выбрать направление</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="sm:min-w-[220px]"
            >
              <Link href="/#about">Узнать о парке</Link>
            </Button>
          </div>
          <div className="flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <FgisCheckButton size="default" className="sm:min-w-[200px]" />
            <Button asChild size="default" variant="secondary" pulse>
              <a href={CONTACTS.phoneHref}>
                <Phone className="h-4 w-4" aria-hidden />
                Позвонить
              </a>
            </Button>
            <Button asChild size="default" variant="outline" pulse>
              <Link
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send className="h-4 w-4" aria-hidden />
                Telegram
              </Link>
            </Button>
            <Button asChild size="default" variant="emerald" pulse>
              <Link
                href={CONTACTS.max}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                MAX
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="divider-glow" />
    </section>
  );
}
