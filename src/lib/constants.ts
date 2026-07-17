export const CONTACTS = {
  phone: "+79180521022",
  phoneDisplay: "+7 918 052-10-22",
  phoneHref: "tel:+79180521022",
  telegram: "https://t.me/park_Armada_d",
  max: "https://clck.su/SCdDA",
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

export const NAV_LINKS = [
  { href: "#tariffs", label: "Тарифы" },
  { href: "#services", label: "Доп. услуги" },
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#max-channel", label: "Канал MAX" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacts", label: "Контакты" },
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
  title:
    "Армада — подключение водителей к Яндекс Такси | Таксопарк",
  description:
    "Таксопарк «Армада»: подключение к Яндекс Такси на выгодных условиях. Парковый самозанятый, ИП и трудовой договор. Комиссия от 1,9%. Поддержка 8:00–21:00 Мск.",
  url: "https://armada-taxi.ru",
} as const;
