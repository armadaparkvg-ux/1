export const CONTACTS = {
  phone: "+79180521022",
  phoneDisplay: "+7 918 052-10-22",
  phoneHref: "tel:+79180521022",
  telegram: "https://t.me/park_Armada_d",
  /** Чат MAX для заявок и кнопок «Сообщение в MAX» (прямая ссылка, без сокращателей с рекламой) */
  max: "https://max.ru/u/f9LHodD0cOIXrCeWqjiHqb0Gibfo-Ooz0vRKNyY4KeBz6WDuQaesuUaWDT0",
  /** Канал MAX — акции и бонусы (кнопка «Подписаться») */
  maxChannel: "https://max.ru/id235208280463_biz",
  /** Проверка авто в ФГИС Такси */
  fgisCheck: "https://sicmt.ru/fgis-taksi?type=car",
  hours: "8:00–21:00 Мск, ежедневно",
} as const;

export const FORMS = {
  selfEmployed:
    "https://forms.fleet.yandex.ru/forms?ref_id=868f4c96b2524c30b062ee5a734f260b",
  selfEmployedIframe:
    "https://forms.fleet.yandex.ru/forms?ref_id=868f4c96b2524c30b062ee5a734f260b&iframe=true&lang=ru",
  ip: "https://forms.fleet.yandex.ru/forms?ref_id=6fca960aa2fb4453be59caee6828e305",
  ipIframe:
    "https://forms.fleet.yandex.ru/forms?ref_id=6fca960aa2fb4453be59caee6828e305&iframe=true&lang=ru",
} as const;

/** Absolute hash links so they work from /privacy, /offer, etc. */
export const NAV_LINKS = [
  { href: "/#tariffs", label: "Тарифы" },
  { href: "/#labor-contract", label: "Трудовой договор" },
  { href: "/#services", label: "Доп. услуги" },
  { href: "/#how-it-works", label: "Как это работает" },
  { href: "/#max-channel", label: "Канал MAX" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contacts", label: "Контакты" },
] as const;

export const FOOTER_LINKS = [
  { href: "/#tariffs", label: "Подключение к Яндекс Такси" },
  { href: "/#labor-contract", label: "Трудовой договор" },
  { href: "/#services", label: "Лицензия такси и ОСГОП" },
  { href: "/#faq", label: "Частые вопросы" },
  { href: "/#apply", label: "Оставить заявку" },
] as const;

export const LABOR_OPTIONS = [
  {
    id: "3pct",
    value: "3% + 300₽",
    title: "3% + 300₽ ежедневные списания",
    short: "3% + 300₽",
  },
  {
    id: "5pct",
    value: "5% + 100₽",
    title: "5% + 100₽ ежедневные списания",
    short: "5% + 100₽",
  },
  {
    id: "6pct",
    value: "6% без списаний",
    title: "6% без ежедневных списаний",
    short: "6% без списаний",
  },
] as const;

export const SITE = {
  name: "Армада",
  fullName: "Таксопарк «Армада»",
  domain: "park-armada.ru",
  title:
    "Подключение к Яндекс Такси — таксопарк «Армада» | Самозанятый, ИП, трудовой договор",
  description:
    "Подключение водителей к Яндекс Такси через таксопарк «Армада». Парковый самозанятый и ИП от 1,9%, трудовой договор, лицензия ФГИС, ОСГОП. Активация 1,5–2 часа. Консультация 8:00–21:00 Мск.",
  url: "https://park-armada.ru",
} as const;
