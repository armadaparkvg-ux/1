import type { Metadata } from "next";
import Link from "next/link";
import { CONTACTS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: `Политика конфиденциальности ${SITE.fullName}: обработка персональных данных при подключении к Яндекс Такси.`,
  alternates: { canonical: `${SITE.url}/privacy/` },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-foreground">
        Политика конфиденциальности
      </h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
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
        <p>
          Данные не передаются третьим лицам, за исключением случаев,
          предусмотренных законодательством РФ, и не используются для рассылок
          без вашего согласия.
        </p>
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
