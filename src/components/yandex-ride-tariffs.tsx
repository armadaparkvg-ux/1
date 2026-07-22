"use client";

import Link from "next/link";
import { Car, ExternalLink, Package, Sparkles } from "lucide-react";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { CONTACTS } from "@/lib/constants";

const YANDEX_TARIFF_GROUPS = [
  {
    key: "economy",
    icon: Car,
    title: "Эконом и Комфорт",
    subtitle: "Старт для большинства водителей на линии",
    items: ["Эконом", "Комфорт"],
    href: "/#tariffs" as string | null,
  },
  {
    key: "premium",
    icon: Sparkles,
    title: "Премиальные",
    subtitle: "Выше чек — бизнес и премиум-сегмент",
    items: ["Бизнес", "Ultima", "Premier", "Элит"],
    href: "/#tariffs" as string | null,
  },
  {
    key: "delivery",
    icon: Package,
    title: "Доставка и курьер",
    subtitle: "Пеший, авто, мото, грузовой — отдельное направление",
    items: ["Доставка", "Курьер", "Грузовой"],
    href: "/courier/" as string | null,
  },
] as const;

export function YandexRideTariffs() {
  return (
    <section
      id="yandex-tariffs"
      className="section-anchor relative py-16 sm:py-20"
      aria-labelledby="yandex-tariffs-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="yandex-tariffs-heading"
            eyebrow="Шаг 3 · Классы заказов"
            title="От Эконома до доставки и курьера"
            description="Выберите класс работы. Для такси — проверьте авто в классификаторе, затем оформите тариф парка. Для доставки — перейдите на страницу курьеров."
          />
        </FadeIn>

        <Stagger className="mt-10 grid gap-6 md:grid-cols-3" stagger={0.1}>
          {YANDEX_TARIFF_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <StaggerItem key={group.key}>
                <div className="flex h-full flex-col border-l-2 border-accent/50 pl-5">
                  <div className="flex items-center gap-2 text-accent">
                    <Icon className="h-5 w-5 shrink-0" aria-hidden />
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {group.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {group.subtitle}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-lg border border-border bg-surface-elevated/60 px-3 py-1.5 text-sm font-medium text-foreground/90"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  {group.href ? (
                    <Link
                      href={group.href}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                    >
                      {group.key === "delivery"
                        ? "К тарифам курьера →"
                        : "К оформлению в парке →"}
                    </Link>
                  ) : null}
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <FadeIn delay={0.12} className="mt-10">
          <Button
            asChild
            shine
            size="lg"
            className="mx-auto flex h-14 w-full max-w-3xl text-base shadow-glow sm:text-lg"
          >
            <Link
              href={CONTACTS.autoClassifier}
              target="_blank"
              rel="noopener noreferrer"
            >
              Классификатор авто — проверьте, к какому тарифу подходит ваш авто
              <ExternalLink className="h-5 w-5 shrink-0" aria-hidden />
            </Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Официальный список моделей Яндекс Про · затем оформите тариф ниже
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/#tariffs">Перейти к оформлению в парке</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
