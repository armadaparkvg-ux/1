"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACTS } from "@/lib/constants";
import { fleetGoPath } from "@/lib/fleet-forms";
import { goal, trackFleetRegistration, trackGoal } from "@/lib/metrika";
import { cn } from "@/lib/utils";

type StickyActionsProps = {
  /** Override primary register URL (otherwise derived from pathname) */
  registerHref?: string;
};

function resolveRegister(pathname: string | null): {
  href: string;
  channel: "taxi" | "courier";
  type: string;
  label: string;
} {
  if (pathname?.startsWith("/delivery")) {
    return {
      href: fleetGoPath("courier", "smz"),
      channel: "courier",
      type: "smz",
      label: "Зарегистрироваться",
    };
  }
  if (pathname?.startsWith("/trudovoj-dogovor")) {
    return {
      href: fleetGoPath("taxi", "labor"),
      channel: "taxi",
      type: "labor",
      label: "Оформить трудовой",
    };
  }
  return {
    href: fleetGoPath("taxi", "smz"),
    channel: "taxi",
    type: "smz",
    label: "Зарегистрироваться",
  };
}

/**
 * Mobile sticky CTA bar — appears after hero leaves the viewport.
 */
export function StickyActions({ registerHref }: StickyActionsProps) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const shownTracked = useRef(false);
  const resolved = resolveRegister(pathname);
  const href = registerHref ?? resolved.href;

  useEffect(() => {
    shownTracked.current = false;
    setVisible(false);

    const hero = document.querySelector("[data-hero]");
    if (!hero) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        const show = !entry.isIntersecting;
        setVisible(show);
        if (show && !shownTracked.current) {
          shownTracked.current = true;
          goal("sticky_shown", { place: "sticky", path: pathname ?? "/" });
        }
      },
      { threshold: 0, rootMargin: "0px" }
    );

    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  const onRegister = () => {
    if (resolved.type === "labor") {
      trackGoal("click_labor_apply", { place: "sticky", format: "labor" });
      return;
    }
    trackFleetRegistration({
      channel: resolved.channel,
      type: resolved.type,
      action: "link",
      place: "sticky",
    });
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-[#0a0a0a]/95 px-3 pt-2.5 backdrop-blur-md md:hidden",
        "pb-[max(0.625rem,env(safe-area-inset-bottom))]",
        "transition-transform duration-200 motion-reduce:transition-none",
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      )}
      aria-hidden={!visible}
    >
      <div className="mx-auto flex max-w-lg gap-2">
        <Button
          asChild
          shine
          size="lg"
          className="min-h-12 flex-[3] focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <Link href={href} tabIndex={visible ? 0 : -1} onClick={onRegister}>
            {resolved.label}
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="min-h-12 flex-[2] focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <a
            href={CONTACTS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={visible ? 0 : -1}
            onClick={() => trackGoal("lead_messenger", { place: "sticky" })}
          >
            <Send className="h-4 w-4" aria-hidden />
            Telegram
          </a>
        </Button>
      </div>
    </div>
  );
}
