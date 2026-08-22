"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, Car, MessageCircle, Package, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACTS } from "@/lib/constants";
import { fleetGoPath } from "@/lib/fleet-forms";
import { trackFleetRegistration, trackGoal } from "@/lib/metrika";
import { cn } from "@/lib/utils";

type Step = "channel" | "taxi-format" | "delivery-type";

type OpenOptions = {
  /** Skip channel step when already on /taxi or /delivery */
  startAt?: Step;
};

type RegisterChooserContextValue = {
  openRegister: (opts?: OpenOptions) => void;
};

const RegisterChooserContext =
  createContext<RegisterChooserContextValue | null>(null);

export function useRegisterChooser() {
  const ctx = useContext(RegisterChooserContext);
  if (!ctx) {
    throw new Error("useRegisterChooser must be used within RegisterChooserProvider");
  }
  return ctx;
}

const TAXI_FORMATS = [
  {
    id: "smz",
    title: "Самозанятый",
    text: "Быстрый старт, комиссия от 1,9%",
  },
  {
    id: "ip",
    title: "ИП",
    text: "Парковый ИП, моментальный вывод",
  },
  {
    id: "labor",
    title: "Трудовой договор",
    text: "Оформление через чат поддержки",
  },
] as const;

const DELIVERY_TYPES = [
  { id: "foot", title: "Пеший курьер" },
  { id: "auto", title: "Автокурьер" },
  { id: "moto", title: "Мотокурьер" },
  { id: "cargo", title: "Грузовой курьер" },
] as const;

function RegisterSheet({
  open,
  onClose,
  startAt,
}: {
  open: boolean;
  onClose: () => void;
  startAt: Step;
}) {
  const titleId = useId();
  const [step, setStep] = useState<Step>(startAt);

  useEffect(() => {
    if (!open) return;
    setStep(startAt);
  }, [open, startAt]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const title =
    step === "channel"
      ? "Куда регистрироваться?"
      : step === "taxi-format"
        ? "Формат работы в такси"
        : "Тариф курьера";

  const goBack = () => {
    if (
      (step === "taxi-format" || step === "delivery-type") &&
      startAt === "channel"
    ) {
      setStep("channel");
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] md:flex md:items-center md:justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border border-border bg-[#0b0f14] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl",
          "md:relative md:inset-auto md:w-full md:max-w-md md:rounded-3xl md:p-6"
        )}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border md:hidden" aria-hidden />
        <div className="flex items-center gap-2">
          {step !== "channel" || startAt !== "channel" ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Назад"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <span className="w-10" aria-hidden />
          )}
          <h2
            id={titleId}
            className="flex-1 text-center font-display text-lg font-semibold text-foreground"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {step === "channel" ? (
            <>
              <button
                type="button"
                className="flex w-full items-start gap-3 rounded-2xl border border-border bg-surface/50 p-4 text-left transition hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => {
                  setStep("taxi-format");
                }}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                  <Car className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">Такси</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    Яндекс Такси · СМЗ, ИП или трудовой
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="flex w-full items-start gap-3 rounded-2xl border border-border bg-surface/50 p-4 text-left transition hover:border-emerald-glow/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => {
                  setStep("delivery-type");
                }}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-glow/25 bg-emerald-glow/10 text-emerald-glow">
                  <Package className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold text-foreground">Доставка</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    Курьер Яндекс Доставка
                  </span>
                </span>
              </button>
            </>
          ) : null}

          {step === "taxi-format" ? (
            <>
              {TAXI_FORMATS.map((item) =>
                item.id === "labor" ? (
                  <a
                    key={item.id}
                    href={CONTACTS.max}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start gap-3 rounded-2xl border border-border bg-surface/50 p-4 text-left transition hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    onClick={() => {
                      trackGoal("click_labor_apply", {
                        place: "chooser",
                        format: "labor",
                        channel: "max",
                      });
                      trackGoal("lead_messenger", {
                        place: "chooser",
                        channel: "max",
                        topic: "labor",
                      });
                      onClose();
                    }}
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                      <Briefcase className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-semibold text-foreground">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {item.text} · напишите в MAX
                      </span>
                    </span>
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    href={fleetGoPath("taxi", item.id)}
                    className="flex w-full items-start gap-3 rounded-2xl border border-border bg-surface/50 p-4 text-left transition hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    onClick={() => {
                      trackFleetRegistration({
                        channel: "taxi",
                        type: item.id,
                        action: "link",
                        place: "card",
                      });
                      onClose();
                    }}
                  >
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                      <Car className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block font-semibold text-foreground">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {item.text}
                      </span>
                    </span>
                  </Link>
                )
              )}
              <Link
                href="/trudovoj-dogovor/"
                className="block pt-2 text-center text-sm text-muted-foreground underline-offset-4 hover:text-accent hover:underline"
                onClick={onClose}
              >
                Подробнее о трудовом договоре
              </Link>
            </>
          ) : null}

          {step === "delivery-type" ? (
            DELIVERY_TYPES.map((item) => (
              <Link
                key={item.id}
                href={fleetGoPath("courier", item.id)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface/50 p-4 text-left transition hover:border-emerald-glow/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={() => {
                  trackFleetRegistration({
                    channel: "courier",
                    type: item.id,
                    action: "link",
                    place: "card",
                  });
                  onClose();
                }}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-glow/25 bg-emerald-glow/10 text-emerald-glow">
                  <Package className="h-5 w-5" aria-hidden />
                </span>
                <span className="font-semibold text-foreground">{item.title}</span>
              </Link>
            ))
          ) : null}
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-2 text-center text-xs text-muted-foreground">
            Или напишите в поддержку
          </p>
          <div className="flex gap-2">
            <Button asChild shine size="lg" variant="emerald" className="flex-[3]">
              <a
                href={CONTACTS.max}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackGoal("lead_messenger", {
                    place: "chooser",
                    channel: "max",
                  });
                  onClose();
                }}
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Написать в MAX
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-[2]">
              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackGoal("lead_messenger", {
                    place: "chooser",
                    channel: "telegram",
                  });
                  onClose();
                }}
              >
                Telegram
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterChooserProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [startAt, setStartAt] = useState<Step>("channel");

  const openRegister = useCallback((opts?: OpenOptions) => {
    setStartAt(opts?.startAt ?? "channel");
    setOpen(true);
  }, []);

  const onClose = useCallback(() => setOpen(false), []);

  return (
    <RegisterChooserContext.Provider value={{ openRegister }}>
      {children}
      <RegisterSheet open={open} onClose={onClose} startAt={startAt} />
    </RegisterChooserContext.Provider>
  );
}
