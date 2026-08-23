/**
 * Генерирует машиночитаемые файлы для поиска и ИИ-агентов:
 * /llms.txt, /llms-full.txt, /feed.xml, ключ IndexNow.
 *
 * Запуск: node scripts/write-public-ai-files.mjs
 * Подключается в scripts/build-static.sh до next build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://park-armada.ru";
const INDEXNOW_KEY = "armadaidx7Kq2Nm9Px4Rt8Wv";

function xmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseArticles() {
  const sources = [
    fs.readFileSync(path.join(root, "src/lib/articles.ts"), "utf8"),
    fs.readFileSync(path.join(root, "src/lib/articles-seo.ts"), "utf8"),
  ].join("\n");
  const articles = [];
  const re =
    /slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*date:\s*"([^"]+)"/g;
  let match;
  while ((match = re.exec(sources))) {
    const slug = match[1];
    if (!/^[a-z0-9-]{8,}$/.test(slug)) continue;
    articles.push({
      slug,
      title: match[2],
      description: match[3],
      date: match[4],
    });
  }
  const unique = [];
  const seen = new Set();
  for (const article of articles) {
    if (seen.has(article.slug)) continue;
    seen.add(article.slug);
    unique.push(article);
  }
  return unique.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function parseCities() {
  const src = fs.readFileSync(path.join(root, "src/lib/cities.ts"), "utf8");
  const cities = [];
  const re = /slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
  let match;
  while ((match = re.exec(src))) {
    cities.push({ slug: match[1], name: match[2] });
  }
  return cities;
}

function buildLlmsTxt(articles, cities) {
  const articleLines = articles
    .slice(0, 12)
    .map(
      (article) =>
        `- [${article.title}](${SITE}/blog/${article.slug}/): ${article.description}`
    )
    .join("\n");
  const cityLines = cities
    .map(
      (city) =>
        `- [${city.name}](${SITE}/goroda/${city.slug}/): подключение к Яндекс Такси и Доставке ${city.name}`
    )
    .join("\n");

  return `# Таксопарк «Армада»
> Подключение водителей к Яндекс Такси и курьеров к Яндекс Доставке. Парковый самозанятый и ИП от 1,9%, трудовой договор, лицензия ФГИС, ОСГОП. Удалённо по России, активация обычно 10–15 минут.
Сайт ${SITE}. Юрлицо: ООО «АРМАДА ДРАЙВЕР». Телефон +7 918 052-10-22. Консультация 8:00–21:00 Мск ежедневно. Мессенджеры: Telegram и MAX.
Факты, которые нельзя путать:
- Комиссия парка и комиссия Яндекс Такси — разные платежи, они не заменяют друг друга.
- Трудовой договор оформляется только через поддержку парка, без авторегистрации.
- Самозанятый и ИП — через формы Яндекс Fleet на /taxi/.
- Больничные и оплачиваемый отпуск в оффере парка не обещаем.
- Служебные URL /go/ не для индексации.
Карта сайта: ${SITE}/sitemap.xml
RSS статей: ${SITE}/feed.xml
Расширенная карта для агентов: ${SITE}/llms-full.txt

## Посадочные
- [Главная](${SITE}/): направления такси, трудовой договор, доставка, ФГИС, ОСГОП
- [О парке](${SITE}/o-parke/): цифры парка и форматы сотрудничества
- [Подключение к Яндекс Такси](${SITE}/taxi/): самозанятый, ИП, трудовой
- [Трудовой договор](${SITE}/trudovoj-dogovor/): без СМЗ и ИП, три тарифа
- [Курьер Яндекс Доставка](${SITE}/delivery/): пеший, авто, мото, грузовой
- [Лицензия ФГИС](${SITE}/license/): 3 500 ₽ на 5 лет
- [ОСГОП](${SITE}/osgop/): 3 400 ₽ на 1 год
- [FAQ](${SITE}/faq/): частые вопросы
- [Города](${SITE}/goroda/): гео-кластер подключения по России
- [Блог](${SITE}/blog/): гайды по такси и доставке

## Статьи (приоритетные)
${articleLines}

## Города
${cityLines}

## Optional
- [Политика конфиденциальности](${SITE}/privacy/)
- [Оферта](${SITE}/offer/)
- [Реквизиты](${SITE}/requisites/)
`;
}

function buildLlmsFullTxt(articles, cities) {
  const articleLines = articles
    .map(
      (article) =>
        `- [${article.title}](${SITE}/blog/${article.slug}/) (${article.date}): ${article.description}`
    )
    .join("\n");
  const cityLines = cities
    .map((city) => `- [${city.name}](${SITE}/goroda/${city.slug}/)`)
    .join("\n");

  return `# Таксопарк «Армада» — полная карта
> Расширенный индекс для ИИ-агентов. Краткая версия: ${SITE}/llms.txt
Сайт ${SITE}. Юрлицо: ООО «АРМАДА ДРАЙВЕР». Телефон +7 918 052-10-22.
Карта сайта: ${SITE}/sitemap.xml
RSS: ${SITE}/feed.xml

## Посадочные
- [Главная](${SITE}/)
- [О парке](${SITE}/o-parke/)
- [Такси](${SITE}/taxi/)
- [Трудовой договор](${SITE}/trudovoj-dogovor/)
- [Доставка](${SITE}/delivery/)
- [Лицензия ФГИС](${SITE}/license/)
- [ОСГОП](${SITE}/osgop/)
- [FAQ](${SITE}/faq/)
- [Города](${SITE}/goroda/)
- [Блог](${SITE}/blog/)

## Все статьи
${articleLines}

## Все города
${cityLines}

## Optional
- [Политика](${SITE}/privacy/)
- [Оферта](${SITE}/offer/)
- [Реквизиты](${SITE}/requisites/)
`;
}

function buildRss(articles) {
  const items = articles
    .map((article) => {
      const url = `${SITE}/blog/${article.slug}/`;
      return `    <item>
      <title>${xmlEscape(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${article.date}T09:00:00+03:00`).toUTCString()}</pubDate>
      <description>${xmlEscape(article.description)}</description>
    </item>`;
    })
    .join("\n");
  const lastBuild = new Date(`${articles[0].date}T09:00:00+03:00`).toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Таксопарк «Армада» — статьи</title>
    <link>${SITE}/blog/</link>
    <description>Гайды по подключению к Яндекс Такси и Доставке: парк, комиссия, трудовой договор, ФГИС, курьеры.</description>
    <language>ru</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

const articles = parseArticles();
const cities = parseCities();
if (articles.length < 20) {
  throw new Error(`Expected at least 20 articles, got ${articles.length}`);
}

const publicDir = path.join(root, "public");
fs.writeFileSync(path.join(publicDir, "llms.txt"), buildLlmsTxt(articles, cities));
fs.writeFileSync(
  path.join(publicDir, "llms-full.txt"),
  buildLlmsFullTxt(articles, cities)
);
fs.writeFileSync(path.join(publicDir, "feed.xml"), buildRss(articles));
fs.writeFileSync(path.join(publicDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);

console.log(
  `Wrote llms.txt, llms-full.txt, feed.xml, ${INDEXNOW_KEY}.txt (${articles.length} articles, ${cities.length} cities)`
);
