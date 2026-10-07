"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  labelForPath,
  readContinuePath,
  rememberContinuePath,
  type ContinueRecord,
} from "@/lib/continue-path";

export function ContinueTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    rememberContinuePath(pathname);
  }, [pathname]);

  return null;
}

export function ContinueChip({ className }: { className?: string }) {
  const pathname = usePathname();
  const [record, setRecord] = useState<ContinueRecord | null>(null);

  useEffect(() => {
    const saved = readContinuePath();
    if (!saved) return;
    const current = pathname?.endsWith("/") ? pathname : `${pathname}/`;
    if (saved.href === current) return;
    if (!labelForPath(saved.href)) return;
    setRecord(saved);
  }, [pathname]);

  if (!record) return null;

  return (
    <Link
      href={record.href}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent hover:bg-accent/15"
      }
    >
      Продолжить: {record.label}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </Link>
  );
}
