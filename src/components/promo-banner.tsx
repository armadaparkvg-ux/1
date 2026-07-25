"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PROMO } from "@/lib/constants";

export function PromoBanner() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="promo-banner relative overflow-hidden border-b border-amber-400/35"
    >
      {/* Deep premium base */}
      <div
        className="absolute inset-0 bg-[linear-gradient(105deg,#0c0a07_0%,#1a1408_28%,#3d2a0a_52%,#1a1408_78%,#0c0a07_100%)]"
        aria-hidden
      />
      {/* Animated gold shimmer sweep */}
      <div
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-amber-200/35 to-transparent animate-shine-loop"
        aria-hidden
      />
      {/* Soft gold glow pulse */}
      <div
        className="pointer-events-none absolute inset-0 animate-promo-glow bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.28),transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-3 px-4 py-3.5 sm:flex-row sm:gap-5 sm:px-6 sm:py-4 lg:px-8">
        <p className="flex items-center gap-2.5 text-center font-display text-sm font-semibold tracking-tight text-amber-50 sm:text-base md:text-lg">
          <Sparkles
            className="hidden h-5 w-5 shrink-0 text-amber-300 animate-pulse-soft sm:block"
            aria-hidden
          />
          <span className="bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-100 bg-clip-text text-transparent">
            {PROMO.text}
          </span>
        </p>
        <Link
          href={PROMO.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-fgis group relative inline-flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[length:200%_200%] bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 px-6 text-sm font-bold text-[#1a1205] shadow-[0_0_28px_-4px_rgba(251,191,36,0.65)] animate-fgis-attention transition-transform hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1408]"
        >
          <span
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent animate-shine-loop"
            aria-hidden
          />
          <span className="relative z-10">{PROMO.ctaLabel}</span>
        </Link>
      </div>
    </motion.div>
  );
}
