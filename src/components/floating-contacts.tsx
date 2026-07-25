"use client";

import Link from "next/link";
import { MessageCircle, Phone, Send } from "lucide-react";
import { CONTACTS } from "@/lib/constants";
import { trackGoal } from "@/lib/metrika";
import { cn } from "@/lib/utils";

export function FloatingContacts() {
  const items = [
    {
      href: CONTACTS.phoneHref,
      label: "Звонок",
      icon: Phone,
      kind: "phone" as const,
      className:
        "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-accent-foreground shadow-[0_8px_24px_-10px_rgba(245,158,11,0.55)]",
    },
    {
      href: CONTACTS.telegram,
      label: "Telegram",
      icon: Send,
      kind: "messenger" as const,
      className:
        "bg-surface-elevated text-foreground border border-amber-400/35 shadow-[0_0_18px_-10px_rgba(245,158,11,0.35)]",
      external: true,
    },
    {
      href: CONTACTS.max,
      label: "MAX",
      icon: MessageCircle,
      kind: "messenger" as const,
      className:
        "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-[0_8px_24px_-10px_rgba(16,185,129,0.45)]",
      external: true,
    },
  ];

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[#0b0f14]/92 p-2 backdrop-blur-xl md:hidden"
      role="navigation"
      aria-label="Быстрая связь"
    >
      <div className="mx-auto flex max-w-lg gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              onClick={() =>
                item.kind === "phone"
                  ? trackGoal("click_phone")
                  : trackGoal("lead_messenger")
              }
              className={cn(
                "group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl px-3 py-3 text-sm font-semibold transition-transform active:scale-[0.98]",
                item.className
              )}
            >
              <Icon className="relative z-10 h-4 w-4" aria-hidden />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
