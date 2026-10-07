import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ROUTE_HINTS, type RouteHintId } from "@/lib/route-hints";

export function RouteHint({ id }: { id: RouteHintId }) {
  const hint = ROUTE_HINTS[id];

  return (
    <aside
      className="premium-card rounded-2xl p-5 sm:p-6"
      aria-label="Подсказка из статьи"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
        Подсказка из статьи
      </p>
      <p className="mt-2 max-w-2xl font-display text-lg font-semibold text-foreground text-balance">
        {hint.why}
      </p>
      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-foreground/90">
        {hint.points.map((point) => (
          <li key={point} className="flex gap-2">
            <span className="text-accent" aria-hidden>
              •
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <Link
        href={hint.href}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {hint.title}
        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden />
      </Link>
    </aside>
  );
}
