"use client";

import Link from "next/link";
import { Clock, MessageCircle, Phone, Send } from "lucide-react";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { CONTACTS } from "@/lib/constants";

export function Contacts() {
  return (
    <section
      id="contacts"
      className="section-anchor relative py-12 sm:py-20 lg:py-24"
      aria-labelledby="contacts-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="contacts-heading"
            eyebrow="Контакты"
            title="Контакты таксопарка «Армада»"
            description="Работаем удалённо по всей России. Консультации ежедневно в рабочее время."
          />
        </FadeIn>

        <FadeIn delay={0.1} className="mt-8 sm:mt-12">
          <div className="glass mx-auto max-w-3xl rounded-2xl p-6 sm:p-10">
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Phone className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Телефон</p>
                  <a
                    href={CONTACTS.phoneHref}
                    className="mt-1 font-display text-2xl font-semibold text-foreground transition-colors hover:text-accent"
                  >
                    {CONTACTS.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Clock className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Режим работы</p>
                  <p className="mt-1 text-lg font-medium text-foreground">
                    {CONTACTS.hours}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="outline" pulse className="flex-1">
                  <Link
                    href={CONTACTS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Send className="h-4 w-4" aria-hidden />
                    Написать в Telegram
                  </Link>
                </Button>
                <Button asChild size="lg" variant="emerald" pulse className="flex-1">
                  <Link
                    href={CONTACTS.max}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Сообщение в MAX
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
