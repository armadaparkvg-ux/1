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
  /** Классификатор авто по тарифам Яндекс Такси */
  autoClassifier:
    "https://pro.yandex.ru/ru-ru/moskva/knowledge-base/taxi/tariffs/auto-list",
  hours: "8:00–21:00 Мск, ежедневно",
} as const;

/** Баннер на главной — канал MAX */
export const PROMO = {
  text: "Подпишись на наш канал в MAX — акции и бонусы для водителей",
  ctaLabel: "Подписаться",
  href: CONTACTS.maxChannel,
  external: true,
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
  { href: "/o-parke/", label: "О парке" },
  { href: "/#directions", label: "Направления" },
  { href: "/taxi/", label: "Такси" },
  { href: "/trudovoj-dogovor/", label: "Трудовой" },
  { href: "/delivery/", label: "Доставка" },
  { href: "/license/", label: "Лицензия" },
  { href: "/osgop/", label: "ОСГОП" },
  { href: "/faq/", label: "FAQ" },
  { href: "/goroda/", label: "Города" },
  { href: "/#max-channel", label: "Акции" },
  { href: "/#contacts", label: "Контакты" },
] as const;

export const FOOTER_LINKS = [
  { href: "/o-parke/", label: "О парке" },
  { href: "/taxi/", label: "Подключение к Яндекс Такси" },
  { href: "/trudovoj-dogovor/", label: "Трудовой договор без СМЗ и ИП" },
  { href: "/delivery/", label: "Курьеры Яндекс Доставка" },
  { href: "/license/", label: "Лицензия такси ФГИС" },
  { href: "/osgop/", label: "ОСГОП для такси" },
  { href: "/faq/", label: "Частые вопросы (FAQ)" },
  { href: "/goroda/", label: "Подключение по городам" },
  { href: "/#max-channel", label: "Акции и бонусы в MAX" },
  { href: "/#contacts", label: "Контакты" },
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
  title: "Подключение к Яндекс Такси и Доставке — таксопарк «Армада»",
  description:
    "Такси и доставка через парк «Армада»: подключение к Яндекс Такси от 1,9%, курьер Яндекс Доставка (пеший, авто, грузовой), трудовой договор, ФГИС. Удалённо по России.",
  url: "https://park-armada.ru",
} as const;

/** Юридические реквизиты ООО «АРМАДА ДРАЙВЕР» */
export const LEGAL = {
  legalName: 'ООО «АРМАДА ДРАЙВЕР»',
  brandName: "Таксопарк «Армада»",
  inn: "5050165896",
  kpp: "505001001",
  ogrn: "1245000114369",
  address:
    "141107, Московская область, г.о. Щёлково, г. Щёлково, ул. Неделина, д. 23",
} as const;
