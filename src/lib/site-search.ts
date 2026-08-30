import { getSiteIndex, type SiteEntry, type SiteEntryKind } from "@/lib/site-index";

export type SiteHit = SiteEntry & { score: number };

const KIND_BOOST: Record<SiteEntryKind, number> = {
  page: 8,
  service: 10,
  city: 6,
  faq: 7,
  article: 4,
};

export function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9\s+%/.-]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function haystack(entry: SiteEntry): string {
  return normalizeQuery(
    [entry.title, entry.snippet, entry.keywords.join(" "), entry.href].join(" ")
  );
}

export function searchSite(raw: string, limit = 10): SiteHit[] {
  const query = normalizeQuery(raw);
  if (query.length < 2) return [];

  const tokens = query.split(" ").filter((token) => token.length > 1);
  if (!tokens.length) return [];

  const hits: SiteHit[] = [];

  for (const entry of getSiteIndex()) {
    const text = haystack(entry);
    let score = 0;
    const title = normalizeQuery(entry.title);

    if (title === query) score += 80;
    else if (title.includes(query)) score += 40;
    else if (text.includes(query)) score += 22;

    let tokenHits = 0;
    for (const token of tokens) {
      if (title.includes(token)) {
        score += 12;
        tokenHits += 1;
      } else if (text.includes(token)) {
        score += 6;
        tokenHits += 1;
      }
    }

    if (tokenHits === 0) continue;
    if (tokens.length > 1 && tokenHits < Math.ceil(tokens.length / 2)) continue;

    score += KIND_BOOST[entry.kind];
    hits.push({ ...entry, score });
  }

  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "ru"));
  return hits.slice(0, limit);
}

export const KIND_LABEL: Record<SiteEntryKind, string> = {
  page: "Страница",
  service: "Услуга",
  city: "Город",
  faq: "Ответ",
  article: "Статья",
};
