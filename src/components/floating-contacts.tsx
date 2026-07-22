"use client";

import Link from "next/link";
import { MessageCircle, Phone, Send } from "lucide-react";
import { CONTACTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FloatingContacts() {
  const items = [
    {
      href: CONTACTS.phoneHref,
      label: "Звонок",
      icon: Phone,
      className:
        "bg-accent text-accent-foreground shadow-glow-sm animate-chat-pulse-amber",
    },
    {
      href: CONTACTS.telegram,
      label: "Telegram",
      icon: Send,
      className:
        "bg-surface-elevated text-foreground border border-accent/40 animate-chat-pulse-outline",
      external: true,
    },
    {
      href: CONTACTS.max,
      label: "MAX",
      icon: MessageCircle,
      className:
        "bg-emerald-glow text-white shadow-[0_0_20px_-6px_rgba(16,185,129,0.5)] animate-chat-pulse",
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
