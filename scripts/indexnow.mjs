/**
 * Сообщает Яндексу и Bing/IndexNow об URL сайта.
 * Запускать ПОСЛЕ заливки статики на park-armada.ru:
 *   node scripts/indexnow.mjs
 *
 * Не падает сборка: сеть и 202 Accepted — нормальный ответ при новой проверке ключа.
 * @see https://yandex.ru/support/webmaster/ru/indexnow/reference
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://park-armada.ru";
const INDEXNOW_KEY = "armadaidx7Kq2Nm9Px4Rt8Wv";
const ENDPOINTS = [
  "https://yandex.com/indexnow",
  "https://api.indexnow.org/indexnow",
];

function urlsFromSitemap() {
  const sitemapPath = path.join(root, "out/sitemap.xml");
  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, "utf8");
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  }
  return [
    `${SITE}/`,
    `${SITE}/taxi/`,
    `${SITE}/trudovoj-dogovor/`,
    `${SITE}/delivery/`,
    `${SITE}/license/`,
    `${SITE}/osgop/`,
    `${SITE}/faq/`,
    `${SITE}/blog/`,
    `${SITE}/goroda/`,
    `${SITE}/o-parke/`,
    `${SITE}/llms.txt`,
    `${SITE}/feed.xml`,
  ];
}

const urlList = [...new Set(urlsFromSitemap())].filter(
  (url) => !url.includes("/go/")
);

const body = JSON.stringify({
  host: "park-armada.ru",
  key: INDEXNOW_KEY,
  keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
  urlList,
});

let failed = false;
for (const endpoint of ENDPOINTS) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
    });
    const text = await response.text();
    console.log(`${endpoint} → ${response.status} ${text.slice(0, 200)}`);
    if (response.status >= 400) failed = true;
  } catch (error) {
    failed = true;
    console.warn(`${endpoint} failed:`, error instanceof Error ? error.message : error);
  }
}

console.log(`Sent ${urlList.length} URLs`);
if (failed) process.exitCode = 1;
