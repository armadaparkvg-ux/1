import Link from "next/link";
import { CONTACTS, FOOTER_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[#080c11] pb-24 pt-14 md:pb-12">
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

          <div>
            <p className="text-sm font-semibold text-foreground">Разделы</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Документы</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy/" className="hover:text-accent transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/offer/" className="hover:text-accent transition-colors">
                  Агентское соглашение (оферта)
                </Link>
              </li>
              <li>
                <Link
                  href="/requisites/"
                  className="hover:text-accent transition-colors"
                >
                  Реквизиты компании
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="hover:text-accent transition-colors">
                  Полезные статьи
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Связь</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={CONTACTS.phoneHref}
                  className="hover:text-accent transition-colors"
                >
                  {CONTACTS.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={CONTACTS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={CONTACTS.max}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  MAX
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-glow mt-10" />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {year} {SITE.fullName}. Подключение к Яндекс Такси. Все права
          защищены.
        </p>
      </div>
    </footer>
  );
}
