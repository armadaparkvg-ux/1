"use client";

import Link from "next/link";
import { MessageCircle, Phone, Send } from "lucide-react";
import { CONTACTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContactButtonsProps = {
  className?: string;
  size?: "sm" | "default" | "lg";
  showLabels?: boolean;
  compact?: boolean;
};

export function ContactButtons({
  className,
  size = "default",
  showLabels = true,
  compact = false,
}: ContactButtonsProps) {
  const items = [
    {
      href: CONTACTS.phoneHref,
      label: "Телефон",
      icon: Phone,
      variant: "secondary" as const,
      aria: `Позвонить ${CONTACTS.phoneDisplay}`,
    },
    {
      href: CONTACTS.telegram,
      label: "Telegram",
      icon: Send,
      variant: "outline" as const,
      aria: "Написать в Telegram",
      external: true,
    },
    {
      href: CONTACTS.max,
      label: "MAX",
      icon: MessageCircle,
      variant: "emerald" as const,
      aria: "Сообщение в MAX",
      external: true,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        compact && "gap-1.5",
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.label}
            asChild
            variant={item.variant}
            size={compact ? "sm" : size}
            shine
          >
            <Link
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              aria-label={item.aria}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {showLabels ? <span>{item.label}</span> : null}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

export function IconContactLinks({ className }: { className?: string }) {
  const items = [
    {
      href: CONTACTS.phoneHref,
      label: `Позвонить ${CONTACTS.phoneDisplay}`,
      icon: Phone,
    },
    {
      href: CONTACTS.telegram,
      label: "Telegram",
      icon: Send,
      external: true,
    },
    {
      href: CONTACTS.max,
      label: "MAX",
      icon: MessageCircle,
      external: true,
    },
  ];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            aria-label={item.label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-accent"
          >
            <Icon className="h-4 w-4" />
          </Link>
        );
      })}
    </div>
  );
}
