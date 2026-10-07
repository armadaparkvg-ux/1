"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { METRIKA_ID } from "@/lib/metrika";

declare global {
  interface Window {
    ymab?: (...args: unknown[]) => void;
  }
}

/**
 * На клиентских переходах Next.js повторно инициализируем Вариокуб,
 * иначе отчёты по SPA-навигации будут неточными.
 */
export function VarioqubSpaInit() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      window.ymab?.(`metrika.${METRIKA_ID}`, "init");
    } catch {
      /* ignore */
    }
  }, [pathname]);

  return null;
}
