"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACTS, SITE } from "@/lib/constants";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#07090d] pt-[72px]">
      <h1 className="sr-only">
        Подключение к Яндекс Такси на выгодных условиях — таксопарк «Армада»
      </h1>

      {/*
        Full banner visible on all devices (object-contain):
        text and car stay readable — no cover-crop cutting off Cyrillic copy.
      */}
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
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#07090d] to-transparent sm:h-16"
            aria-hidden
          />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 sm:pb-16 lg:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mb-5 text-center text-sm text-muted-foreground sm:text-base"
        >
          {SITE.fullName} · консультация {CONTACTS.hours}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <Button asChild size="lg" shine className="shadow-glow sm:min-w-[200px]">
            <Link href="/#tariffs">Выбрать тариф</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            shine
            className="sm:min-w-[200px]"
          >
            <a
              href={CONTACTS.fgisCheck}
              target="_blank"
              rel="noopener noreferrer"
            >
              Проверить ФГИС Такси
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            shine
            className="sm:min-w-[200px]"
          >
            <Link
              href={CONTACTS.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="h-4 w-4" aria-hidden />
              Написать в Telegram
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="emerald"
            shine
            className="sm:min-w-[200px]"
          >
            <Link href={CONTACTS.max} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Сообщение в MAX
            </Link>
          </Button>
        </motion.div>
      </div>

      <div className="divider-glow" />
    </section>
  );
}
