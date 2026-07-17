"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { ContactButtons } from "@/components/contact-buttons";
import { FORMS } from "@/lib/constants";

export function Tariffs() {
  return (
    <section
      id="tariffs"
      className="section-anchor relative py-20 sm:py-24"
      aria-labelledby="tariffs-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="tariffs-heading"
            eyebrow="Тарифы"
            title="Подключение к Яндекс Такси: тарифы таксопарка"
            description="Три формата работы с парком «Армада»: парковый самозанятый, парковый ИП и трудовой договор. Комиссия от 1,9% — без скрытых платежей."
          />
        </FadeIn>

        <Stagger className="mt-14 grid gap-6 lg:grid-cols-3" stagger={0.12}>
          <StaggerItem>
            <article className="glass flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8">
              <p className="text-sm font-medium text-accent">Комиссия парка</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                Парковый самозанятый
              </h3>
              <p className="mt-1 font-display text-4xl font-bold gradient-text">
                1,9%
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                Самый простой и удобный вариант для большинства водителей.
                Минимальная комиссия парка, быстрая регистрация и подключение к
                Яндекс Такси.
              </p>
              <Button asChild shine className="mt-6 w-full" size="lg">
                <Link
                  href={FORMS.selfEmployed}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Авторегистрация (самозанятый)
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background/40">
                <iframe
                  title="Форма авторегистрации самозанятого"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  src={FORMS.selfEmployedIframe}
                  className="h-[420px] w-full max-w-full sm:h-[520px] lg:h-[560px]"
                  loading="lazy"
                />
              </div>
            </article>
          </StaggerItem>

          <StaggerItem>
            <article className="glass relative flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8 ring-1 ring-accent/30">
              <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                Моментальный вывод
              </span>
              <p className="text-sm font-medium text-accent">Комиссия парка</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                Парковый ИП
              </h3>
              <p className="mt-1 font-display text-4xl font-bold gradient-text">
                1,9%
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                Подходит водителям, которые хотят работать как ИП, но в структуре
                парка. Низкая комиссия и моментальный вывод средств.
              </p>
              <Button asChild shine className="mt-6 w-full" size="lg">
                <Link href={FORMS.ip} target="_blank" rel="noopener noreferrer">
                  Авторегистрация (ИП)
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background/40">
                <iframe
                  title="Форма авторегистрации ИП"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  src={FORMS.ipIframe}
                  className="h-[420px] w-full max-w-full sm:h-[520px] lg:h-[560px]"
                  loading="lazy"
                />
              </div>
            </article>
          </StaggerItem>

          <StaggerItem>
            <article className="glass flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-8">
              <p className="text-sm font-medium text-emerald-glow">По ТК РФ</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                Трудовой договор
              </h3>
              <p className="mt-1 font-display text-2xl font-semibold text-foreground/90">
                3 варианта оформления
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                Для водителей, которым важно официальное трудоустройство по ТК РФ:
                стабильность, пособия, больничные, защита прав.
              </p>
              <Button asChild shine className="mt-6 w-full" size="lg" variant="secondary">
                <Link href="/#labor-contract">Узнать подробнее</Link>
              </Button>
              <div className="mt-6">
                <ContactButtons showLabels size="sm" />
              </div>
            </article>
          </StaggerItem>
        </Stagger>

      </div>
    </section>
  );
}
