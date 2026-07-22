"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { trackGoal } from "@/lib/metrika";

const STEPS = [
  { href: "/#about", label: "Парк" },
  { href: "/#directions", label: "Направление" },
  { href: "/#yandex-tariffs", label: "Класс" },
  { href: "/#tariffs", label: "Оформление" },
  { href: "/#apply", label: "Заявка" },
] as const;

/** Компактная карта воронки — всегда видно, куда идти дальше */
export function FunnelNav() {
  return (
    <nav
      aria-label="Шаги подключения"
      className="border-b border-border/80 bg-[#0a0f18]/90 shadow-[0_14px_38px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl"
    >
      <ol className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:gap-2 sm:px-6 lg:justify-center lg:px-8">
        {STEPS.map((step, index) => (
          <li key={step.href} className="shrink-0">
            <Link
              href={step.href}
              onClick={() => {
                if (step.href.includes("directions")) {
                  trackGoal("directions_view");
                }
              }}
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-transparent px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-border hover:bg-surface-elevated/70 hover:text-foreground sm:px-3 sm:text-sm"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface text-[10px] font-semibold text-accent transition-colors group-hover:border-accent/50 group-hover:bg-accent/10">
                {index === 0 ? <Check className="h-3 w-3" aria-hidden /> : index + 1}
              </span>
              {step.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
