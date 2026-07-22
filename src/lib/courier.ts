import { CONTACTS } from "@/lib/constants";

export type CourierTariff = {
  id: "foot" | "auto" | "moto" | "cargo";
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  points: string[];
  formUrl: string | null;
  formIframe: string | null;
  cta: string;
};

/** Авторегистрация курьеров Яндекс Доставка через парк «Армада» */
export const COURIER_FORMS = {
  /** Пеший — ссылка на форму не передана; заявка через чат */
  foot: null as string | null,
  auto: "https://forms.fleet.yandex.ru/forms?ref_id=e93e6ce5f13146f59237826776d4bb99",
  moto: "https://forms.fleet.yandex.ru/forms?ref_id=b6bf266d480c4735a5a5f51a50cae478",
  cargo:
    "https://forms.fleet.yandex.ru/forms?ref_id=64925036a57f4e48941b3a25304f87da",
} as const;

function iframeOf(url: string | null): string | null {
  if (!url) return null;
  return `${url}${url.includes("?") ? "&" : "?"}iframe=true&lang=ru`;
}

export const COURIER_TARIFFS: CourierTariff[] = [
  {
    id: "foot",
    title: "Пеший курьер",
    shortTitle: "Пеший",
    eyebrow: "Парковый самозанятый",
    description:
      "Доставка пешком или на общественном транспорте. Оформление в статусе паркового самозанятого через парк «Армада».",
    points: [
      "Быстрый выход на заказы рядом с вами",
      "Официальный доход через «Мой налог»",
      "Гибкий график — слоты под ваш ритм",
    ],
    formUrl: COURIER_FORMS.foot,
    formIframe: iframeOf(COURIER_FORMS.foot),
    cta: "Написать менеджеру",
  },
  {
    id: "auto",
    title: "Автокурьер",
    shortTitle: "Авто",
    eyebrow: "На личном авто",
    description:
      "Доставка на своём легковом авто: экспресс, посылки, в том числе с опцией «Тяжёлые посылки».",
    points: [
      "Больше заказов и выше средний чек",
      "Оплата за км, сложность и спрос",
      "Авторегистрация онлайн за минуты",
    ],
    formUrl: COURIER_FORMS.auto,
    formIframe: iframeOf(COURIER_FORMS.auto),
    cta: "Авторегистрация",
  },
  {
    id: "moto",
    title: "Мотокурьер",
    shortTitle: "Мото",
    eyebrow: "На мото / скутере",
    description:
      "Быстрые городские доставки на мототехнике — меньше пробок, выше оборачиваемость заказов.",
    points: [
      "Удобно в плотном городе",
      "Оплата за время и расстояние",
      "Подключение через парк удалённо",
    ],
    formUrl: COURIER_FORMS.moto,
    formIframe: iframeOf(COURIER_FORMS.moto),
    cta: "Авторегистрация",
  },
  {
    id: "cargo",
    title: "Грузовой тариф",
    shortTitle: "Грузовой",
    eyebrow: "Водитель грузового",
    description:
      "Крупные и объёмные заказы на грузовом авто. Формат паркового самозанятого с выплатами через парк.",
    points: [
      "Заказы крупнее и дороже",
      "Приоритет паркового самозанятого (+10)",
      "Вывод на карту способом парка",
    ],
    formUrl: COURIER_FORMS.cargo,
    formIframe: iframeOf(COURIER_FORMS.cargo),
    cta: "Авторегистрация",
  },
] as const;

export const COURIER_BENEFITS = [
  {
    title: "Приоритет в выдаче",
    text: "У паркового самозанятого +10 баллов к приоритету в аккаунте — чаще получаете выгодные заказы.",
  },
  {
    title: "Официальный доход",
    text: "Справка о доходах в «Мой налог» — для кредита, ипотеки и подтверждения занятости.",
  },
  {
    title: "Выплаты через парк",
    text: "Деньги за заказы — на карту доступными в парке «Армада» способами, поддержка 8:00–21:00 Мск.",
  },
  {
    title: "Прозрачная оплата",
    text: "Доход складывается из базы заказа, км, сложности, спроса и рейтинга — всё видно в Яндекс Про.",
  },
] as const;

export const COURIER_STEPS = [
  {
    title: "Выберите формат",
    text: "Пеший, авто, мото или грузовой — под ваш транспорт и город.",
  },
  {
    title: "Авторегистрация или чат",
    text: "Заполните форму Яндекс Fleet или напишите в Telegram / MAX.",
  },
  {
    title: "Мой налог + диагностика",
    text: "Статус самозанятого, подтверждение партнёра и проверки в Яндекс Про.",
  },
  {
    title: "На линию",
    text: "Выходите на слоты и заказы Яндекс Доставки через парк «Армада».",
  },
] as const;

export const COURIER_KB = {
  hub: "https://pro.yandex.ru/ru-ru/moskva/knowledge-base/delivery",
  parkSmz:
    "https://pro.yandex.ru/ru-ru/moskva/knowledge-base/delivery-auto/partners/delivery-reg",
} as const;

export function courierFootApplyMessage(): string {
  return [
    "Здравствуйте! Заявка с сайта park-armada.ru",
    "",
    "Тариф / услуга: Пеший курьер (парковый самозанятый)",
    "Условия: Подключение к Яндекс Доставке через парк «Армада».",
    "",
    "Прошу связаться со мной для оформления.",
  ].join("\n");
}

export function courierTelegramUrl(message: string): string {
  return `${CONTACTS.telegram}?text=${encodeURIComponent(message)}`;
}
