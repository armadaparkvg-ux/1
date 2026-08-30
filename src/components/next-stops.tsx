import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Stop = { href: string; title: string; text: string };

const STOPS: Record<string, Stop[]> = {
  taxi: [
    {
      href: "/trudovoj-dogovor/",
      title: "Трудовой договор",
      text: "Если нужен ТК без СМЗ и ИП",
    },
    {
      href: "/license/",
      title: "Лицензия ФГИС",
      text: "Выписка на авто: чат, фото, 1–3 дня",
    },
    {
      href: "/delivery/",
      title: "Яндекс Доставка",
      text: "Курьер отдельно от пассажирских заказов",
    },
  ],
  delivery: [
    {
      href: "/taxi/",
      title: "Подключение к такси",
      text: "Пассажирские заказы вместо курьерских",
    },
    {
      href: "/goroda/",
      title: "Города подключения",
      text: "Условия в вашем городе, оформление удалённо",
    },
    {
      href: "/trudovoj-dogovor/",
      title: "Трудовой договор",
      text: "Если нужен ТК без СМЗ и ИП",
    },
  ],
  license: [
    {
      href: "/taxi/",
      title: "Подключение к такси",
      text: "Формат и регистрация в парке",
    },
    {
      href: "/osgop/",
      title: "ОСГОП",
      text: "Страхование 3 400 ₽ на год",
    },
    {
      href: "/blog/proverit-avto-v-fgis/",
      title: "Проверить авто в ФГИС",
      text: "Откройте реестр до оплаты",
    },
  ],
};

export function NextStops({
  current,
}: {
  current: keyof typeof STOPS;
}) {
  const items = STOPS[current];
  return (
    <nav aria-label="Что открыть дальше" className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Дальше по сайту
        </p>
        <p className="mt-2 font-display text-xl font-semibold text-foreground sm:text-2xl">
          Следующие страницы по теме
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="premium-card group flex h-full items-start justify-between gap-3 rounded-2xl p-5 hover:border-accent/40"
              >
                <span>
                  <span className="block font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {item.text}
                  </span>
                </span>
                <ArrowUpRight
                  className="mt-1 h-4 w-4 shrink-0 text-accent"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
