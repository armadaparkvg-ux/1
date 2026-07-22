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
    title: "Эконом",
    subtitle: "Базовые тарифы для повседневных заказов",
    items: ["Эконом", "Комфорт"],
  },
  {
    key: "premium",
    icon: Sparkles,
    title: "Премиальные тарифы",
    subtitle: "Бизнес-класс и премиум-сегмент",
    items: ["Бизнес", "Ultima", "Premier", "Элит"],
  },
  {
    key: "delivery",
    icon: Package,
    title: "Доставка и грузовой",
    subtitle: "Перевозка вещей и грузов",
    items: ["Доставка", "Грузовой"],
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
            eyebrow="Тарифы Яндекс Такси"
            title="На каких тарифах можно работать"
            description="После подключения к парку «Армада» выходите на линию в доступных классах Яндекс Такси. Проверьте авто в официальном классификаторе."
          />
        </FadeIn>

        <Stagger className="mt-10 grid gap-6 md:grid-cols-3" stagger={0.1}>
          {YANDEX_TARIFF_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <StaggerItem key={group.key}>
                <div className="h-full border-l-2 border-accent/50 pl-5">
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
            className="h-14 w-full max-w-3xl mx-auto flex text-base sm:text-lg shadow-glow"
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
            Официальный список моделей Яндекс Про
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
