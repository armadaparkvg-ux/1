import Link from "next/link";
import { CONTACTS, SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[#080c11] pb-24 pt-14 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-bold gradient-text">
              {SITE.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {SITE.fullName} — подключение водителей к Яндекс Такси. Работаем
              удалённо, {CONTACTS.hours}.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Документы</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/offer" className="hover:text-accent transition-colors">
                  Публичная оферта
                </Link>
              </li>
              <li>
                <Link href="/requisites" className="hover:text-accent transition-colors">
                  Реквизиты компании
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">Связь</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={CONTACTS.phoneHref} className="hover:text-accent transition-colors">
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
          © {year} {SITE.fullName}. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
