import type { Metadata } from "next";
import Link from "next/link";
import { CONTACTS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Реквизиты компании",
  description: `Юридическая информация ${SITE.fullName}. Контакты и режим работы таксопарка для подключения к Яндекс Такси.`,
  alternates: { canonical: `${SITE.url}/requisites/` },
  robots: { index: true, follow: true },
};

export default function RequisitesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-foreground">
        Реквизиты компании
      </h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          Полные юридические реквизиты предоставляются по запросу при
          оформлении сотрудничества. На сайте не публикуются платёжные
          реквизиты.
        </p>
        <dl className="space-y-3 rounded-2xl border border-border bg-surface/50 p-6">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Наименование
            </dt>
            <dd className="mt-1 text-foreground">{SITE.fullName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Контактный телефон
            </dt>
            <dd className="mt-1">
              <a
                href={CONTACTS.phoneHref}
                className="text-accent hover:underline"
              >
                {CONTACTS.phoneDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Режим работы
            </dt>
            <dd className="mt-1 text-foreground">{CONTACTS.hours}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Формат работы
            </dt>
            <dd className="mt-1 text-foreground">
              Удалённо, без офиса приёма посетителей
            </dd>
          </div>
        </dl>
        <p>
          Для получения полного комплекта юридических документов свяжитесь с
          менеджером по телефону или в мессенджерах.
        </p>
        <p>
          <Link href="/" className="text-accent hover:underline">
            ← На главную
          </Link>
        </p>
      </div>
    </div>
  );
}
