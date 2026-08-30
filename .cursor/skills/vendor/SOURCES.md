# Откуда взяты внешние скилы

Скачаны **30.08.2026** с GitHub, без правок текста авторов. Только первоисточники компаний и известных практиков. Случайные SEO-паки из каталогов не ставились.

| Скил | Автор | Репозиторий | Коммит | Лицензия | Зачем |
|---|---|---|---|---|---|
| `frontend-design` | Anthropic | [anthropics/skills](https://github.com/anthropics/skills) (~172k ★) | `3b3fad96af16a10759d930941b4520ba0c40edae` | Apache-2.0 | Намеренный UI, не «AI-шаблон» |
| `web-design-guidelines` | Vercel | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (~30k ★) | `063bee94c3f4df8453406c830b0a7df0f2860278` | MIT (в frontmatter) | A11y, UX, аудит интерфейса |
| `vercel-composition-patterns` | Vercel | тот же | тот же | MIT | Компоненты React |
| `vercel-react-best-practices` | Vercel Engineering | тот же | тот же | MIT | Производительность React/Next.js |
| `writing-guidelines` | Vercel | тот же | тот же | MIT (в frontmatter) | Голос, тон, микрокопирайт |
| `seo-aeo-best-practices` | Sanity | [sanity-io/agent-toolkit](https://github.com/sanity-io/agent-toolkit) | `e447ef10e09f14e245fa787d59157c7ae3576744` | MIT | Техническое SEO, EEAT, OG, JSON-LD |
| `emil-design-eng` | Emil Kowalski | [emilkowalski/skill](https://github.com/emilkowalski/skill) (~33k ★) | `d23d7f88a2e21c9e4b1418c7abe420f5c1052ba7` | MIT | Полировка, motion, детали |
| `impeccable` | Paul Bakaus | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (~63k ★) | `b0594c72d18006b5865c70eb3a97e8b04064e600` | Apache-2.0 | Критика, polish, иерархия |

Каталог: [skills.sh](https://skills.sh) (Vercel). Стандарт: [agentskills.io](https://agentskills.io).

## Что сознательно не ставили

| Источник | Почему нет |
|---|---|
| Случайные SEO-скилы с GitHub / skills.sh без вендора | Часто устаревший FAQPage, накрутка, «AI цитирование» |
| `web-artifacts-builder` (Anthropic) | Сборка Claude-артефактов, не этот Next.js-сайт |
| `deploy-to-vercel` | Хостинг — Reg.ru `/www/park-armada.ru/`, не Vercel |
| `ui-ux-pro-max` и прочие сторонние UI-паки | Не первоисточник |

## Конфликт с ТЗ park-armada.ru

На **этом** сайте главнее проектные скилы `seo-park-armada` и `site-design`.

Из Sanity `seo-aeo-best-practices` **не применять** на park-armada.ru:

- FAQPage / HowTo / QAPage / AggregateRating
- `offers` с ценой в Service
- смену canonical, sitemap, robots (кроме уже сделанного удаления `Host:`)
- выдуманные локальные цифры и email/телефон с оферты в Organization

Из `frontend-design` / `impeccable` **не применять** на существующих страницах:

- новую палитру, светлую тему, второй шрифт вместо Manrope
- аренду авто, «0%», «24/7» и прочие неподтверждённые офферы

Внешние скилы использовать для ремесла: иерархия, доступность, EEAT, чеклист мета, производительность React, микрокопирайт.
