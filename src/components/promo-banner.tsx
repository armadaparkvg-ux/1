"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROMO } from "@/lib/constants";

export function PromoBanner() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="promo-banner relative overflow-hidden border-b border-amber-400/25"
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(105deg,#0c0a07_0%,#16110a_35%,#2a1e0c_55%,#16110a_80%,#0c0a07_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-200/20 to-transparent animate-shine-soft"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 animate-promo-glow bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.18),transparent_65%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-4 py-3.5 sm:flex-row sm:gap-5 sm:px-6 sm:py-4 lg:px-8">
        <p className="flex items-center gap-2.5 text-center font-display text-sm font-semibold tracking-tight text-amber-50/95 sm:text-base md:text-lg">
          <Sparkles
            className="hidden h-5 w-5 shrink-0 text-amber-300/90 sm:block"
            aria-hidden
          />
          <span>{PROMO.text}</span>
        </p>
        <Button asChild shine size="default" className="shrink-0">
          <Link href={PROMO.href} target="_blank" rel="noopener noreferrer">
            {PROMO.ctaLabel}
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
