"use client";

import { FadeIn, SectionHeading } from "@/components/fade-in";
import { ApplyButton } from "@/components/messenger-apply";
import { ContactButtons } from "@/components/contact-buttons";

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
            eyebrow="Связь"
            title="Оставить заявку в мессенджере"
            description="Без анкет на сайте: выберите Telegram или MAX — текст с тарифом подставится автоматически."
          />
        </FadeIn>

        <FadeIn delay={0.08} className="mt-10">
          <div className="glass rounded-2xl p-6 text-center sm:p-8">
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Нажмите кнопку — мы предложим удобный мессенджер и подготовим
              сообщение с выбранными условиями.
            </p>
            <ApplyButton
              topic="общая заявка"
              size="lg"
              className="mt-6 w-full sm:w-auto"
            >
              Оставить заявку
            </ApplyButton>
            <div className="mt-6 flex justify-center">
              <ContactButtons showLabels size="sm" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
