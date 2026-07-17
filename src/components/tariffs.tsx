"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { ContactButtons } from "@/components/contact-buttons";
import { FORMS } from "@/lib/constants";

const TARIFFS = [
  {
    key: "self",
    image: "/images/tariff-selfemployed.jpg",
    imageAlt: "Водитель с телефоном в салоне автомобиля",
    eyebrow: "Комиссия парка",
    title: "Парковый самозанятый",
    price: "1,9%",
    text: "Самый простой и удобный вариант для большинства водителей. Минимальная комиссия парка, быстрая регистрация и подключение к Яндекс Такси.",
    cta: "Авторегистрация (самозанятый)",
    href: FORMS.selfEmployed,
    iframe: FORMS.selfEmployedIframe,
    iframeTitle: "Форма авторегистрации самозанятого",
    featured: false,
  },
  {
    key: "ip",
    image: "/images/tariff-ip.jpg",
    imageAlt: "Документы и ключи автомобиля для оформления ИП",
    eyebrow: "Комиссия парка",
    title: "Парковый ИП",
    price: "1,9%",
    text: "Подходит водителям, которые хотят работать как ИП, но в структуре парка. Низкая комиссия и моментальный вывод средств.",
    cta: "Авторегистрация (ИП)",
    href: FORMS.ip,
    iframe: FORMS.ipIframe,
    iframeTitle: "Форма авторегистрации ИП",
    featured: true,
    badge: "Моментальный вывод",
  },
  {
    key: "labor",
    image: "/images/tariff-labor.jpg",
    imageAlt: "Официальное оформление по трудовому договору",
    eyebrow: "По ТК РФ",
    title: "Трудовой договор",
    price: "3 варианта",
    text: "Для водителей, которым важно официальное трудоустройство по ТК РФ: стабильность, пособия, больничные, защита прав.",
    cta: "Узнать подробнее",
    href: "/#labor-contract",
    iframe: null,
    iframeTitle: "",
    featured: false,
    emerald: true,
  },
] as const;

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
          {TARIFFS.map((tariff) => (
            <StaggerItem key={tariff.key}>
              <article
                className={`glass relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
                  tariff.featured ? "ring-1 ring-accent/30" : ""
                }`}
              >
                {"badge" in tariff && tariff.badge ? (
                  <span className="absolute right-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {tariff.badge}
                  </span>
                ) : null}

                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={tariff.image}
                    alt={tariff.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1724] via-transparent to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <p
                    className={`text-sm font-medium ${
                      "emerald" in tariff && tariff.emerald
                        ? "text-emerald-glow"
                        : "text-accent"
                    }`}
                  >
                    {tariff.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                    {tariff.title}
                  </h3>
                  <p
                    className={`mt-1 font-display font-bold ${
                      tariff.key === "labor"
                        ? "text-2xl text-foreground/90"
                        : "text-4xl gradient-text"
                    }`}
                  >
                    {tariff.price}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {tariff.text}
                  </p>

                  {tariff.key === "labor" ? (
                    <>
                      <Button
                        asChild
                        shine
                        className="mt-6 w-full"
                        size="lg"
                        variant="secondary"
                      >
                        <Link href={tariff.href}>{tariff.cta}</Link>
                      </Button>
                      <div className="mt-6">
                        <ContactButtons showLabels size="sm" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Button asChild shine className="mt-6 w-full" size="lg">
                        <Link
                          href={tariff.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {tariff.cta}
                          <ExternalLink className="h-4 w-4" aria-hidden />
                        </Link>
                      </Button>
                      {tariff.iframe ? (
                        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background/40">
                          <iframe
                            title={tariff.iframeTitle}
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                            src={tariff.iframe}
                            className="h-[420px] w-full max-w-full sm:h-[520px] lg:h-[560px]"
                            loading="lazy"
                          />
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
