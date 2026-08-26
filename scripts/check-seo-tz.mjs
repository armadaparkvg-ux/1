#!/usr/bin/env node
/**
 * Локальная проверка критериев ТЗ SEO (блоки A–D).
 * Запуск после `npm run build:static`: node scripts/check-seo-tz.mjs
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "out");

function walkHtml(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkHtml(full, acc);
    else if (name === "index.html") acc.push(full);
  }
  return acc;
}

function fail(msg) {
  console.error("FAIL:", msg);
  process.exitCode = 1;
}

if (!fs.existsSync(OUT)) {
  fail("Нет каталога out/. Сначала npm run build:static");
  process.exit(1);
}

const pages = walkHtml(OUT);
console.log("HTML pages:", pages.length);

let langOk = 0;
const longTitles = [];
const doubleBrand = [];
const missingOgImage = [];
const missingOgType = [];
const faqPage = [];
const howTo = [];

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(OUT, file);
  if (/<html[^>]*lang="ru"/.test(html)) langOk += 1;
  else fail(`${rel}: нет lang="ru"`);

  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";
  if (title.length > 60) longTitles.push(`${rel} (${title.length}) ${title}`);
  const brandHits = (title.match(/армада/gi) || []).length;
  if (brandHits > 1) doubleBrand.push(`${rel} :: ${title}`);

  if (!/property="og:image"/i.test(html)) missingOgImage.push(rel);
  if (!/property="og:type"/i.test(html)) missingOgType.push(rel);
  if (/"@type":"FAQPage"/.test(html) || /"@type": "FAQPage"/.test(html)) {
    faqPage.push(rel);
  }
  if (/"@type":"HowTo"/.test(html) || /"@type": "HowTo"/.test(html)) {
    howTo.push(rel);
  }
}

if (langOk !== pages.length) fail(`lang=ru: ${langOk}/${pages.length}`);
if (longTitles.length) fail("title > 60:\n  " + longTitles.join("\n  "));
if (doubleBrand.length) fail("Армада дважды:\n  " + doubleBrand.join("\n  "));
if (missingOgImage.length) fail("нет og:image:\n  " + missingOgImage.join("\n  "));
if (missingOgType.length) fail("нет og:type:\n  " + missingOgType.join("\n  "));
if (faqPage.length) fail("FAQPage JSON-LD:\n  " + faqPage.join("\n  "));
if (howTo.length) fail("HowTo JSON-LD:\n  " + howTo.join("\n  "));

const robots = fs.readFileSync(path.join(OUT, "robots.txt"), "utf8");
if (/^Host:/m.test(robots)) fail("robots.txt содержит Host:");

const htaccess = fs.readFileSync(path.join(OUT, ".htaccess"), "utf8");
if (!/yandex-taxi-psmz/.test(htaccess)) fail(".htaccess без 301 на /yandex-taxi-psmz/");

const goroda = fs.readFileSync(path.join(OUT, "goroda/index.html"), "utf8");
if (/Краснодарский край<\/a>/.test(goroda)) {
  fail("хаб /goroda/: регион всё ещё в анкоре ссылки");
}

const home = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
if (!/"@type":"Organization"/.test(home) && !/"@type": "Organization"/.test(home)) {
  fail("на главной нет Organization JSON-LD");
}

const articleHtml = fs.readFileSync(
  path.join(OUT, "blog/kak-podklyuchitsya-k-yandex-taxi/index.html"),
  "utf8"
);
if (!/property="og:type" content="article"/.test(articleHtml)) {
  fail("статья блога без og:type=article");
}
if (!/"@type":"Article"/.test(articleHtml) && !/"@type": "Article"/.test(articleHtml)) {
  fail("статья блога без Article JSON-LD");
}

const cityHtml = fs.readFileSync(path.join(OUT, "goroda/moskva/index.html"), "utf8");
if (!/УТОЧНИТЬ У ВЛАДЕЛЬЦА: число водителей парка в Москва/.test(cityHtml)) {
  fail("городская страница без HTML-заглушки C-2");
}
if (/"@type":"FAQPage"/.test(cityHtml) || /"@type": "FAQPage"/.test(cityHtml)) {
  fail("городская страница с FAQPage");
}

console.log("lang=ru:", langOk);
console.log("titles checked:", pages.length);
if (!process.exitCode) console.log("OK: критерии A/B локально пройдены");
