"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bike,
  Briefcase,
  Car,
  Check,
  MessageCircle,
  Package,
  PersonStanding,
  RotateCcw,
  Send,
  Truck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACTS } from "@/lib/constants";
import { fleetGoPath } from "@/lib/fleet-forms";
import { trackFleetRegistration, trackGoal } from "@/lib/metrika";
import { cn } from "@/lib/utils";

type Direction = "taxi" | "delivery";
type TaxiFormat = "smz" | "ip" | "labor";
type DeliveryType = "foot" | "auto" | "moto" | "cargo";
type Phase = "direction" | "branch" | "result";

type OpenOptions = {
  /** Skip direction when already on /taxi or /delivery */
  startAt?: "direction" | "taxi-format" | "delivery-type";
};

type RegisterChooserContextValue = {
  openRegister: (opts?: OpenOptions) => void;
};

const RegisterChooserContext =
  createContext<RegisterChooserContextValue | null>(null);

export function useRegisterChooser() {
  const ctx = useContext(RegisterChooserContext);
  if (!ctx) {
    throw new Error(
      "useRegisterChooser must be used within RegisterChooserProvider"
    );
  }
  return ctx;
}

const DIRECTIONS = [
  {
    id: "taxi" as const,
    title: "Такси",
    hint: "Яндекс Такси · авторегистрация или трудовой",
    icon: Car,
  },
  {
    id: "delivery" as const,
    title: "Доставка",
    hint: "Курьер Яндекс Доставка · 4 тарифа",
    icon: Package,
  },
] as const;

const TAXI_FORMATS = [
  {
    id: "smz" as const,
    title: "Самозанятый",
    hint: "Быстрый старт, комиссия от 1,9%",
    icon: Car,
  },
  {
    id: "ip" as const,
    title: "ИП",
    hint: "Парковый ИП, моментальный вывод",
    icon: Briefcase,
  },
  {
    id: "labor" as const,
    title: "Трудовой договор",
    hint: "Без авторегистрации — напишите в чат",
    icon: Briefcase,
  },
] as const;

const DELIVERY_TYPES = [
  {
    id: "foot" as const,
    title: "Пеший курьер",
    hint: "Пешком или на общественном транспорте",
    icon: PersonStanding,
  },
  {
    id: "auto" as const,
    title: "Автокурьер",
    hint: "На личном легковом авто",
    icon: Car,
  },
  {
    id: "moto" as const,
    title: "Мотокурьер",
    hint: "Мотоцикл / скутер",
    icon: Bike,
  },
  {
    id: "cargo" as const,
    title: "Грузовой курьер",
    hint: "Грузовой транспорт",
    icon: Truck,
  },
] as const;

function OptionCard({
  title,
  hint,
  icon: Icon,
  onClick,
  tone = "amber",
}: {
  title: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  tone?: "amber" | "emerald";
}) {
  const emerald = tone === "emerald";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border bg-surface/50 p-4 text-left transition",
        "hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        emerald
          ? "border-border hover:border-emerald-glow/40"
          : "border-border hover:border-accent/40"
      )}
    >
      <span
        className={cn(
          "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
          emerald
            ? "border-emerald-glow/25 bg-emerald-glow/10 text-emerald-glow"
            : "border-accent/25 bg-accent/10 text-accent"
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span>
        <span className="block font-semibold text-foreground">{title}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{hint}</span>
      </span>
    </button>
  );
}

function RegisterQuizSheet({
  open,
  onClose,
  startAt,
}: {
  open: boolean;
  onClose: () => void;
  startAt: OpenOptions["startAt"];
}) {
  const titleId = useId();
  const initial = useMemo(() => {
    if (startAt === "taxi-format") {
      return {
        phase: "branch" as Phase,
        direction: "taxi" as Direction,
      };
    }
    if (startAt === "delivery-type") {
      return {
        phase: "branch" as Phase,
        direction: "delivery" as Direction,
      };
    }
    return { phase: "direction" as Phase, direction: null as Direction | null };
  }, [startAt]);

  const [phase, setPhase] = useState<Phase>(initial.phase);
  const [direction, setDirection] = useState<Direction | null>(
    initial.direction
  );
  const [taxiFormat, setTaxiFormat] = useState<TaxiFormat | null>(null);
  const [deliveryType, setDeliveryType] = useState<DeliveryType | null>(null);

  const reset = useCallback(() => {
    setPhase(initial.phase);
    setDirection(initial.direction);
    setTaxiFormat(null);
    setDeliveryType(null);
  }, [initial]);

  useEffect(() => {
    if (!open) return;
    reset();
  }, [open, reset]);

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

  const stepIndex =
    phase === "direction" ? 1 : phase === "branch" ? 2 : 3;
  const totalSteps = 3;

  const title =
    phase === "direction"
      ? "Шаг 1 · Куда регистрироваться?"
      : phase === "branch" && direction === "taxi"
        ? "Шаг 2 · Формат в такси"
        : phase === "branch" && direction === "delivery"
          ? "Шаг 2 · Тариф курьера"
          : "Шаг 3 · Готово";

  const goBack = () => {
    if (phase === "result") {
      setPhase("branch");
      setTaxiFormat(null);
      setDeliveryType(null);
      return;
    }
    if (phase === "branch") {
      if (startAt === "direction" || !startAt) {
        setPhase("direction");
        setDirection(null);
        return;
      }
      onClose();
      return;
    }
    onClose();
  };

  const chooseDirection = (next: Direction) => {
    setDirection(next);
    setTaxiFormat(null);
    setDeliveryType(null);
    setPhase("branch");
    trackGoal("quiz_goal", { goal: next === "taxi" ? "connect" : "delivery" });
  };

  const chooseTaxi = (format: TaxiFormat) => {
    setTaxiFormat(format);
    setPhase("result");
    if (format === "labor") {
      trackGoal("click_labor_apply", { place: "quiz", format: "labor" });
    } else {
      trackFleetRegistration({
        channel: "taxi",
        type: format,
        action: "link",
        place: "card",
      });
    }
  };

  const chooseDelivery = (type: DeliveryType) => {
    setDeliveryType(type);
    setPhase("result");
    trackFleetRegistration({
      channel: "courier",
      type,
      action: "link",
      place: "card",
    });
  };

  const taxiResult = TAXI_FORMATS.find((f) => f.id === taxiFormat);
  const deliveryResult = DELIVERY_TYPES.find((d) => d.id === deliveryType);
  const registerHref =
    direction === "taxi" && taxiFormat && taxiFormat !== "labor"
      ? fleetGoPath("taxi", taxiFormat)
      : direction === "delivery" && deliveryType
        ? fleetGoPath("courier", deliveryType)
        : null;

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
          "absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-3xl border border-border bg-[#0b0f14] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl",
          "md:relative md:inset-auto md:w-full md:max-w-lg md:rounded-3xl md:p-6"
        )}
      >
        <div
          className="mx-auto mb-3 h-1 w-10 rounded-full bg-border md:hidden"
          aria-hidden
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Назад"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2
            id={titleId}
            className="flex-1 text-center font-display text-base font-semibold text-foreground sm:text-lg"
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

        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={stepIndex}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        >
          <div
            className="h-full rounded-full bg-accent transition-all duration-300 motion-reduce:transition-none"
            style={{ width: `${(stepIndex / totalSteps) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Шаг {stepIndex} из {totalSteps}
        </p>

        <div className="mt-4 space-y-2">
          {phase === "direction"
            ? DIRECTIONS.map((item) => (
                <OptionCard
                  key={item.id}
                  title={item.title}
                  hint={item.hint}
                  icon={item.icon}
                  tone={item.id === "delivery" ? "emerald" : "amber"}
                  onClick={() => chooseDirection(item.id)}
                />
              ))
            : null}

          {phase === "branch" && direction === "taxi"
            ? TAXI_FORMATS.map((item) => (
                <OptionCard
                  key={item.id}
                  title={item.title}
                  hint={item.hint}
                  icon={item.icon}
                  onClick={() => chooseTaxi(item.id)}
                />
              ))
            : null}

          {phase === "branch" && direction === "delivery"
            ? DELIVERY_TYPES.map((item) => (
                <OptionCard
                  key={item.id}
                  title={item.title}
                  hint={item.hint}
                  icon={item.icon}
                  tone="emerald"
                  onClick={() => chooseDelivery(item.id)}
                />
              ))
            : null}

          {phase === "result" ? (
            <div className="rounded-2xl border border-border bg-surface/60 p-5">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Check className="h-5 w-5" aria-hidden />
              </div>

              {direction === "taxi" && taxiFormat === "labor" ? (
                <>
                  <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
                    Трудовой договор
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Авторегистрации нет — оформите через поддержку парка в чате.
                    Основной канал — MAX, Telegram запасной.
                  </p>
                  <div className="mt-5 flex flex-col gap-2">
                    <Button asChild shine size="lg" variant="emerald">
                      <a
                        href={CONTACTS.max}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          trackGoal("lead_messenger", {
                            place: "quiz",
                            channel: "max",
                            topic: "labor",
                          });
                          trackGoal("click_labor_apply", {
                            place: "quiz",
                            format: "labor",
                            channel: "max",
                          });
                        }}
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden />
                        Написать в MAX
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <a
                        href={CONTACTS.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          trackGoal("lead_messenger", {
                            place: "quiz",
                            channel: "telegram",
                            topic: "labor",
                          });
                          trackGoal("click_labor_apply", {
                            place: "quiz",
                            format: "labor",
                            channel: "telegram",
                          });
                        }}
                      >
                        <Send className="h-4 w-4" aria-hidden />
                        Написать в Telegram
                      </a>
                    </Button>
                    <Link
                      href="/trudovoj-dogovor/"
                      className="pt-1 text-center text-sm text-accent underline-offset-4 hover:underline"
                      onClick={onClose}
                    >
                      Страница трудового договора
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
                    {direction === "taxi"
                      ? `Такси · ${taxiResult?.title ?? ""}`
                      : `Доставка · ${deliveryResult?.title ?? ""}`}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {direction === "taxi"
                      ? taxiResult?.hint
                      : deliveryResult?.hint}
                    . Дальше откроется форма авторегистрации Яндекс Fleet.
                  </p>
                  {registerHref ? (
                    <Button asChild shine size="lg" className="mt-5 w-full">
                      <Link
                        href={registerHref}
                        onClick={() => {
                          onClose();
                        }}
                      >
                        Перейти к авторегистрации
                      </Link>
                    </Button>
                  ) : null}
                  <p className="mt-3 break-all text-center text-[11px] text-muted-foreground/80">
                    {registerHref ? `park-armada.ru${registerHref}` : null}
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={reset}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Пройти квиз заново
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function RegisterChooserProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [startAt, setStartAt] =
    useState<OpenOptions["startAt"]>("direction");

  const openRegister = useCallback((opts?: OpenOptions) => {
    setStartAt(opts?.startAt ?? "direction");
    setOpen(true);
  }, []);

  const onClose = useCallback(() => setOpen(false), []);

  return (
    <RegisterChooserContext.Provider value={{ openRegister }}>
      {children}
      <RegisterQuizSheet open={open} onClose={onClose} startAt={startAt} />
    </RegisterChooserContext.Provider>
  );
}
