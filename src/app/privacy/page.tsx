import type { Metadata } from "next";
import Link from "next/link";
import { CONTACTS, SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = pageMetadata({
  title: "Политика конфиденциальности персональных данных",
  description: `Политика конфиденциальности ${SITE.fullName}: какие данные собираем при подключении к Яндекс Такси, зачем обрабатываем и как связаться по вопросам персональных данных.`,
  path: "/privacy/",
  robots: { index: true, follow: true },
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-24 sm:pb-12 sm:pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-foreground">
        Политика конфиденциальности
      </h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Какие данные обрабатываем
        </h2>
        <p>
          Настоящая Политика определяет порядок обработки персональных данных,
          которые вы передаёте {SITE.fullName} при обращении через сайт,
          Telegram, MAX или по телефону.
        </p>
        <p>
          Мы обрабатываем имя, номер телефона, Telegram, город, сведения об
          автомобиле и комментарий исключительно для связи с вами по вопросам
          подключения к Яндекс Такси и оказания связанных услуг.
        </p>

        <h2 className="pt-2 font-display text-xl font-semibold text-foreground">
          Как используем и передаём данные
        </h2>
        <p>
          Данные не передаются третьим лицам, за исключением случаев,
          предусмотренных законодательством РФ, и не используются для рассылок
          без вашего согласия.
        </p>

        <h2 className="pt-2 font-display text-xl font-semibold text-foreground">
          Как связаться
        </h2>
        <p>
          По вопросам обработки данных:{" "}
          <a href={CONTACTS.phoneHref} className="text-accent hover:underline">
            {CONTACTS.phoneDisplay}
          </a>
          .
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
