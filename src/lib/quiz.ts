import type { ApplyTopic } from "@/lib/apply";
import { appendUtmBlock } from "@/lib/utm";

export type QuizGoal =
  | "connect"
  | "delivery"
  | "fgis"
  | "osgop"
  | "unsure";
export type QuizFormat = "self" | "ip" | "labor" | "help";
export type QuizPriority =
  | "low_fee"
  | "instant_payout"
  | "official"
  | "docs";

export type QuizAnswers = {
  goal?: QuizGoal;
  format?: QuizFormat;
  priority?: QuizPriority;
};

export type QuizResult = {
  topic: ApplyTopic;
  title: string;
  summary: string;
  why: string[];
  /** Optional deep-link after quiz (e.g. courier landing) */
  nextHref?: string;
  nextLabel?: string;
};

export const QUIZ_GOALS: {
  id: QuizGoal;
  label: string;
  hint: string;
}[] = [
  {
    id: "connect",
    label: "Подключиться к Яндекс Такси",
    hint: "Пассажирские заказы: самозанятый, ИП или трудовой",
  },
  {
    id: "delivery",
    label: "Подключиться курьером",
    hint: "Пеший, авто, мото или грузовой — Яндекс Доставка",
  },
  {
    id: "fgis",
    label: "Лицензия ФГИС",
    hint: "Внести авто в реестр такси",
  },
  {
    id: "osgop",
    label: "Оформить ОСГОП",
    hint: "Страхование 3 400 ₽ / год",
  },
  {
    id: "unsure",
    label: "Пока не уверен",
    hint: "Подберём направление и тариф",
  },
];

export const QUIZ_FORMATS: {
  id: QuizFormat;
  label: string;
  hint: string;
}[] = [
  {
    id: "self",
    label: "Парковый самозанятый",
    hint: "Комиссия парка 1,9%",
  },
  {
    id: "ip",
    label: "Парковый ИП",
    hint: "1,9% и моментальный вывод",
  },
  {
    id: "labor",
    label: "Трудовой договор",
    hint: "Официально по ТК РФ",
  },
  {
    id: "help",
    label: "Подберите за меня",
    hint: "Учтём комиссию и документы",
  },
];

export const QUIZ_PRIORITIES: {
  id: QuizPriority;
  label: string;
  hint: string;
}[] = [
  {
    id: "low_fee",
    label: "Минимальная комиссия",
    hint: "Важно платить парку меньше",
  },
  {
    id: "instant_payout",
    label: "Моментальный вывод",
    hint: "Нужны быстрые выплаты",
  },
  {
    id: "official",
    label: "Официальное трудоустройство",
    hint: "ТК РФ, налоги платит парк",
  },
  {
    id: "docs",
    label: "2‑НДФЛ / банкротство / проверки",
    hint: "Нужен договор и подтверждение дохода",
  },
];

function laborResult(priority?: QuizPriority): QuizResult {
  if (priority === "docs") {
    return {
      topic: "3% + 300₽",
      title: "Трудовой договор — 3% + 300₽",
      summary:
        "Официально по ТК РФ: налоги платит парк, доступны 2‑НДФЛ и договор — удобно при проверках и банкротстве.",
      why: [
        "Комиссия 3% + 300₽ ежедневные списания",
        "Налоги платит парк",
        "По запросу — 2‑НДФЛ и договор",
      ],
      nextHref: "/trudovoj-dogovor/",
      nextLabel: "Страница трудового договора",
    };
  }
  if (priority === "low_fee") {
    return {
      topic: "6% без списаний",
      title: "Трудовой договор — 6% без списаний",
      summary:
        "Официальное трудоустройство без ежедневных списаний — только комиссия 6%.",
      why: [
        "Без ежедневных списаний",
        "Оформление по ТК РФ",
        "Подходит для подтверждения занятости",
      ],
      nextHref: "/trudovoj-dogovor/",
      nextLabel: "Страница трудового договора",
    };
  }
  return {
    topic: "5% + 100₽",
    title: "Трудовой договор — 5% + 100₽",
    summary:
      "Баланс официального оформления и расходов: комиссия 5% и 100₽ в сутки.",
    why: [
      "Налоги платит парк",
      "Ниже фиксированная часть, чем у 3%+300₽",
      "Три схемы на выбор — уточним в чате",
    ],
    nextHref: "/trudovoj-dogovor/",
    nextLabel: "Страница трудового договора",
  };
}

function ipResult(): QuizResult {
  return {
    topic: "ИП 1,9%",
    title: "Парковый ИП — 1,9%",
    summary:
      "Низкая комиссия парка и моментальный вывод — удобно, если нужен формат ИП.",
    why: [
      "Комиссия парка 1,9%",
      "Моментальный вывод средств",
      "Подключение удалённо, активация 1,5–2 часа",
    ],
  };
}

function selfResult(): QuizResult {
  return {
    topic: "самозанятый 1,9%",
    title: "Парковый самозанятый — 1,9%",
    summary:
      "Самый простой старт: минимальная комиссия парка и быстрая регистрация.",
    why: [
      "Комиссия парка 1,9%",
      "Быстрое подключение к Яндекс Такси",
      "Работаем удалённо по всей России",
    ],
  };
}

export function resolveQuizResult(answers: QuizAnswers): QuizResult {
  if (answers.goal === "delivery") {
    return {
      topic: "курьер доставка",
      title: "Курьер Яндекс Доставка",
      summary:
        "Пеший, авто, мото или грузовой — оформите авторегистрацию на странице курьеров или напишите в чат.",
      why: [
        "Отдельные формы авторегистрации по типам курьера",
        "Парковый самозанятый и выплаты через «Армаду»",
        "Поддержка 8:00–21:00 Мск",
      ],
      nextHref: "/delivery/",
      nextLabel: "Открыть тарифы курьеров",
    };
  }

  if (answers.goal === "fgis") {
    return {
      topic: "лицензия ФГИС",
      title: "Лицензия такси (ФГИС)",
      summary:
        "Внесём авто в реестр такси — 3 500 ₽ на 5 лет, обычно за 1–3 дня.",
      why: [
        "Оплата по факту выполненной работы",
        "Нужны фото СТС и авто с 4 сторон",
        "Оформление удалённо по всей России",
      ],
    };
  }

  if (answers.goal === "osgop") {
    return {
      topic: "ОСГОП",
      title: "ОСГОП (страхование)",
      summary:
        "Оформим ОСГОП за 3 400 ₽ на 1 год — для легальной работы в такси.",
      why: [
        "Нужно для допуска к заказам",
        "Поможем собрать документы",
        "Консультация 8:00–21:00 Мск",
      ],
    };
  }

  // Explicit format choice wins
  if (answers.format === "self") return selfResult();
  if (answers.format === "ip") return ipResult();
  if (answers.format === "labor") return laborResult(answers.priority);

  // help / unsure — use priority
  if (answers.priority === "instant_payout") return ipResult();
  if (answers.priority === "official" || answers.priority === "docs") {
    return laborResult(answers.priority);
  }
  if (answers.priority === "low_fee") return selfResult();

  return selfResult();
}

export function buildQuizApplyMessage(
  result: QuizResult,
  answers: QuizAnswers
): string {
  const goalLabel =
    QUIZ_GOALS.find((g) => g.id === answers.goal)?.label ?? "не указано";
  const formatLabel =
    QUIZ_FORMATS.find((f) => f.id === answers.format)?.label ?? "не указано";
  const priorityLabel =
    QUIZ_PRIORITIES.find((p) => p.id === answers.priority)?.label ??
    "не указано";

  const message = [
    "Здравствуйте! Заявка с квиза park-armada.ru",
    "",
    `Рекомендация: ${result.title}`,
    `Условия: ${result.summary}`,
    "",
    `Цель: ${goalLabel}`,
    `Формат: ${formatLabel}`,
    `Приоритет: ${priorityLabel}`,
    "",
    "Прошу связаться со мной для оформления.",
  ].join("\n");
  return appendUtmBlock(message);
}
