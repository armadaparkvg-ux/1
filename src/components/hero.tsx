"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACTS, SITE } from "@/lib/constants";

export function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-hero-radial pt-[72px]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          style={reduce ? undefined : { x: sx, y: sy }}
          className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-[100px]"
        />
        <motion.div
          style={reduce ? undefined : { x: sy, y: sx }}
          className="absolute right-0 top-40 h-80 w-80 rounded-full bg-amber-500/15 blur-[110px]"
        />
        <div className="absolute bottom-0 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 pb-28 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8 lg:pt-28">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent sm:text-base"
        >
          {SITE.fullName}
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="max-w-4xl font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15] text-balance"
        >
          Подключение к Яндекс Такси на выгодных условиях — выберите свой формат
          работы
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Таксопарк «Армада»: три формата сотрудничества — парковый самозанятый,
          парковый ИП и трудовой договор. Прозрачные условия, консультация{" "}
          {CONTACTS.hours}, помощь с документами и лицензией такси.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
        >
          <Button asChild size="lg" shine className="shadow-glow">
            <Link href="/#tariffs">Выбрать тариф</Link>
          </Button>
          <Button asChild size="lg" variant="outline" shine>
            <Link
              href={CONTACTS.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="h-4 w-4" aria-hidden />
              Написать в Telegram
            </Link>
          </Button>
          <Button asChild size="lg" variant="emerald" shine>
            <Link href={CONTACTS.max} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Сообщение в MAX
            </Link>
          </Button>
        </motion.div>
      </div>

      <div className="divider-glow absolute inset-x-0 bottom-0" />
    </section>
  );
}
