import { DESTINATION_LABELS } from "@/lib/site-index";

export const CONTINUE_STORAGE_KEY = "armada-continue-path";

export type ContinueRecord = {
  href: string;
  label: string;
  at: number;
};

function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return withSlash === "//" ? "/" : withSlash;
}

export function labelForPath(pathname: string): string | null {
  const path = normalizePath(pathname);
  if (DESTINATION_LABELS[path]) return DESTINATION_LABELS[path];
  return null;
}

export function readContinuePath(): ContinueRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONTINUE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ContinueRecord;
    if (!parsed?.href || !parsed.label) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function rememberContinuePath(pathname: string): ContinueRecord | null {
  if (typeof window === "undefined") return null;
  const href = normalizePath(pathname);
  const label = labelForPath(href);
  if (!label || href === "/") return null;
  const record: ContinueRecord = { href, label, at: Date.now() };
  try {
    window.localStorage.setItem(CONTINUE_STORAGE_KEY, JSON.stringify(record));
  } catch {
    return record;
  }
  return record;
}
