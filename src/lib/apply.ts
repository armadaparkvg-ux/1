import { CONTACTS } from "@/lib/constants";
import { appendUtmBlock } from "@/lib/utm";

export type ApplyTopic =
  | "3% + 300₽"
  | "5% + 100₽"
  | "6% без списаний"
  | "самозанятый 1,9%"
  | "ИП 1,9%"
  | "лицензия ФГИС"
  | "ОСГОП"
  | "реестр перевозчиков"
  | "общая заявка"
  | "курьер доставка";

const TOPIC_DETAILS: Record<ApplyTopic, { title: string; conditions: string }> =
  {
    "3% + 300₽": {
      title: "Трудовой договор — 3% + 300₽ ежедневные списания",
      conditions:
        "Комиссия парка 3%, ежедневные списания 300₽ (налоги парк платит фиксированно). По запросу: 2НДФЛ и договор.",
    },
    "5% + 100₽": {
      title: "Трудовой договор — 5% + 100₽ ежедневные списания",
      conditions:
        "Комиссия парка 5%, ежедневные списания 100₽. Ниже фиксированная часть расходов на налоги.",
    },
    "6% без списаний": {
      title: "Трудовой договор — 6% без ежедневных списаний",
      conditions:
        "Комиссия парка 6%, без ежедневных списаний. Договор для подтверждения занятости в Яндексе и прохождения проверок.",
    },
    "самозанятый 1,9%": {
      title: "Парковый самозанятый — комиссия 1,9%",
      conditions: "Минимальная комиссия парка, быстрая регистрация в Яндекс Такси.",
    },
    "ИП 1,9%": {
      title: "Парковый ИП — комиссия 1,9%, моментальный вывод",
      conditions: "Работа как ИП в структуре парка, низкая комиссия, моментальный вывод.",
    },
    "лицензия ФГИС": {
      title: "Лицензия такси (ФГИС)",
      conditions:
        "Напишу в чат и пришлю фото авто и СТС с двух сторон. Документ 1–3 дня по региону подачи, проверка, затем оплата 3 500 ₽ на 5 лет.",
    },
    ОСГОП: {
      title: "ОСГОП (страхование)",
      conditions: "Оформление ОСГОП — 3 400 ₽ на 1 год.",
    },
    "реестр перевозчиков": {
      title: "Реестр перевозчиков",
      conditions:
        "Оформление реестра перевозчика при авто, уже внесённом парком.",
    },
    "общая заявка": {
      title: "Подключение к Яндекс Такси",
      conditions: "Нужна консультация по тарифам и оформлению в таксопарке «Армада».",
    },
    "курьер доставка": {
      title: "Курьер Яндекс Доставка",
      conditions:
        "Пеший / авто / мото / грузовой — подключение через парк «Армада».",
    },
  };

export function buildApplyMessage(topic: ApplyTopic = "общая заявка"): string {
  const details = TOPIC_DETAILS[topic] ?? TOPIC_DETAILS["общая заявка"];
  const message = [
    "Здравствуйте! Заявка с сайта park-armada.ru",
    "",
    `Тариф / услуга: ${details.title}`,
    `Условия: ${details.conditions}`,
    "",
    "Прошу связаться со мной для оформления.",
  ].join("\n");
  return appendUtmBlock(message);
}

export function telegramApplyUrl(message: string): string {
  return `${CONTACTS.telegram}?text=${encodeURIComponent(message)}`;
}

export function maxApplyUrl(): string {
  return CONTACTS.max;
}

/** Open messenger/chat without shortener interstitials; fallback if popup blocked. */
export function openMessenger(url: string): void {
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    window.location.assign(url);
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
