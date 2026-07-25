# Метрика и SEO: посадочная /trudovoj-dogovor/

Счётчик: `110811547` · страница: https://park-armada.ru/trudovoj-dogovor/

## Уже в коде сайта

- Title / description / canonical / Open Graph
- Sitemap: `/trudovoj-dogovor/`
- JSON-LD: WebPage + BreadcrumbList + Service + FAQPage
- Ключи SEO (лимит СМЗ, без ИП, ТК, 2‑НДФЛ)
- UTM-шаблон П4 → `/trudovoj-dogovor/`
- JS-цель `click_labor_apply` при заявке по трудовому (Telegram/MAX)
- Общая `lead_messenger` при открытии мессенджера из формы заявки

## Что сделать в кабинете Метрики (обязательно)

Цели → Добавить:

| Название / идентификатор | Тип | Условие |
|--------------------------|-----|---------|
| `visit_trudovoj` | Посещение страниц | URL **содержит** `/trudovoj-dogovor/` |
| `click_labor_apply` | JavaScript-событие | идентификатор `click_labor_apply` |
| `lead_messenger` | JavaScript-событие | уже должна быть; если нет — создать |

В Директе для кампании **П4_Поиск_Трудовой** в оптимизации ставьте:
`visit_trudovoj` + `click_labor_apply` (и при желании `lead_messenger` / `click_phone`).

Проверка:
1. Инкогнито → открыть `/trudovoj-dogovor/` → цель `visit_trudovoj`.
2. «Оформить через поддержку» → Telegram → цель `click_labor_apply`.

## Что сделать в Яндекс Директе (обязательно)

1. Кампания/группа **П4_Поиск_Трудовой** — ссылка объявлений:
   `https://park-armada.ru/trudovoj-dogovor/?utm_source=yandex&utm_medium=cpc&utm_campaign=p4_trudovoj&utm_content={ad_id}&utm_term={keyword}`
2. Быстрая ссылка «Трудовой договор» → тот же URL (см. `direct-sitelinks.csv`).
3. Ретаргет: добавьте сегмент «посетил `/trudovoj-dogovor/`».
4. Ключи без СМЗ/лимит НПД можно вести на эту страницу (не только на статью блога).

Файлы: `docs/utm-direct-links.csv`, `docs/direct-sitelinks.csv`, `docs/yandex-direct-keywords.csv`, `docs/direct-landing-replace.csv`.

## Что сделать в Вебмастере / SEO (желательно)

1. Яндекс.Вебмастер → Переобход → URL `https://park-armada.ru/trudovoj-dogovor/`
2. Проверить `https://park-armada.ru/sitemap.xml` (страница должна быть в списке)
3. После деплоя hosting-v45+ — убедиться, что страница открывается без 404

Новых правок в коде Метрики-тега не нужно: счётчик уже на всём сайте.
