# Приёмка SEO park-armada.ru

Проверять сырой HTML, не Markdown-конвертер.

## §6 ТЗ — обязательно

```bash
curl -s https://park-armada.ru/ | grep -c 'lang="ru"'          # → ≥1
curl -s https://park-armada.ru/robots.txt | grep -c '^Host:'  # → 0
curl -sI https://park-armada.ru/yandex-taxi-psmz/             # → 301 на /blog/parkovyj-samozanyatyj/
```

- Ни один `<title>` из sitemap (45 URL) длиннее 60 символов.
- Ни один title с «Армада» дважды.
- Статьи блога без хвоста `| Армада`.
- `og:image` и `og:type` на всех 45.
- `og.jpg` физически 1200×630.
- 3 тарифа на `/trudovoj-dogovor/` с осмысленным `alt`.
- Анкоры хаба `/goroda/` — имя города, регион вне `<a>`.
- https://validator.schema.org/ — 0 ошибок на главной, статье, городской.
- Яндекс.Вебмастер → Валидатор микроразметки: Organization и BreadcrumbList (делает владелец под своим логином).

Маркер сборки в исходнике: `id="jsonld-organization"` и `"@type": "Organization"` (с пробелом после двоеточия).

## Блоки A–E — быстрый grep

| Ожидание | Как увидеть |
|---|---|
| Москва title | `Подключение к Яндекс Такси в Москве \| Армада` |
| o-parke без хвоста | нет `\| Армада` в title |
| Блог og:type | `content="article"` + `article:published_time` |
| Taxi OG | `taxi-premium-hero.webp` |
| Labor OG | `labor-limit-hero.jpg` |
| Delivery OG | `delivery-hero-banner.jpg` |
| Нет FAQPage / HowTo | grep по всем 45 |
| Service без offers | 4 коммерческие |
| Last crumb без `item` | JSON-LD BreadcrumbList |
| Казань | нет «у МКД», нет «Перед Универсиадами» |
| C-2 заглушки | `УТОЧНИТЬ У ВЛАДЕЛЬЦА: число водителей` |
| Description статей | 150–160 |
| `/faq/` | H1 есть, H1 ≠ H2 |
| Главная description | начинается с «Удалённо по России» |

Локально: `npm run build:static && node scripts/check-seo-tz.mjs`

## Вне кода (владелец)

1. Яндекс Бизнес: организация заведена, URL сайта совпадает.
2. Вебмастер: регион **Россия**.
3. B-0: один канонический телефон и email на `/requisites/` и `/offer/`.
4. C-2: водители / недельный чек / районы по 10 городам из Метрики 110811547.
5. «Видимость в Алисе AI» в Вебмастере — метрика, не задача вёрстки.
