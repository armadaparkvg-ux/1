"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRegisterChooser } from "@/components/register-chooser";
import { CONTACTS } from "@/lib/constants";
import { goal, trackGoal } from "@/lib/metrika";
import { cn } from "@/lib/utils";

/**
 * Mobile sticky CTA — регистрация через выбор направления/формата,
 * MAX основной канал, Telegram запасной.
 */
export function StickyActions() {
  const pathname = usePathname();
  const { openRegister } = useRegisterChooser();
  const [visible, setVisible] = useState(false);
  const shownTracked = useRef(false);

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
    if (pathname?.startsWith("/trudovoj-dogovor")) {
      trackGoal("click_labor_apply", {
        place: "sticky",
        format: "labor",
        channel: "max",
      });
      window.open(CONTACTS.max, "_blank", "noopener,noreferrer");
      return;
    }
    if (pathname?.startsWith("/taxi")) {
      openRegister({ startAt: "taxi-format" });
      return;
    }
    if (pathname?.startsWith("/delivery") || pathname?.startsWith("/courier")) {
      openRegister({ startAt: "delivery-type" });
      return;
    }
    openRegister({ startAt: "channel" });
  };

  const registerLabel = pathname?.startsWith("/trudovoj-dogovor")
    ? "Оформить трудовой"
    : "Зарегистрироваться";

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
          type="button"
          shine
          size="lg"
          className="min-h-12 flex-[3] focus-visible:ring-2 focus-visible:ring-amber-400"
          tabIndex={visible ? 0 : -1}
          onClick={onRegister}
        >
          {registerLabel}
        </Button>
        <Button
          asChild
          size="lg"
          variant="emerald"
          className="min-h-12 flex-[2] focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <a
            href={CONTACTS.max}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={visible ? 0 : -1}
            onClick={() =>
              trackGoal("lead_messenger", { place: "sticky", channel: "max" })
            }
            aria-label="Написать в MAX"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            MAX
          </a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="min-h-12 flex-[2] px-3 focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <a
            href={CONTACTS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={visible ? 0 : -1}
            onClick={() =>
              trackGoal("lead_messenger", {
                place: "sticky",
                channel: "telegram",
              })
            }
            aria-label="Написать в Telegram"
          >
            <Send className="h-4 w-4" aria-hidden />
          </a>
        </Button>
      </div>
    </div>
  );
}
