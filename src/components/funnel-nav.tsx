"use client";

import Link from "next/link";
import { trackGoal } from "@/lib/metrika";

const STEPS = [
  { href: "/#about", label: "1. Парк" },
  { href: "/#directions", label: "2. Направление" },
  { href: "/#yandex-tariffs", label: "3. Класс" },
  { href: "/#tariffs", label: "4. Оформление" },
  { href: "/#apply", label: "5. Заявка" },
] as const;

/** Компактная карта воронки — всегда видно, куда идти дальше */
export function FunnelNav() {
  return (
    <nav
      aria-label="Шаги подключения"
      className="border-b border-border/80 bg-[#0b0f14]/90 backdrop-blur-md"
    >
      <ol className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2.5 sm:gap-2 sm:px-6 lg:justify-center lg:px-8">
        {STEPS.map((step) => (
          <li key={step.href} className="shrink-0">
            <Link
              href={step.href}
              onClick={() => {
                if (step.href.includes("directions")) {
                  trackGoal("directions_view");
                }
              }}
              className="inline-flex whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground sm:text-sm"
            >
              {step.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
