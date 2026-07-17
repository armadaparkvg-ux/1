"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type ApplyTopic,
  buildApplyMessage,
  copyText,
  maxApplyUrl,
  openMessenger,
  telegramApplyUrl,
} from "@/lib/apply";
import { cn } from "@/lib/utils";

type ApplyContextValue = {
  openApply: (topic?: ApplyTopic) => void;
};

const ApplyContext = createContext<ApplyContextValue | null>(null);

export function useApply() {
  const ctx = useContext(ApplyContext);
  if (!ctx) {
    throw new Error("useApply must be used within ApplyProvider");
  }
  return ctx;
}

export function ApplyProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<ApplyTopic>("общая заявка");
  const [copied, setCopied] = useState(false);

  const message = useMemo(() => buildApplyMessage(topic), [topic]);

  const openApply = useCallback((next: ApplyTopic = "общая заявка") => {
    setTopic(next);
    setCopied(false);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openTelegram = async () => {
    await copyText(message);
    openMessenger(telegramApplyUrl(message));
    setOpen(false);
  };

  const openMax = async () => {
    const ok = await copyText(message);
    setCopied(ok);
    openMessenger(maxApplyUrl());
    // keep dialog briefly so user sees copy hint for MAX
    if (ok) {
      setTimeout(() => setOpen(false), 1200);
    }
  };

  return (
    <ApplyContext.Provider value={{ openApply }}>
      {children}
      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-dialog-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Закрыть"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-[#0f1724] p-6 shadow-card-hover sm:p-7">
            <button
              type="button"
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Закрыть"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-sm font-medium uppercase tracking-wide text-accent">
              Быстрая заявка
            </p>
            <h2
              id="apply-dialog-title"
              className="mt-2 font-display text-2xl font-semibold text-foreground text-balance"
            >
              Куда удобнее написать?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Текст заявки с выбранным тарифом уже готов — откройте мессенджер и
              отправьте сообщение.
            </p>

            <div className="mt-5 rounded-xl border border-border bg-surface/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                Ваш выбор
              </p>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
                {message}
              </pre>
            </div>

            {copied ? (
              <p className="mt-3 text-sm text-emerald-400" role="status">
                Текст скопирован — вставьте его в чат MAX (Ctrl+V / долгое
                нажатие → Вставить).
              </p>
            ) : null}

            <div className="mt-6 grid gap-3">
              <Button
                type="button"
                size="lg"
                variant="outline"
                shine
                className="w-full justify-center"
                onClick={openTelegram}
              >
                <Send className="h-4 w-4" aria-hidden />
                Написать в Telegram
              </Button>
              <Button
                type="button"
                size="lg"
                variant="emerald"
                shine
                className="w-full justify-center"
                onClick={openMax}
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Сообщение в MAX
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </ApplyContext.Provider>
  );
}

export function ApplyButton({
  topic = "общая заявка",
  children = "Оставить заявку",
  className,
  variant = "default",
  size = "default",
}: {
  topic?: ApplyTopic;
  children?: ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "outline" | "emerald";
  size?: "default" | "sm" | "lg";
}) {
  const { openApply } = useApply();
  return (
    <Button
      type="button"
      shine
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={() => openApply(topic)}
    >
      {children}
    </Button>
  );
}
