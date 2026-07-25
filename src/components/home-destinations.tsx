import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Car, FileCheck2, Package, ShieldCheck } from "lucide-react";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { Button } from "@/components/ui/button";

const DESTINATIONS = [
  {
    href: "/taxi/",
    registerHref: "/taxi/#formats",
    image: "/images/taxi-premium-hero.webp",
    icon: Car,
    eyebrow: "Направление 01",
    title: "Такси",
    text: "Классы от Эконома до Элит, выбор формата работы и авторегистрация.",
    tone: "accent" as const,
    highlightCta: true,
    imageAlt: "Подключение к Яндекс Такси через парк Армада",
  },
  {
    href: "/delivery/",
    registerHref: "/delivery/#courier-tariffs",
    image: "/images/delivery-premium-hero.webp",
    icon: Package,
    eyebrow: "Направление 02",
    title: "Доставка",
    text: "Пеший, авто, мото и грузовой курьер — отдельные тарифы и формы.",
    tone: "emerald" as const,
    highlightCta: true,
    imageAlt: "Подключение курьеров к Яндекс Доставке через парк Армада",
  },
  {
    href: "/license/",
    registerHref: "/license/#apply-service",
    image: "/images/legal-documents-hero.webp",
    icon: FileCheck2,
    eyebrow: "Документы",
    title: "Лицензия ФГИС",
    text: "Реестр такси: 3 500 ₽ на 5 лет, обычно 1–3 дня.",
    tone: "accent" as const,
    highlightCta: false,
    imageAlt: "Лицензия такси ФГИС через парк Армада",
  },
  {
    href: "/osgop/",
    registerHref: "/osgop/#apply-service",
    image: "/images/legal-documents-hero.webp",
    icon: ShieldCheck,
    eyebrow: "Документы",
    title: "ОСГОП",
    text: "Страхование для легальной работы в такси — 3 400 ₽ на 1 год.",
    tone: "emerald" as const,
    highlightCta: false,
    imageAlt: "ОСГОП для такси через парк Армада",
  },
] as const;

export function HomeDestinations() {
  return (
    <section
      id="directions"
      className="section-anchor premium-grid relative overflow-hidden py-20 sm:py-24"
      aria-labelledby="directions-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeading
            id="directions-heading"
            eyebrow="Выберите направление"
            title="Всё нужное — в одном парке"
            description="Откройте направление — дальше всё по шагам: тариф → формат → авторегистрация или поддержка парка."
          />
        </FadeIn>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2" stagger={0.08}>
          {DESTINATIONS.map((item) => {
            const Icon = item.icon;
            const isEmerald = item.tone === "emerald";
            return (
              <StaggerItem key={item.href}>
                <article className="premium-card group relative flex min-h-[280px] flex-col overflow-hidden rounded-3xl p-6 sm:min-h-[320px] sm:p-8">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover opacity-55 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#080b11] via-[#080b11]/85 to-[#080b11]/25" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080b11]/85 to-transparent" />

                  <div className="relative flex h-full flex-col">
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${
                        isEmerald
                          ? "border-emerald-glow/30 bg-emerald-glow/15 text-emerald-glow"
                          : "border-accent/30 bg-accent/15 text-accent"
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p
                      className={`mt-6 text-xs font-semibold uppercase tracking-[0.14em] ${
                        isEmerald ? "text-emerald-glow" : "text-accent"
                      }`}
                    >
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {item.text}
                    </p>

                    {item.highlightCta ? (
                      <div className="mt-auto flex flex-col gap-2.5 pt-8 sm:flex-row">
                        <Button
                          asChild
                          shine
                          variant="secondary"
                          className="flex-1"
                        >
                          <Link href={item.href}>
                            Подробнее
                            <ArrowUpRight className="h-4 w-4" aria-hidden />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          shine
                          variant={isEmerald ? "emerald" : "default"}
                          className="flex-1"
                        >
                          <Link href={item.registerHref}>
                            Регистрация
                            <ArrowUpRight className="h-4 w-4" aria-hidden />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-foreground transition-transform hover:translate-x-1"
                      >
                        Подробнее и регистрация
                        <ArrowUpRight
                          className={`h-4 w-4 ${isEmerald ? "text-emerald-glow" : "text-accent"}`}
                          aria-hidden
                        />
                      </Link>
                    )}
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
