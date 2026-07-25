export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  yclid?: string;
};

const STORAGE_KEY = "armada_utm_v1";
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "yclid",
] as const;

export const UTM_DIRECT = {
  source: "yandex",
  medium: "cpc",
} as const;

/** Готовые шаблоны посадочных для Яндекс Директ (подставьте в объявления). */
export const DIRECT_LANDINGS = [
  {
    campaign: "П1_Поиск_Подключение",
    path: "/taxi/#formats",
    utm_campaign: "p1_podklyuchenie",
  },
  {
    campaign: "П2_Поиск_Самозанятый",
    path: "/taxi/#formats",
    utm_campaign: "p2_samozanyatyj",
  },
  {
    campaign: "П3_Поиск_ИП",
    path: "/taxi/#formats",
    utm_campaign: "p3_ip",
  },
  {
    campaign: "П4_Поиск_Трудовой",
    path: "/taxi/#labor-contract",
    utm_campaign: "p4_trudovoj",
  },
  {
    campaign: "П5_Поиск_ФГИС",
    path: "/license/",
    utm_campaign: "p5_fgis",
  },
  {
    campaign: "П6_Поиск_Бренд",
    path: "/",
    utm_campaign: "p6_brand",
  },
  {
    campaign: "Р1_РСЯ",
    path: "/taxi/",
    utm_campaign: "r1_rsya",
  },
  {
    campaign: "Р2_Ретаргет",
    path: "/taxi/#formats",
    utm_campaign: "r2_retarget",
  },
  {
    campaign: "Доставка_Курьер",
    path: "/delivery/#courier-tariffs",
    utm_campaign: "delivery_courier",
  },
] as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readUtmFromSearch(search: string): UtmParams {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search
  );
  const utm: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) utm[key] = value;
  }
  return utm;
}

export function hasUtm(utm: UtmParams): boolean {
  return UTM_KEYS.some((key) => Boolean(utm[key]));
}

export function saveUtm(utm: UtmParams): void {
  if (!isBrowser() || !hasUtm(utm)) return;
  try {
    const prev = loadUtm();
    const next = { ...prev, ...utm };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota / private mode
  }
}

export function loadUtm(): UtmParams {
  if (!isBrowser()) return {};
  try {
    const raw =
      sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as UtmParams;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** Capture UTM from current URL and persist for the session (and local fallback). */
export function captureUtmFromLocation(): UtmParams {
  if (!isBrowser()) return {};
  const fromQuery = readUtmFromSearch(window.location.search);
  if (hasUtm(fromQuery)) {
    saveUtm(fromQuery);
    return { ...loadUtm(), ...fromQuery };
  }
  return loadUtm();
}

export function formatUtmForMessage(utm: UtmParams = loadUtm()): string {
  if (!hasUtm(utm)) return "";
  const lines = [
    "Источник рекламы (UTM):",
    utm.utm_source ? `utm_source: ${utm.utm_source}` : null,
    utm.utm_medium ? `utm_medium: ${utm.utm_medium}` : null,
    utm.utm_campaign ? `utm_campaign: ${utm.utm_campaign}` : null,
    utm.utm_content ? `utm_content: ${utm.utm_content}` : null,
    utm.utm_term ? `utm_term: ${utm.utm_term}` : null,
    utm.yclid ? `yclid: ${utm.yclid}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export function appendUtmBlock(message: string, utm?: UtmParams): string {
  const block = formatUtmForMessage(utm);
  if (!block) return message;
  return `${message}\n\n${block}`;
}

/**
 * Build a landing URL with UTM for Direct.
 * Preserves path + hash: https://site/taxi/?utm_...#formats
 */
export function buildTrackedLanding(
  pathWithHash: string,
  opts: {
    utm_campaign: string;
    utm_content?: string;
    utm_term?: string;
    baseUrl?: string;
  }
): string {
  const base = (opts.baseUrl ?? "https://park-armada.ru").replace(/\/$/, "");
  const hashIndex = pathWithHash.indexOf("#");
  const rawPath =
    hashIndex >= 0 ? pathWithHash.slice(0, hashIndex) : pathWithHash;
  const hash = hashIndex >= 0 ? pathWithHash.slice(hashIndex) : "";
  let path = rawPath.trim() || "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (path !== "/" && !path.endsWith("/")) path = `${path}/`;

  const content = opts.utm_content ?? "{ad_id}";
  const term = opts.utm_term ?? "{keyword}";
  const query =
    `utm_source=${UTM_DIRECT.source}` +
    `&utm_medium=${UTM_DIRECT.medium}` +
    `&utm_campaign=${encodeURIComponent(opts.utm_campaign)}` +
    `&utm_content=${content}` +
    `&utm_term=${term}`;
  return `${base}${path}?${query}${hash}`;
}

/** Convenience: all ready Direct URLs for copy-paste into campaigns. */
export function listDirectTrackedUrls(baseUrl = "https://park-armada.ru") {
  return DIRECT_LANDINGS.map((item) => ({
    campaign: item.campaign,
    url: buildTrackedLanding(item.path, {
      utm_campaign: item.utm_campaign,
      baseUrl,
    }),
  }));
}
