import Link from "next/link";
import { MapPin } from "lucide-react";
import { CITIES } from "@/lib/cities";

export function HomeCities() {
  return (
    <section
      id="goroda"
      className="section-anchor border-t border-border py-8 sm:py-14"
      aria-labelledby="cities-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            География
          </p>
          <h2
            id="cities-heading"
            className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl"
          >
            Подключаем удалённо по всей России
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Офиса нет — документы онлайн. Отдельные страницы помогают найти парк
            по городу в поиске Яндекса.
          </p>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <li key={city.slug}>
              <Link
                href={`/goroda/${city.slug}/`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3 py-1.5 text-sm text-foreground/90 hover:border-accent/40 hover:text-accent"
              >
                <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
                {city.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/goroda/"
              className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/15"
            >
              Все города →
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
