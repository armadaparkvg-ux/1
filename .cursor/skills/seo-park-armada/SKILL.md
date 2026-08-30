---
name: seo-park-armada
description: SEO park-armada.ru по ТЗ 26.08.2026 — title, Open Graph, JSON-LD, города, блог, robots, 301, хостинг-zip. Использовать при любых SEO, мета, schema, sitemap, сниппетах, Яндекс/Google, городских страницах, статьях блога, оферте, реквизитах, проверке live-сайта.
icon: search
color: yellow
---

# SEO park-armada.ru

Работай **строго по ТЗ**. Источник: `TZ-SEO-park-armada_1.md` (загрузка агента) и этот скил. Не «улучшай» то, что ТЗ запрещает.

Полные чеклисты: [references/acceptance.md](references/acceptance.md), запреты: [references/forbidden.md](references/forbidden.md).

Внешний профессиональный слой (Sanity): `../vendor/seo-aeo-best-practices/`. На этом сайте **этот файл главнее** — из Sanity не переносить FAQPage, HowTo, QAPage, AggregateRating, `offers` и правки canonical/sitemap/robots. Происхождение: `../vendor/SOURCES.md`.

## Стек

Next.js 14 App Router, **статический экспорт** (`STATIC_EXPORT=1`), trailing slash. Домен `https://park-armada.ru`. Метрика `110811547` — не ломать ID целей.

Ключевые файлы:

| Задача | Файл |
|---|---|
| Title / OG / canonical | `src/lib/seo-meta.ts` → только `pageMetadata()` |
| Organization / Article / Service / crumbs | `src/lib/schema.ts`, `src/components/json-ld.tsx` |
| Юрлицо, телефон, MAX | `src/lib/constants.ts` |
| Robots | `src/app/robots.ts` |
| 301 | `public/.htaccess` |
| Города | `src/lib/cities.ts`, `src/components/city-landing.tsx`, `src/app/goroda/page.tsx` |
| Статьи | `src/lib/articles.ts`, `src/lib/articles-seo.ts`, `src/lib/topics.ts` |
| Проверка | `scripts/check-seo-tz.mjs` (после `npm run build:static`) |
| Zip | `scripts/zip-hosting.sh` |

Проверяй **сырой HTML** (`curl`, Ctrl+U), не конвертер «страница → статья»: он вырезает `<script>`, `<meta>` и иногда `lang`.

## Жёсткие правила

1. **Не выдумывай факты.** Нет цифры от владельца — HTML-заглушка `<!-- {{УТОЧНИТЬ У ВЛАДЕЛЬЦА: …}} -->` и пункт в отчёте. Выдуманный заработок по городу хуже отсутствия цифр (фильтр «Малополезный контент»).
2. **Не трогай** `canonical`, `sitemap.xml`, `robots.txt` (кроме удаления `Host:`), структуру URL, `meta robots`.
3. Правки шаблона — в шаблоне, не копипаст на 45 страницах.
4. Парк **не сдаёт авто**. MAX — основной канал заявки, Telegram — запасной.
5. Регион Яндекса для сайта — **«Россия»**, не Щёлково. Десять `/goroda/*` **не получат** каждый свой регион.

## Title (A-2)

- Хвост `| Армада` — только если в title ещё нет подстроки «армада» (любой регистр).
- **Блог (`blog: true`) — хвоста никогда нет.**
- Ни один title > 60 символов. «Армада» не дважды в одном title.
- Москва: `Подключение к Яндекс Такси в Москве | Армада`
- `/o-parke/`: `О парке «Армада» — знакомство с таксопарком` (без хвоста).

Все `generateMetadata` только через `pageMetadata()` — иначе пропадёт `og:image`.

## Open Graph (A-3)

На каждой странице: `og:type`, `og:image`, `og:image:width` 1200, `og:image:height` 630, `og:locale` `ru_RU`, `og:site_name`.

- По умолчанию `/og.jpg` (файл 1200×630).
- Блог: `og:type=article` + `article:published_time`.
- Hero вместо og.jpg: `/taxi/` → `taxi-premium-hero.webp`; `/trudovoj-dogovor/` → `labor-limit-hero.jpg`; `/delivery/` → `delivery-hero-banner.jpg`.

## Разметка (B)

JSON-LD **pretty-print** (`JSON.stringify(data, null, 2)`) в `JsonLd`. Id: `jsonld-organization`, `jsonld-website`, `jsonld-page`.

| Тип | Где | Ограничения |
|---|---|---|
| Organization | все страницы, `<head>` | телефон `+7-918-052-10-22`; **без email** до решения B-0; адрес без «кв. 213»; logo `https://park-armada.ru/icon.svg` |
| WebSite | layout | `@id` `#website` |
| BreadcrumbList | блог + города (+ визуальные крошки) | у **последнего** пункта нет `item` |
| Article | 22 статьи | headline ≤110 |
| Service | только `/taxi/`, `/trudovoj-dogovor/`, `/delivery/`, `/license/` | **без `offers`** |
| Город | WebPage + BreadcrumbList | без Service / FAQ |

**Не ставить:** FAQPage, HowTo, QAPage, AggregateRating, Review, `llms.txt` «для SEO».

Визуальный FAQ на HTML оставлять. На `/faq/` нужен свой H1, не дублировать той же фразой H2.

Микродата крошек: `itemType="https://schema.org/BreadcrumbList"` в `src/components/breadcrumbs.tsx`.

## B-0 — не выбирать самому

| Поле | `/requisites/` | `/offer/` (раздел 13) |
|---|---|---|
| Телефон | **+7 918 052-10-22** | +79951705391 |
| Email | нет | Azov-avito@yandex.ru |
| Адрес | д. 23 | д. 23, кв 213 |

В Organization — телефон с реквизитов, без email. Расхождение на страницах закрывать только после решения владельца.

Юрлицо: ООО «АРМАДА ДРАЙВЕР», ИНН 5050165896, КПП 505001001, ОГРН 1245000114369, Щёлково, ул. Неделина, д. 23.

## Города (C)

- Хаб `/goroda/`: текст ссылки — **только город** (Краснодар, не «Краснодарский край»). Регион — `<span>` вне `<a>`.
- Соседи: только карта `CITY_NEIGHBORS` в `cities.ts`. Анкор — имя города.
- Казань: без «у МКД» и «Перед Универсиадами»; ориентиры Кремль/Баумана, Универсиада 2013.
- Общий блок «Условия подключения» на всех 10: гражданство РФ; трудовой только через поддержку; паспорт/права/СТС/ИНН/СНИЛС/фото с 4 сторон; ФГИС 3500 ₽ / 5 лет / 1–3 дня; ОСГОП 3400 ₽/год; 3%+300 / 5%+100 / 6%.
- После H1 первый абзац начинается с «Подключиться…» (ответ, не обзор рынка).
- C-2 цифры (водители, недельный заработок, районы) — только от владельца / Метрики 110811547.

## Блог (D)

- Сироты в «Читайте также» через `PINNED_RELATED` в `topics.ts`: `kak-podklyuchitsya-k-yandex-taxi` (≥6–8 входящих), `dokumenty-dlya-voditelya-yandex`, `pervyj-vyhod-na-liniyu`.
- Контекстные ссылки в абзацах: `RichText` + `[анкор](/blog/slug/)`. 2–4 на статью, не «здесь».
- Description каждой статьи **150–160** символов.
- Листинг `/blog/`: заголовки карточек — **H3**.
- Не доливать воду ради объёма.

## Прочее (A/E)

- `robots.txt`: удалить только `Host:`. AI-боты и Sitemap не трогать.
- `/yandex-taxi-psmz/` → 301 `/blog/parkovyj-samozanyatyj/` **до** keep-files в `.htaccess`.
- Alt у `tariff-labor.jpg` / `tariff-ip.jpg` / `tariff-selfemployed.jpg` — по смыслу картинки. `hero-bg` и пиксель Метрики — `alt=""`.
- `/license/` и `/osgop/` — разные картинки (`service-license.jpg` / `service-osgop.jpg`) и разные alt.
- Оферта: разделы 1.–13. как H2, пункты как `<p>`, без мусорной пунктуации.
- Description главной начинается с **«Удалённо по России»**, ≤160 символов.

## Хостинг

Корень Reg.ru **server54**: `/www/park-armada.ru/` (не `public_html`). После zip всегда дать GitHub raw:

`https://github.com/armadaparkvg-ux/1/raw/cursor/armada-landing-1d2d/hosting-upload/park-armada-hosting-vNN.zip`

Версию zip поднимать (`v64`, `v65`…) только если собираешь новый архив. Не копировать ТЗ Директа в `public/docs/`. Не обещать органический топ.

## После правок SEO

1. `npm run build:static && node scripts/check-seo-tz.mjs`
2. На live — `curl` всех URL из sitemap (см. acceptance).
3. validator.schema.org: 0 ошибок на `/`, статье, `/goroda/moskva/`.
4. Отчёт: сделано / заглушки / решения владельца.
