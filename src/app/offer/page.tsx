import type { Metadata } from "next";
import Link from "next/link";
import { CONTACTS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Публичная оферта",
  description: `Публичная оферта ${SITE.fullName} на услуги подключения водителей к Яндекс Такси, лицензии ФГИС и ОСГОП.`,
  alternates: { canonical: `${SITE.url}/offer` },
  robots: { index: true, follow: true },
};

export default function OfferPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-foreground">
        Публичная оферта
      </h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          Настоящий документ является предложением {SITE.fullName} заключить
          договор на услуги по подключению водителей к сервису Яндекс Такси и
          сопутствующие услуги (оформление лицензии ФГИС, реестр перевозчиков,
          ОСГОП) на условиях, указанных на сайте.
        </p>
        <p>
          Акцептом оферты считается обращение по телефону или в мессенджерах
          (Telegram / MAX) с последующим согласованием условий менеджером парка.
        </p>
        <p>
          Конкретные условия сотрудничества (комиссия, формат оформления,
          перечень услуг) согласовываются индивидуально и фиксируются в
          соответствующих документах.
        </p>
        <p>
          Контакты:{" "}
          <a href={CONTACTS.phoneHref} className="text-accent hover:underline">
            {CONTACTS.phoneDisplay}
          </a>
          , режим работы — {CONTACTS.hours}.
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
