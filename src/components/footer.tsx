import Link from "next/link";
import { CONTACTS, FOOTER_GROUPS, LEGAL, SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[#080c11] pb-[calc(4.75rem+env(safe-area-inset-bottom))] pt-8 sm:pt-12 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl font-bold gradient-text"
            >
              {SITE.name}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {SITE.fullName} — подключение водителей к Яндекс Такси: самозанятый,
              ИП и трудовой договор. Работаем удалённо, {CONTACTS.hours}.
            </p>
            <p className="mt-3 text-xs text-muted-foreground/80">{SITE.domain}</p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-foreground">{group.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 border-t border-border/70 pt-6 md:grid-cols-2">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={CONTACTS.phoneHref}
                className="transition-colors hover:text-accent"
              >
                {CONTACTS.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={CONTACTS.max}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                MAX — основной чат заявок
              </a>
            </li>
            <li>
              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                Telegram — запасной канал
              </a>
            </li>
            <li>
              <a href="/feed.xml" className="transition-colors hover:text-accent">
                RSS статей
              </a>
            </li>
          </ul>
          <p className="text-xs leading-relaxed text-muted-foreground md:text-right">
            Юрлицо: {LEGAL.legalName}, ИНН {LEGAL.inn}. Парк не сдаёт автомобили.
          </p>
        </div>

        <div className="divider-glow mt-8" />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {year} {SITE.fullName}. Подключение к Яндекс Такси. Все права
          защищены.
        </p>
      </div>
    </footer>
  );
}
