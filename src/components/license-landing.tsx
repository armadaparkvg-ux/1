import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  Clock,
  FileSearch,
  MessageCircle,
  Wallet,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DestinationHero } from "@/components/destination-hero";
import { FadeIn, SectionHeading } from "@/components/fade-in";
import { FgisCheckButton } from "@/components/fgis-check-button";
import { DualPathActions } from "@/components/funnel-actions";
import { CONTACTS } from "@/lib/constants";

const PROCESS = [
  {
    n: "1",
    title: "Написать в чат",
    text: "Откройте MAX или Telegram и напишите, что нужна лицензия такси ФГИС — выписка на автомобиль. Текст заявки с сайта подставится сам.",
    icon: MessageCircle,
  },
  {
    n: "2",
    title: "Прислать фото авто и СТС с двух сторон",
    text: "В чат — фото автомобиля и свидетельство о регистрации с лицевой и оборотной стороны. Номер и данные должны читаться, без сильных бликов и обрезанных краёв.",
    icon: Camera,
  },
  {
    n: "3",
    title: "Дождаться готовый документ",
    text: "Срок — от 1 до 3 дней в зависимости от региона подачи. Менеджер напишет, когда выписка готова. Реже срок длиннее: предупредим заранее.",
    icon: Clock,
  },
  {
    n: "4",
    title: "Проверить документ",
    text: "Сверьте госномер и данные авто с реестром ФГИС Такси. Не оплачивайте, пока запись не совпадает с машиной.",
    icon: FileSearch,
  },
  {
    n: "5",
    title: "Оплатить услугу 3 500 ₽",
    text: "После проверки — 3 500 ₽ за внесение на 5 лет. Ежемесячных платежей за выписку нет. Скрытой платы за «вход» в парк нет.",
    icon: Wallet,
  },
] as const;

export function LicenseLanding() {
  return (
    <div>
      <DestinationHero
        eyebrow="ФГИС · удалённо по России"
        title="Лицензия такси ФГИС: оформить выписку на авто"
        description="Оформить лицензию такси ФГИС через парк «Армада» можно удалённо: напишите в чат, пришлите фото автомобиля и СТС с двух сторон, дождитесь готового документа от 1 до 3 дней в зависимости от региона подачи, проверьте запись и оплатите 3 500 ₽."
        image="/images/service-license.jpg"
        imageAlt="СТС и автомобиль: документы для внесения машины в реестр такси ФГИС"
        primaryHref="#oformlenie"
        primaryLabel="Смотреть процесс"
        secondaryHref="#apply-service"
        secondaryLabel="Написать в чат"
      >
        <div className="inline-flex items-center gap-3 rounded-2xl border border-accent/25 bg-[#0b111c]/75 px-4 py-3 backdrop-blur">
          <p className="font-display text-xl font-semibold text-foreground">
            3 500 ₽{" "}
            <span className="text-sm font-medium text-muted-foreground">
              на 5 лет · оплата после проверки
            </span>
          </p>
        </div>
      </DestinationHero>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: "Главная", href: "/" },
            { name: "Лицензия такси ФГИС" },
          ]}
        />
      </div>

      <section
        id="oformlenie"
        className="section-anchor py-10 sm:py-16 lg:py-20"
        aria-labelledby="license-process-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeading
              id="license-process-heading"
              eyebrow="Процесс"
              title="Как проходит оформление лицензии такси"
              description="Пять шагов по порядку. Не начинайте со оплаты: сначала чат, фото, выписка и проверка."
            />
          </FadeIn>

          <ol className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 xl:grid-cols-5 xl:gap-5">
            {PROCESS.map((step) => {
              const Icon = step.icon;
              return (
                <li key={step.n} className="premium-card flex flex-col rounded-2xl p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 font-display text-sm font-semibold text-accent"
                      aria-hidden
                    >
                      {step.n}
                    </span>
                    <Icon className="h-5 w-5 text-accent" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-20" aria-labelledby="license-what-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <FadeIn>
              <SectionHeading
                id="license-what-heading"
                align="left"
                eyebrow="Что это"
                title="Выписка ФГИС — запись автомобиля в реестре такси"
                description="В быту её называют лицензией такси. Документ оформляется на машину. Статус самозанятого или ИП для этой записи не нужен."
              />
              <div className="mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
                <p>
                  Яндекс Про обычно запрашивает выписку ФГИС первым: без записи
                  автомобиля в реестре такси легальный контур не закрыт. Через
                  «Армаду» подачу ведём удалённо по России — офис не нужен.
                </p>
                <p>
                  Это не разрешение перевозчика. Разрешение на водителя делают
                  отдельно и только после готовой выписки на авто. Условия
                  реестра перевозчиков —{" "}
                  <Link href="/#services" className="text-accent hover:underline">
                    в блоке доп. услуг
                  </Link>
                  , не на этой странице.
                </p>
                <p>
                  Чеклист снимков и типичные отказы — в статье{" "}
                  <Link
                    href="/blog/licenziya-fgis-cheklist/"
                    className="text-accent hover:underline"
                  >
                    оформить лицензию такси ФГИС
                  </Link>
                  . Подключение к заказам — на{" "}
                  <Link href="/taxi/" className="text-accent hover:underline">
                    странице Яндекс Такси
                  </Link>
                  .
                </p>
              </div>
            </FadeIn>

            <FadeIn>
              <div className="premium-card rounded-3xl p-6 sm:p-8">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Какие фото нужны для ФГИС
                </h3>
                <ul className="mt-5 space-y-3">
                  {[
                    "СТС с двух сторон — серия, номер, VIN и госномер читаются",
                    "Фото автомобиля: кузов и госномер в кадре",
                    "Если есть — четыре стороны под прямым углом, без обрезанного номера",
                    "Не принимаем размытые кадры из салона и скрины чужих документов",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-foreground/90"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-glow"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm text-muted-foreground">
                  Поддержка {CONTACTS.hours}. Телефон{" "}
                  <a href={CONTACTS.phoneHref} className="text-accent hover:underline">
                    {CONTACTS.phoneDisplay}
                  </a>
                  .
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-20" aria-labelledby="license-check-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-6 sm:p-10">
            <SectionHeading
              id="license-check-heading"
              align="left"
              eyebrow="Проверка"
              title="Как проверить документ ФГИС"
              description="Готовую выписку сверяйте с госномером до оплаты. Реестр открытый: проверка занимает минуту."
            />
            <div className="mt-6 max-w-2xl space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>
                Если машина уже числится на другого перевозчика, сценарий другой,
                чем «с нуля». Сначала посмотрите реестр — инструкция в статье{" "}
                <Link
                  href="/blog/proverit-avto-v-fgis/"
                  className="text-accent hover:underline"
                >
                  как проверить авто в ФГИС Такси
                </Link>
                .
              </p>
            </div>
            <div className="mt-8">
              <FgisCheckButton size="lg" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="apply-service"
        className="section-anchor premium-grid relative overflow-hidden py-12 sm:py-20 lg:py-24"
        aria-labelledby="license-apply-heading"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="premium-card rounded-3xl p-6 text-center sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                Заявка
              </p>
              <h2
                id="license-apply-heading"
                className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl"
              >
                Напишите в чат — начнём оформление
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                MAX — основной канал, Telegram — запасной. После сообщения
                пришлите фото авто и СТС с двух сторон. Оплата 3 500 ₽ — когда
                документ проверен.
              </p>
              <div className="mx-auto mt-8 max-w-md text-left">
                <DualPathActions
                  applyTopic="лицензия ФГИС"
                  applyLabel="Написать про лицензию ФГИС"
                />
              </div>
              <p className="mt-6 text-sm">
                <Link href="/taxi/" className="text-accent hover:underline">
                  Сначала подключение к Яндекс Такси
                </Link>
                {" · "}
                <Link href="/osgop/" className="text-accent hover:underline">
                  ОСГОП отдельно
                </Link>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
