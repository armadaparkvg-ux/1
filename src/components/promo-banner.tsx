"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import { PROMO } from "@/lib/constants";

export function PromoBanner() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden border-b border-accent/30 bg-gradient-to-r from-accent via-accent-soft to-accent"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2), transparent 40%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-4 py-3 sm:flex-row sm:gap-4 sm:px-6 sm:py-3.5 lg:px-8">
        <p className="flex items-center gap-2 text-center font-display text-sm font-bold tracking-tight text-accent-foreground sm:text-base md:text-lg">
          <Zap
            className="hidden h-5 w-5 shrink-0 sm:block"
            aria-hidden
          />
          <span>{PROMO.text}</span>
        </p>
        <Link
          href={PROMO.href}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-accent-foreground px-5 text-sm font-semibold text-accent shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
        >
          {PROMO.ctaLabel}
        </Link>
      </div>
    </motion.div>
  );
}
