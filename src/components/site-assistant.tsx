"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { MessageCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  buildQuestionApplyMessage,
  copyText,
  maxApplyUrl,
  openMessenger,
} from "@/lib/apply";
import { trackGoal } from "@/lib/metrika";
import { SITE_INTENTS } from "@/lib/site-index";
import { KIND_LABEL, searchSite, type SiteHit } from "@/lib/site-search";
import { cn } from "@/lib/utils";

type OpenOpts = {
  query?: string;
  place?: string;
};

type SiteAssistantContextValue = {
  openAssistant: (opts?: OpenOpts) => void;
  closeAssistant: () => void;
};

const SiteAssistantContext = createContext<SiteAssistantContextValue | null>(
  null
);

export function useSiteAssistant() {
  const ctx = useContext(SiteAssistantContext);
  if (!ctx) {
    throw new Error("useSiteAssistant must be used within SiteAssistantProvider");
  }
  return ctx;
}

export function SiteAssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState("");

  const openAssistant = useCallback((opts?: OpenOpts) => {
    setSeed(opts?.query ?? "");
    setOpen(true);
    trackGoal("assistant_open", { place: opts?.place ?? "global" });
  }, []);

  const closeAssistant = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      setOpen((current) => {
        const next = !current;
        if (next) trackGoal("assistant_open", { place: "shortcut" });
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({ openAssistant, closeAssistant }),
    [openAssistant, closeAssistant]
  );

  return (
    <SiteAssistantContext.Provider value={value}>
      {children}
      <SiteAssistantDialog
        open={open}
        seed={seed}
        onClose={closeAssistant}
      />
    </SiteAssistantContext.Provider>
  );
}

function SiteAssistantDialog({
  open,
  seed,
  onClose,
}: {
  open: boolean;
  seed: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const inputId = useId();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setQuery(seed);
      setActive(0);
      setCopied(false);
    }
  }, [open, seed]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) {
      inputRef.current?.focus();
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const hits = useMemo(() => searchSite(query, 8), [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const askMax = async (text: string) => {
    const message = buildQuestionApplyMessage(text);
    trackGoal("assistant_ask", { q: text.slice(0, 80) });
    const ok = await copyText(message);
    setCopied(ok);
    openMessenger(maxApplyUrl());
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!hits.length) return;
      setActive((index) => (index + 1) % hits.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!hits.length) return;
      setActive((index) => (index - 1 + hits.length) % hits.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const hit = hits[active];
      if (hit) {
        trackGoal("assistant_select", { href: hit.href, kind: hit.kind });
        window.location.assign(hit.href);
        onClose();
        return;
      }
      if (query.trim().length >= 2) {
        void askMax(query);
      }
    }
  };

  if (!open) return null;

  const showEmpty = query.trim().length < 2;
  const activeHit = hits[active];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-start sm:pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/72 backdrop-blur-sm"
        aria-label="Закрыть пульт"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="relative z-10 flex max-h-[min(36rem,86dvh)] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-accent/25 bg-[#0c121c] shadow-[0_32px_80px_-36px_rgba(0,0,0,0.95)] overscroll-contain"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 pb-3 pt-4 sm:px-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              Пульт сайта
            </p>
            <h2
              id={titleId}
              className="mt-1 font-display text-lg font-semibold text-foreground"
            >
              Куда ехать на сайте
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Закрыть"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="px-4 pt-3 sm:px-5">
          <label htmlFor={inputId} className="sr-only">
            Поиск по сайту
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3">
            <Search className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            <input
              ref={inputRef}
              id={inputId}
              name="site-search"
              type="search"
              autoComplete="off"
              spellCheck={false}
              inputMode="search"
              placeholder="Лицензия ФГИС, трудовой, Москва…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              aria-autocomplete="list"
              aria-controls={listId}
              aria-activedescendant={activeHit ? `${listId}-${active}` : undefined}
              className="h-11 w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {showEmpty ? (
          <div className="flex flex-wrap gap-2 px-4 py-4 sm:px-5">
            {SITE_INTENTS.map((intent) => (
              <button
                key={intent.id}
                type="button"
                onClick={() => setQuery(intent.query)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground hover:border-accent/40 hover:text-accent"
              >
                {intent.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 sm:px-3">
          {!showEmpty && hits.length === 0 ? (
            <div className="px-3 py-6 text-sm text-muted-foreground">
              <p>На сайте нет готового ответа на этот запрос.</p>
              <p className="mt-2">
                Напишите в MAX: текст скопируется, менеджер ответит в чате.
              </p>
              <Button
                type="button"
                variant="emerald"
                className="mt-4"
                onClick={() => void askMax(query)}
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Спросить в MAX
              </Button>
            </div>
          ) : null}

          {hits.length ? (
            <ul id={listId} role="listbox" className="space-y-1 py-2">
              {hits.map((hit, index) => (
                <ResultRow
                  key={hit.id}
                  hit={hit}
                  id={`${listId}-${index}`}
                  active={index === active}
                  onHover={() => setActive(index)}
                  onOpen={() => {
                    trackGoal("assistant_select", {
                      href: hit.href,
                      kind: hit.kind,
                    });
                    onClose();
                  }}
                  onAsk={() => void askMax(hit.title)}
                />
              ))}
            </ul>
          ) : null}
        </div>

        <p
          className="border-t border-border px-4 py-3 text-[11px] leading-relaxed text-muted-foreground sm:px-5"
          aria-live="polite"
        >
          {copied
            ? "Текст скопирован. Вставьте в MAX, если чат открылся пустым."
            : "Ответы только со страниц «Армады». Это поиск по сайту, не нейросеть. Ctrl K открывает пульт."}
        </p>
      </div>
    </div>
  );
}

function ResultRow({
  hit,
  id,
  active,
  onHover,
  onOpen,
  onAsk,
}: {
  hit: SiteHit;
  id: string;
  active: boolean;
  onHover: () => void;
  onOpen: () => void;
  onAsk: () => void;
}) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      className={cn(
        "rounded-2xl border px-3 py-3",
        active
          ? "border-accent/35 bg-accent/10"
          : "border-transparent bg-transparent"
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
        {KIND_LABEL[hit.kind]}
      </p>
      <Link
        href={hit.href}
        onClick={onOpen}
        className="mt-1 block font-display text-base font-semibold text-foreground hover:text-accent"
      >
        {hit.title}
      </Link>
      <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {hit.snippet}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Link
          href={hit.href}
          onClick={onOpen}
          className="text-sm font-semibold text-accent hover:underline"
        >
          Открыть страницу
        </Link>
        {hit.kind === "faq" ? (
          <button
            type="button"
            onClick={onAsk}
            className="text-sm font-semibold text-emerald-glow hover:underline"
          >
            Уточнить в MAX
          </button>
        ) : null}
      </div>
    </li>
  );
}
