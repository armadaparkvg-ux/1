"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  FileText,
  IdCard,
  Phone,
  Scale,
  ShieldCheck,
  UserX,
} from "lucide-react";
import { FadeIn, SectionHeading, Stagger, StaggerItem } from "@/components/fade-in";
import { DualPathActions } from "@/components/funnel-actions";
import { LaborContract } from "@/components/labor-contract";
import { LaborLimitHeroBanner } from "@/components/labor-limit-hero-banner";
import { ContactButtons } from "@/components/contact-buttons";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CONTACTS } from "@/lib/constants";
import { fleetGoPath } from "@/lib/fleet-forms";
import { LABOR_FAQ } from "@/lib/labor-faq";
import { trackGoal } from "@/lib/metrika";

const AUDIENCE = [
  {
    icon: UserX,
    title: "Не можете работать как самозанятый",
    text: "Упёрлись в лимит дохода, слетел статус СМЗ или не хотите дальше работать через «Мой налог» — подключим через трудовой договор с парком.",
  },
  {
    icon: AlertTriangle,
    title: "Деприоритет −15 и «тип занятости не подтверждён»",
    text: "Трудовые отношения с парком подтверждаются официально. Это помогает убрать деприоритет по типу занятости в Яндекс Pro.",
  },
  {
    icon: Scale,
    title: "Ограничения по счетам, блокировки, взыскания",
    text: "Когда формат СМЗ или ИП неудобен или недоступен — трудовой договор даёт понятный легальный путь к заказам.",
  },
  {
    icon: FileText,
    title: "Не хотите открывать ИП",
    text: "Без самостоятельной беготни с регистрацией ИП, налогами и отчётностью. Налоги по трудовому договору платит парк.",
  },
  {
    icon: BadgeCheck,
    title: "Нужна понятная работа в федеральном парке",
    text: "Три прозрачных тарифа «Армады»: 3% + 300₽, 5% + 100₽ или 6% без ежедневных списаний. Без скрытых «входов» в парк.",
  },
  {
    icon: Clock3,
    title: "Нужно быстро приступить к работе",
    text: "К парку подключаем удалённо. После проверки документов аккаунт обычно активируется за 10–15 минут — можно выходить на линию.",
  },
] as const;

const DOCS = [
  {
    icon: IdCard,
    title: "Паспорт РФ",
    text: "1–2 страница и страница с регистрацией.",
  },
  {
    icon: FileText,
    title: "ИНН и СНИЛС",
    text: "Фото или скрин, в том числе из Госуслуг.",
  },
  {
    icon: BadgeCheck,
    title: "Водительское удостоверение",
    text: "Фото с двух сторон.",
  },
  {
    icon: Phone,
    title: "Номер телефона",
    text: "Тот, с которым будете работать в Яндекс Такси.",
  },
  {
    icon: ShieldCheck,
    title: "СТС на автомобиль",
    text: "Фото с двух сторон — если работаете на своём авто.",
  },
] as const;

const BENEFITS = [
  {
    title: "Официально через парк",
    text: "Трудовой договор с ООО «АРМАДА ДРАЙВЕР» — без СМЗ и без ИП.",
  },
  {
    title: "Три схемы комиссии",
    text: "3% + 300₽ · 5% + 100₽ · 6% без ежедневных списаний.",
  },
  {
    title: "2‑НДФЛ и договор",
    text: "По запросу парк предоставляет справку и сам договор.",
  },
  {
    title: "Удалённо по России",
    text: `Документы онлайн, поддержка ${CONTACTS.hours}.`,
  },
] as const;

export function LaborLanding() {
  return (
    <div>
      <section
        data-hero
        className="relative overflow-hidden border-b border-border bg-[#07090d] pt-[72px]"
      >
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            На главную
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[960px] bg-[#0a0a0a] px-0 sm:px-4">
          <div className="relative w-full">
            <LaborLimitHeroBanner />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#07090d] via-[#07090d]/40 to-transparent sm:h-14"
              aria-hidden
            />
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-3 sm:px-6 sm:pb-16 lg:px-8">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-glow">
            Таксопарк «Армада» · трудовой договор
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl lg:text-5xl">
            Работа в Яндекс Такси без самозанятости и ИП
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Превысили лимит СМЗ и не хотите открывать ИП — оформите трудовой
            договор с парком «Армада». Три тарифа, документы онлайн, поддержка по
            всей России.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button asChild shine size="lg" variant="emerald">
              <Link href="#labor-tariffs">Выбрать тариф и оформить</Link>
            </Button>
            <ul className="flex flex-wrap gap-2">
              {[
                "Без СМЗ и без ИП",
                "По ТК РФ",
                "Заявка в Telegram / MAX",
              ].map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-[#0b111c]/75 px-3 py-2 text-sm font-medium text-foreground/90"
                >
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-emerald-glow"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-10 sm:py-14 lg:py-16" aria-label="Преимущества">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
            {BENEFITS.map((item) => (
              <StaggerItem key={item.title}>
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section
        id="for-whom"
        className="section-anchor py-12 sm:py-20 lg:py-24"
        aria-labelledby="labor-audience-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="labor-audience-heading"
              eyebrow="Кому подходит"
              title="Для кого трудовой договор в «Армаде»"
              description="Если самозанятость или ИП больше не вариант — подключаем официально через парк."
            />
          </FadeIn>
          <Stagger className="mt-8 sm:mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {AUDIENCE.map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.title}>
                  <article className="h-full rounded-2xl border border-border/80 bg-[#0b111c]/40 p-6 transition-colors hover:border-emerald-glow/25">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-glow/25 bg-emerald-glow/10 text-emerald-glow">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-foreground text-balance">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
          <FadeIn delay={0.1} className="mt-10 flex justify-center">
            <DualPathActions
              applyTopic="3% + 300₽"
              applyLabel="Оставить заявку в поддержку парка"
              chats
              className="w-full max-w-md"
            />
          </FadeIn>
        </div>
      </section>

      <div id="labor-tariffs" className="section-anchor">
        <LaborContract
          eyebrow="Условия · три тарифа «Армады»"
          title="Простые условия без скрытых списаний"
          description="Выберите схему комиссии. Авторегистрации для трудового договора нет — оформление только через поддержку парка в Telegram или MAX."
        />
      </div>

      <section
        id="documents"
        className="section-anchor border-t border-border py-12 sm:py-20 lg:py-24"
        aria-labelledby="labor-docs-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="labor-docs-heading"
              eyebrow="Документы"
              title="Что нужно для подключения"
              description="Отправляете онлайн. Если всё в порядке — оформление запускаем сразу."
            />
          </FadeIn>
          <Stagger className="mt-8 sm:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {DOCS.map((doc) => {
              const Icon = doc.icon;
              return (
                <StaggerItem key={doc.title}>
                  <div className="flex h-full gap-4 rounded-2xl border border-border/70 bg-[#0b111c]/35 p-5">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-foreground">
                        {doc.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{doc.text}</p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            Важно: если по документу есть вопрос — сразу подскажем, что исправить или
            чем заменить, чтобы не терять время.
          </p>
        </div>
      </section>

      <section
        id="extras"
        className="section-anchor py-12 sm:py-20 lg:py-24"
        aria-labelledby="labor-extras-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="labor-extras-heading"
              eyebrow="Дополнительно"
              title="Лицензия и ОСГОП — если нужно под ключ"
              description="Подключение по трудовому договору отдельно; документы на авто оформляем по запросу."
            />
          </FadeIn>
          <FadeIn delay={0.08} className="mt-8 sm:mt-12 grid gap-5 sm:grid-cols-2">
            <Link
              href="/license/"
              className="group rounded-2xl border border-border/80 bg-[#0b111c]/40 p-6 transition-colors hover:border-accent/35"
            >
              <p className="text-sm font-medium text-accent">ФГИС · реестр такси</p>
              <p className="mt-2 font-display text-2xl font-semibold text-foreground">
                3 500 ₽{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  на 5 лет
                </span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Внесение автомобиля в реестр такси. Обычно 1–3 дня. Нужны фото СТС и
                авто с 4 сторон.
              </p>
              <p className="mt-4 text-sm font-medium text-foreground group-hover:text-accent">
                Подробнее о лицензии →
              </p>
            </Link>
            <Link
              href="/osgop/"
              className="group rounded-2xl border border-border/80 bg-[#0b111c]/40 p-6 transition-colors hover:border-accent/35"
            >
              <p className="text-sm font-medium text-accent">Страхование</p>
              <p className="mt-2 font-display text-2xl font-semibold text-foreground">
                3 400 ₽{" "}
                <span className="text-sm font-medium text-muted-foreground">
                  на 1 год
                </span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                ОСГОП для легальной работы в такси. Консультация по документам перед
                оформлением.
              </p>
              <p className="mt-4 text-sm font-medium text-foreground group-hover:text-accent">
                Подробнее об ОСГОП →
              </p>
            </Link>
          </FadeIn>
        </div>
      </section>

      <section
        id="faq"
        className="section-anchor border-t border-border py-12 sm:py-20 lg:py-24"
        aria-labelledby="labor-faq-heading"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="labor-faq-heading"
              eyebrow="FAQ"
              title="Ответы на вопросы о трудовом договоре"
              description="Без самозанятости и ИП: комиссия «Армады», документы, сроки и 2‑НДФЛ."
            />
          </FadeIn>
          <FadeIn delay={0.1} className="mt-10">
            <Accordion type="single" collapsible className="w-full">
              {LABOR_FAQ.map((item, i) => (
                <AccordionItem key={item.q} value={`labor-faq-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-20" aria-labelledby="labor-final-cta">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <h2
              id="labor-final-cta"
              className="font-display text-2xl font-semibold text-foreground sm:text-3xl"
            >
              Готовы оформить трудовой договор в «Армаде»?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Выберите тариф выше или напишите в чат — подскажем по документам и
              подключению. {CONTACTS.hours}. Работает{" "}
              <span className="text-foreground/90">ООО «АРМАДА ДРАЙВЕР»</span>.
            </p>
            <div className="mt-8 flex flex-col items-center gap-6">
              <Button asChild shine size="lg" className="w-full max-w-md">
                <Link
                  href={fleetGoPath("taxi", "labor")}
                  onClick={() =>
                    trackGoal("click_labor_apply", {
                      place: "footer",
                      format: "labor",
                    })
                  }
                >
                  Зарегистрироваться — трудовой договор
                </Link>
              </Button>
              <DualPathActions
                applyTopic="3% + 300₽"
                applyLabel="Оформить через поддержку парка"
                chats={false}
                className="w-full max-w-md"
              />
              <ContactButtons showLabels size="lg" />
              <p className="text-sm text-muted-foreground">
                Также смотрите{" "}
                <Link href="/taxi/" className="text-accent hover:underline">
                  все форматы на странице такси
                </Link>{" "}
                — самозанятый и ИП от 1,9%.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
