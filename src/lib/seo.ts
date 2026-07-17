import { CONTACTS, SITE } from "@/lib/constants";

export const SEO_KEYWORDS = [
  "подключение к яндекс такси",
  "подключить яндекс такси",
  "таксопарк яндекс такси",
  "таксопарк Армада",
  "парковый самозанятый",
  "самозанятый такси",
  "трудовой договор такси",
  "парковый ИП яндекс такси",
  "комиссия таксопарка",
  "лицензия такси ФГИС",
  "реестр перевозчиков",
  "ОСГОП такси",
  "работа в яндекс такси",
  "подключение водителя к яндекс такси",
] as const;

export const FAQ_ITEMS = [
  {
    q: "Как подключиться к Яндекс Такси через парк «Армада»?",
    a: "Выберите тариф на сайте: самозанятый или ИП — через авторегистрацию, трудовой договор — через форму заявки или связавшись с нами по телефону, в Telegram или MAX. После проверки документов активируем аккаунт в Яндекс Такси.",
  },
  {
    q: "Кто платит налоги при трудовом договоре?",
    a: "Налог платит парк. В зависимости от выбранного варианта удерживаются комиссия и ежедневные списания (300₽ или 100₽) либо только комиссия 6% без ежедневных списаний.",
  },
  {
    q: "Сколько стоит внесение авто в реестр такси (лицензия ФГИС)?",
    a: "Стоимость — 3 500 ₽ на 5 лет. Срок оформления — в среднем 1–3 дня, редко до 7 дней. Оплата по факту выполненной работы, без ежемесячных платежей.",
  },
  {
    q: "Какие документы нужны для лицензии ФГИС?",
    a: "Фото СТС (2 стороны) и фото автомобиля с 4 сторон под прямым углом.",
  },
  {
    q: "Что такое реестр перевозчиков и чем отличается от реестра ТС?",
    a: "Реестр ТС (лицензия ФГИС) — запись автомобиля в реестре такси. Реестр перевозчиков оформляется, если авто уже внесено нашим парком, и подтверждает статус перевозчика. Для него нужны справка об отсутствии судимости, договор с агрегатором и статус самозанятого или ИП.",
  },
  {
    q: "Сколько стоит ОСГОП?",
    a: "Страхование ОСГОП — 3 400 ₽ на 1 год.",
  },
  {
    q: "Как быстро активируется аккаунт после оформления?",
    a: "Обычно через 1,5–2 часа после завершения оформления.",
  },
  {
    q: "Работаете ли вы с водителями без гражданства РФ?",
    a: "Нет, обязательно гражданство РФ.",
  },
  {
    q: "Можно ли работать без лицензии и самозанятости?",
    a: "Временный допуск возможен, но легализация обязательна — поможем оформить лицензию и статус.",
  },
  {
    q: "Куда отправлять документы для оформления?",
    a: `В форму заявки на сайте или напрямую: телефон ${CONTACTS.phoneDisplay}, Telegram или MAX.`,
  },
  {
    q: "Есть ли у парка офис?",
    a: `Офиса нет — работаем удалённо. Консультация ${CONTACTS.hours}.`,
  },
  {
    q: "Подходит ли трудовой договор при банкротстве?",
    a: "Да, трудовой договор — оптимальный вариант при процедуре банкротства.",
  },
  {
    q: "Как меняется процент комиссии по трудовому договору?",
    a: "Доступны три варианта: 3% + 300₽ ежедневные списания, 5% + 100₽ ежедневные списания и 6% без ежедневных списаний. Меняется процент комиссии и схема списаний на налоги.",
  },
  {
    q: "Можно ли сменить вариант оформления?",
    a: "Да, свяжитесь с менеджером — подберём и переоформим подходящий вариант сотрудничества.",
  },
  {
    q: "Что делать, если превышен лимит по доходам самозанятого?",
    a: "Можно перейти на парковый ИП или оформить трудовой договор — особенно вариант 3% + 300₽, если не хотите открывать ИП.",
  },
] as const;

export const HOW_TO_STEPS = [
  {
    title: "Заявка",
    text: "Оставляете заявку на сайте или пишете в Telegram / MAX / по телефону.",
  },
  {
    title: "Проверка",
    text: "Менеджер проверяет документы и подбирает оптимальный формат сотрудничества.",
  },
  {
    title: "Оформление",
    text: "Регистрируем вас в парке: самозанятый, ИП или трудовой договор.",
  },
  {
    title: "Активация в Яндексе",
    text: "Подключаем аккаунт к Яндекс Такси. Обычно активация занимает 1,5–2 часа.",
  },
  {
    title: "Старт работы",
    text: "Выходите на линию и начинаете принимать заказы. Поддержка на связи ежедневно.",
  },
] as const;

export function buildJsonLd() {
  const logoUrl = `${SITE.url}/icon.svg`;
  const ogImage = `${SITE.url}/opengraph-image`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.fullName,
        alternateName: ["Армада", "Таксопарк Армада", SITE.domain],
        url: SITE.url,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
        image: ogImage,
        telephone: CONTACTS.phone,
        sameAs: [CONTACTS.telegram, CONTACTS.max],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: CONTACTS.phone,
          contactType: "customer service",
          availableLanguage: ["Russian"],
          areaServed: "RU",
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "08:00",
            closes: "21:00",
          },
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.fullName,
        description: SITE.description,
        publisher: { "@id": `${SITE.url}/#organization` },
        inLanguage: "ru-RU",
      },
      {
        "@type": "WebPage",
        "@id": `${SITE.url}/#webpage`,
        url: SITE.url,
        name: SITE.title,
        description: SITE.description,
        isPartOf: { "@id": `${SITE.url}/#website` },
        about: { "@id": `${SITE.url}/#service` },
        inLanguage: "ru-RU",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: ogImage,
        },
      },
      {
        "@type": ["TaxiService", "ProfessionalService"],
        "@id": `${SITE.url}/#service`,
        name: "Подключение водителей к Яндекс Такси",
        description:
          "Подключение к Яндекс Такси через таксопарк «Армада»: парковый самозанятый, парковый ИП и трудовой договор. Комиссия парка от 1,9%. Лицензия ФГИС, реестр перевозчиков, ОСГОП.",
        url: SITE.url,
        provider: { "@id": `${SITE.url}/#organization` },
        telephone: CONTACTS.phone,
        areaServed: {
          "@type": "Country",
          name: "Россия",
        },
        serviceType: [
          "Подключение к Яндекс Такси",
          "Парковый самозанятый",
          "Парковый ИП",
          "Трудовой договор для такси",
          "Лицензия такси ФГИС",
          "Реестр перевозчиков",
          "ОСГОП",
        ],
        offers: [
          {
            "@type": "Offer",
            name: "Парковый самозанятый",
            description:
              "Подключение к Яндекс Такси как парковый самозанятый. Комиссия парка 1,9%.",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "1.9",
              priceCurrency: "RUB",
              unitText: "PERCENT",
            },
            url: `${SITE.url}/#tariffs`,
          },
          {
            "@type": "Offer",
            name: "Парковый ИП",
            description:
              "Подключение к Яндекс Такси как парковый ИП. Комиссия 1,9%, моментальный вывод.",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "1.9",
              priceCurrency: "RUB",
              unitText: "PERCENT",
            },
            url: `${SITE.url}/#tariffs`,
          },
          {
            "@type": "Offer",
            name: "Трудовой договор",
            description:
              "Официальное трудоустройство по ТК РФ для работы в Яндекс Такси. Три варианта комиссии.",
            url: `${SITE.url}/#labor-contract`,
          },
          {
            "@type": "Offer",
            name: "Лицензия такси (ФГИС)",
            description:
              "Внесение авто в реестр такси. 3 500 ₽ на 5 лет, срок 1–3 дня.",
            price: "3500",
            priceCurrency: "RUB",
            url: `${SITE.url}/#services`,
          },
          {
            "@type": "Offer",
            name: "ОСГОП",
            description: "Страхование ОСГОП — 3 400 ₽ на 1 год.",
            price: "3400",
            priceCurrency: "RUB",
            url: `${SITE.url}/#services`,
          },
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${SITE.url}/#howto`,
        name: "Как подключиться к Яндекс Такси через таксопарк «Армада»",
        description:
          "Пять шагов: заявка, проверка документов, оформление, активация в Яндекс Такси, старт работы.",
        totalTime: "PT2H",
        step: HOW_TO_STEPS.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.text,
          url: `${SITE.url}/#how-it-works`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE.url}/#faq`,
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE.url}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Главная — подключение к Яндекс Такси",
            item: SITE.url,
          },
        ],
      },
    ],
  };
}
