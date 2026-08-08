# Make Content Factory

Полная архитектура автопостинга видео в **Instagram · VK · YouTube · TikTok** на Make.com.

## Быстрый старт

1. Откройте [`index.html`](./index.html) — интерактивный веб-процесс  
2. Пройдите [`CHECKLIST.md`](./CHECKLIST.md)  
3. Импортируйте CSV [`sheets/content-plan.csv`](./sheets/content-plan.csv) в Google Sheets  
4. В Make: **Import Blueprint** из [`blueprints/`](./blueprints/)  
5. Подключите Connections / Variables и прогоните 1 тестовый ролик  

## Состав

| Файл | Назначение |
|---|---|
| `index.html` | Веб-схема процесса + интерактивный чеклист |
| `ARCHITECTURE.md` | Карта сценариев, переменные, ошибки |
| `CHECKLIST.md` | Что нужно: аккаунты, API, спеки медиа |
| `blueprints/01-publisher-core.json` | Автопостинг из Sheets |
| `blueprints/02-ig-comment-leadmagnet.json` | Коммент → DM |
| `blueprints/03-analytics-daily.json` | Ежедневная аналитика |
| `blueprints/04-tiktok-token-refresh.json` | Refresh TikTok token |
| `sheets/content-plan.csv` | Шаблон контент-плана |

## Порядок включения сценариев

```
CF-04 Token Refresh  →  CF-01 Publisher  →  CF-02 Lead Magnet  →  CF-03 Analytics
```

## Важно

Blueprint’ы — **каркас**. После импорта:
- переподключите модули (версии YouTube/Sheets могут отличаться);
- для Instagram добавьте polling статуса container до `FINISHED`;
- TikTok без App Audit публикует только private.
