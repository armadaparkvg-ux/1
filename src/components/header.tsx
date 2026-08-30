"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { CONTACTS, NAV_LINKS, NAV_PRIMARY, SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { IconContactLinks } from "@/components/contact-buttons";
import { useSiteAssistant } from "@/components/site-assistant";
import { cn } from "@/lib/utils";

export function Header() {
  const { openAssistant } = useSiteAssistant();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    firstLinkRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const openSearch = () => {
    setOpen(false);
    openAssistant({ place: "header" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200 ease-out",
        scrolled
          ? "border-b border-border bg-[#0b0f14]/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          <span className="gradient-text">{SITE.name}</span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 xl:flex"
          aria-label="Основное меню"
        >
          {NAV_PRIMARY.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors duration-160 hover:bg-muted/50 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openSearch}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-2.5 text-sm text-muted-foreground transition-colors duration-160 hover:border-accent/40 hover:text-foreground"
            aria-label="Открыть поиск по сайту"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Поиск</span>
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <IconContactLinks />
            <Button asChild shine size="sm" className="hidden lg:inline-flex">
              <Link href="/#directions">Выбрать направление</Link>
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground xl:hidden"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id={menuId}
          className="border-t border-border bg-[#0b0f14]/98 backdrop-blur-xl overscroll-contain xl:hidden"
        >
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4"
            aria-label="Мобильное меню"
          >
            <button
              type="button"
              onClick={openSearch}
              className="mb-1 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-left text-base text-foreground hover:bg-muted"
            >
              <Search className="h-4 w-4 text-accent" aria-hidden />
              Поиск по сайту
            </button>
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.href}
                ref={index === 0 ? firstLinkRef : undefined}
                href={link.href}
                className="rounded-xl px-4 py-3 text-base text-foreground hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              <Button asChild shine className="w-full">
                <Link href="/#directions" onClick={() => setOpen(false)}>
                  Выбрать направление
                </Link>
              </Button>
              <a
                href={CONTACTS.phoneHref}
                className="text-center text-sm text-muted-foreground"
              >
                {CONTACTS.phoneDisplay}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
