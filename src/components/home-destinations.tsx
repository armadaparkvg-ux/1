import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Car, FileCheck2, Package, ShieldCheck } from "lucide-react";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { cn } from "@/lib/utils";

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
  },
] as const;

function PremiumCta({
  href,
  label,
  tone,
  variant,
}: {
  href: string;
  label: string;
  tone: "accent" | "emerald";
  variant: "details" | "register";
}) {
  const isEmerald = tone === "emerald";
  const isRegister = variant === "register";

  return (
    <Link
      href={href}
      className={cn(
        "btn-fgis group/cta relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-5",
        isRegister
          ? isEmerald
            ? "bg-[length:200%_200%] bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 text-[#04140f] animate-fgis-attention focus-visible:ring-emerald-glow"
            : "bg-[length:200%_200%] bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-accent-foreground animate-fgis-attention focus-visible:ring-accent"
          : isEmerald
            ? "border border-emerald-glow/50 bg-emerald-glow/15 text-emerald-glow focus-visible:ring-emerald-glow"
            : "border border-accent/50 bg-accent/15 text-accent focus-visible:ring-accent"
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine-loop"
        aria-hidden
      />
      <span className="relative z-10">{label}</span>
      <ArrowUpRight className="relative z-10 h-4 w-4 shrink-0" aria-hidden />
    </Link>
  );
}

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
                    alt=""
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
                        <PremiumCta
                          href={item.href}
                          label="Подробнее"
                          tone={item.tone}
                          variant="details"
                        />
                        <PremiumCta
                          href={item.registerHref}
                          label="Регистрация"
                          tone={item.tone}
                          variant="register"
                        />
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
