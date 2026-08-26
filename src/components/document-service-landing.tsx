import Link from "next/link";
import { CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";
import { DestinationHero } from "@/components/destination-hero";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import { DualPathActions } from "@/components/funnel-actions";
import { FgisCheckButton } from "@/components/fgis-check-button";
import { CONTACTS } from "@/lib/constants";

type ServiceType = "license" | "osgop";

const CONTENT = {
  license: {
    eyebrow: "Документы · ФГИС",
    title: "Лицензия такси и реестр ФГИС",
    description:
      "Понятный путь: что входит → заявка через поддержку парка. Оформление удалённо, оплата по факту выполненной работы.",
    price: "3 500 ₽",
    priceHint: "на 5 лет",
    icon: FileCheck2,
    heroImage: "/images/service-license.jpg",
    heroAlt:
      "СТС и автомобиль: документы для внесения машины в реестр такси ФГИС",
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
      "Понятный путь: что входит → заявка через поддержку парка. Подскажем по документам и проведём оформление.",
    price: "3 400 ₽",
    priceHint: "на 1 год",
    icon: ShieldCheck,
    heroImage: "/images/service-osgop.jpg",
    heroAlt:
      "Полис ОСГОП — страхование гражданской ответственности перевозчика в такси",
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
    <div>
      <DestinationHero
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        image={content.heroImage}
        imageAlt={content.heroAlt}
        primaryHref="#apply-service"
        primaryLabel="Перейти к заявке"
      >
        <div className="inline-flex items-center gap-3 rounded-2xl border border-accent/25 bg-[#0b111c]/75 px-4 py-3 backdrop-blur">
          <Icon className="h-5 w-5 text-accent" aria-hidden />
          <p className="font-display text-xl font-semibold text-foreground">
            {content.price}{" "}
            <span className="text-sm font-medium text-muted-foreground">
              {content.priceHint}
            </span>
          </p>
        </div>
      </DestinationHero>

      <section className="py-12 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              eyebrow="Шаг 1 · Что входит"
              title="Понятный путь к оформлению"
              description="Соберите документы, затем оставьте заявку через поддержку парка — менеджер уточнит детали."
            />
          </FadeIn>
          <FadeIn delay={0.08} className="mt-8 sm:mt-12">
            <div className="premium-card grid gap-8 rounded-3xl p-6 sm:grid-cols-[auto,1fr] sm:p-10">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent">
                <Icon className="h-7 w-7" aria-hidden />
              </span>
              <div>
                <p className="font-display text-3xl font-semibold text-foreground">
                  {content.price}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {content.priceHint}
                </p>
                <ul className="mt-6 space-y-3">
                  {content.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-3 text-sm text-foreground/90"
                    >
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-emerald-glow"
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section
        id="apply-service"
        className="section-anchor premium-grid relative overflow-hidden py-12 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="premium-card rounded-3xl p-6 text-center sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                Шаг 2 · Заявка через парк
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground">
                Оформим через поддержку «Армады»
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Оставьте заявку — текст с выбранной услугой подготовим автоматически.
                Или сразу напишите в чат / позвоните. {CONTACTS.hours}.
              </p>
              <div className="mx-auto mt-8 max-w-md text-left">
                <DualPathActions
                  applyTopic={content.topic}
                  applyLabel="Оставить заявку через поддержку"
                />
              </div>
              {type === "license" ? (
                <div className="mt-6 flex justify-center">
                  <FgisCheckButton size="lg" />
                </div>
              ) : null}
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
