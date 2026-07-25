import type { Metadata } from "next";
import Link from "next/link";
import { CONTACTS, LEGAL, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Реквизиты компании",
  description: `Реквизиты ${LEGAL.legalName}: ИНН ${LEGAL.inn}, ОГРН ${LEGAL.ogrn}. Контакты таксопарка «Армада».`,
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
          Юридические реквизиты {LEGAL.brandName}. Платёжные реквизиты для
          оплаты услуг уточняйте у менеджера при оформлении.
        </p>
        <dl className="space-y-3 rounded-2xl border border-border bg-surface/50 p-6">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Полное наименование
            </dt>
            <dd className="mt-1 text-foreground">{LEGAL.legalName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Бренд
            </dt>
            <dd className="mt-1 text-foreground">{LEGAL.brandName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              ИНН
            </dt>
            <dd className="mt-1 text-foreground">{LEGAL.inn}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              КПП
            </dt>
            <dd className="mt-1 text-foreground">{LEGAL.kpp}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              ОГРН
            </dt>
            <dd className="mt-1 text-foreground">{LEGAL.ogrn}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              Юридический адрес
            </dt>
            <dd className="mt-1 text-foreground">{LEGAL.address}</dd>
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
        <p className="flex flex-wrap gap-4">
          <Link href="/offer/" className="text-accent hover:underline">
            Агентское соглашение (оферта)
          </Link>
          <Link href="/privacy/" className="text-accent hover:underline">
            Политика конфиденциальности
          </Link>
          <Link href="/" className="text-accent hover:underline">
            ← На главную
          </Link>
        </p>
      </div>
    </div>
  );
}
