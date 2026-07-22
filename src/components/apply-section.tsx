"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import { ApplyButton } from "@/components/messenger-apply";
import { ContactButtons } from "@/components/contact-buttons";
import { Button } from "@/components/ui/button";
import { CONTACTS } from "@/lib/constants";

export function ApplySection() {
  return (
    <section
      id="apply"
      className="section-anchor relative py-20 sm:py-24"
      aria-labelledby="apply-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="apply-heading"
            eyebrow="Финал · Заявка"
            title="Оставить заявку: мессенджер или звонок"
            description="Без длинных анкет: Telegram, MAX или телефон. Можно сначала пройти квиз — текст с тарифом подставится сам."
          />
        </FadeIn>

        <FadeIn delay={0.08} className="mt-10">
          <div className="glass rounded-2xl p-6 text-center sm:p-8">
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Оформление удалённо по всей России. Консультация {CONTACTS.hours}.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild size="lg" shine>
                <Link href="/#quiz">Подобрать тариф в квизе</Link>
              </Button>
              <ApplyButton topic="общая заявка" size="lg" variant="outline">
                Сразу в мессенджер
              </ApplyButton>
              <Button asChild size="lg" variant="secondary">
                <a href={CONTACTS.phoneHref}>
                  <Phone className="h-4 w-4" aria-hidden />
                  {CONTACTS.phoneDisplay}
                </a>
              </Button>
            </div>
            <div className="mt-6 flex justify-center">
              <ContactButtons showLabels size="sm" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
