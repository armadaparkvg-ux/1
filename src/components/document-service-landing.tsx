import Link from "next/link";
import { CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";
import { DestinationHero } from "@/components/destination-hero";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import { ApplyButton } from "@/components/messenger-apply";
import { ContactButtons } from "@/components/contact-buttons";
import { FgisCheckButton } from "@/components/fgis-check-button";
import { CONTACTS } from "@/lib/constants";

type ServiceType = "license" | "osgop";

const CONTENT = {
  license: {
    eyebrow: "Документы · ФГИС",
    title: "Лицензия такси и реестр ФГИС",
    description:
      "Поможем внести автомобиль в реестр такси для легальной работы. Оформление удалённо, оплата по факту выполненной работы.",
    price: "3 500 ₽",
    priceHint: "на 5 лет",
    icon: FileCheck2,
    points: [
      "Обычно оформление занимает 1–3 дня",
      "Нужны фото СТС с двух сторон",
      "Нужны фото автомобиля с 4 сторон",
    ],
    topic: "лицензия ФГИС" as const,
  },
  osgop: {
    eyebrow: "Документы · страхование",
    title: "ОСГОП для работы в такси",
    description:
      "Оформляем обязательное страхование ОСГОП. Подскажем по документам и ведём оформление через парк «Армада».",
    price: "3 400 ₽",
    priceHint: "на 1 год",
    icon: ShieldCheck,
    points: [
      "Страхование для легальной работы в такси",
      "Консультация по документам перед оформлением",
      "Поддержка в Telegram, MAX и по телефону",
    ],
    topic: "ОСГОП" as const,
  },
} as const;

export function DocumentServiceLanding({ type }: { type: ServiceType }) {
  const content = CONTENT[type];
  const Icon = content.icon;

  return (
    <div className="pb-20">
      <DestinationHero
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        image="/images/legal-documents-hero.webp"
        imageAlt="Документы и автомобиль для оформления услуг таксопарка"
        primaryHref="#apply-service"
        primaryLabel="Оставить заявку"
      >
        <div className="inline-flex items-center gap-3 rounded-2xl border border-accent/25 bg-[#0b111c]/75 px-4 py-3 backdrop-blur">
          <Icon className="h-5 w-5 text-accent" aria-hidden />
          <p className="font-display text-xl font-semibold text-foreground">
            {content.price} <span className="text-sm font-medium text-muted-foreground">{content.priceHint}</span>
          </p>
        </div>
      </DestinationHero>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              eyebrow="Что входит"
              title="Понятный путь к оформлению"
              description="Соберите документы, оставьте заявку — менеджер уточнит детали и проведёт по следующим шагам."
            />
          </FadeIn>
          <FadeIn delay={0.08} className="mt-12">
            <div className="premium-card grid gap-8 rounded-3xl p-6 sm:grid-cols-[auto,1fr] sm:p-10">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent">
                <Icon className="h-7 w-7" aria-hidden />
              </span>
              <div>
                <p className="font-display text-3xl font-semibold text-foreground">{content.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">{content.priceHint}</p>
                <ul className="mt-6 space-y-3">
                  {content.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm text-foreground/90">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-glow" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="apply-service" className="section-anchor premium-grid relative overflow-hidden py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="premium-card rounded-3xl p-6 text-center sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Заявка на услугу</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
                Оформим через парк «Армада»
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Напишите в удобный чат или позвоните. Консультация {CONTACTS.hours}.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ApplyButton topic={content.topic} size="lg">
                  Оставить заявку
                </ApplyButton>
                {type === "license" ? <FgisCheckButton size="lg" /> : null}
              </div>
              <div className="mt-5 flex justify-center">
                <ContactButtons showLabels size="sm" />
              </div>
              <p className="mt-6 text-sm">
                <Link href="/taxi/" className="text-accent hover:underline">
                  ← Перейти к подключению в такси
                </Link>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
