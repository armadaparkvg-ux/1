import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { LEGAL } from "@/lib/constants";
import {
  OFFER_EFFECTIVE_AT,
  OFFER_PDF_HREF,
  OFFER_PUBLISHED_AT,
  OFFER_TEXT,
  OFFER_TITLE,
} from "@/content/offer-text";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = pageMetadata({
  title: "Агентское соглашение (оферта) для водителей",
  description: `Публичная оферта ${LEGAL.legalName}: агентское соглашение для водителей и курьеров таксопарка. Дата размещения ${OFFER_PUBLISHED_AT}, HTML и PDF на этой странице.`,
  path: "/offer/",
  robots: { index: true, follow: true },
});

function tidyOfferPunctuation(text: string): string {
  return text
    .replace(/^(\d+(?:\.\d+)*)[.,:;]+(?:\s+)?/, (_, n: string) => `${n}. `)
    .replace(/\s+/g, " ")
    .trim();
}

function isSectionHeading(block: string): { heading: string; rest: string } | null {
  const match = block.match(/^(\d{1,2})\.\s+(.+)$/);
  if (!match) return null;
  const num = Number(match[1]);
  if (num < 1 || num > 13) return null;
  const rest = match[2];
  const words = rest.split(/\s+/);
  const titleWords: string[] = [];
  for (const word of words) {
    const letters = word.replace(/[^A-ZА-ЯЁa-zа-яё]/gi, "");
    if (!letters) {
      titleWords.push(word);
      continue;
    }
    const isUpper = letters === letters.toUpperCase() && /[А-ЯЁ]/.test(letters);
    if (isUpper) titleWords.push(word);
    else break;
  }
  const headingCore = titleWords.join(" ").trim();
  if (headingCore.length < 8) return null;
  const heading = `${num}. ${headingCore}`;
  const leftover = rest.slice(headingCore.length).trim();
  return { heading, rest: leftover };
}

function paragraphs(text: string) {
  return text
    .split(/\n+/)
    .map((p) => tidyOfferPunctuation(p))
    .filter(Boolean);
}

export default function OfferPage() {
  const blocks = paragraphs(OFFER_TEXT);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-24 sm:pb-12 sm:pt-28 sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-wide text-accent">
        Документ · ст. 435, 437 ГК РФ
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">
        {OFFER_TITLE}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {LEGAL.legalName} (ИНН {LEGAL.inn}, ОГРН {LEGAL.ogrn}) · г. Щёлково ·
        размещение {OFFER_PUBLISHED_AT} · вступление в силу {OFFER_EFFECTIVE_AT}
      </p>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface-elevated/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Полный текст оферты размещён в публичном доступе на этом сайте.
          Юридически значимый оригинал — PDF-файл.
        </p>
        <Button asChild shine size="lg" className="shrink-0">
          <a href={OFFER_PDF_HREF} download target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" aria-hidden />
            Скачать PDF
          </a>
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background">
        <iframe
          title={OFFER_TITLE}
          src={`${OFFER_PDF_HREF}#view=FitH`}
          className="h-[70vh] w-full min-h-[420px]"
        />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Постоянный адрес HTML-версии:{" "}
        <a href="https://park-armada.ru/offer/" className="text-accent hover:underline">
          https://park-armada.ru/offer/
        </a>
        . PDF:{" "}
        <a
          href={`https://park-armada.ru${OFFER_PDF_HREF}`}
          className="text-accent hover:underline"
        >
          https://park-armada.ru{OFFER_PDF_HREF}
        </a>
        . Первоначальное размещение также доступно в системе EDGVR (ссылка в тексте
        оферты). При расхождении приоритет у PDF-файла.
      </p>

      <article
        className="prose-offer mt-12 space-y-4 text-sm leading-relaxed text-muted-foreground"
        aria-label="Текст оферты"
      >
        <h2 className="font-display text-xl font-semibold text-foreground">
          Текст оферты
        </h2>
        {blocks.map((block, i) => {
          const section = isSectionHeading(block);
          if (section) {
            return (
              <div key={i} className="space-y-3">
                <h2 className="pt-4 font-display text-xl font-semibold text-foreground">
                  {section.heading}
                </h2>
                {section.rest ? <p>{section.rest}</p> : null}
              </div>
            );
          }
          return <p key={i}>{block}</p>;
        })}
      </article>

      <div className="mt-12 space-y-3 border-t border-border pt-8 text-sm text-muted-foreground">
        <p>
          Реквизиты агента: {LEGAL.legalName}, ИНН {LEGAL.inn}, КПП {LEGAL.kpp},
          ОГРН {LEGAL.ogrn}, адрес: {LEGAL.address}.
        </p>
        <p>
          Акцепт оферты совершается способами, указанными в разделе 4 документа
          (в том числе через регистрацию/подключение с использованием форм и
          сервисов, указанных в оферте). Не совершайте акцепт, если не согласны
          с условиями.
        </p>
        <p className="flex flex-wrap gap-4">
          <Link href="/privacy/" className="text-accent hover:underline">
            Политика конфиденциальности
          </Link>
          <Link href="/requisites/" className="text-accent hover:underline">
            Реквизиты
          </Link>
          <Link href="/" className="text-accent hover:underline">
            ← На главную
          </Link>
        </p>
      </div>
    </div>
  );
}
