# Make Content Factory — полная архитектура

Конвейер автопостинга видео в **Instagram · VK · YouTube · TikTok** на Make.com.

## Карта сценариев

| # | Сценарий | Триггер | Роль |
|---|---|---|---|
| CF-01 | Publisher Core | Sheets Watch / каждые 15 мин | Забирает `ready` → публикует |
| CF-02 | IG Lead Magnet | Meta Webhook comments | Коммент с CTA → Private Reply |
| CF-03 | Analytics Daily | Daily 09:00 | Сбор метрик в лист Analytics |
| CF-04 | TikTok Token Refresh | Every 12h | Обновление access_token |

Опционально:
- **CF-05** VK Callback бот (аналог lead magnet)
- **CF-06** Error DLQ → Telegram + статус `error`/`partial`
- **CF-07** Boost winner (если views > порога → Ads API)

## Поток данных

```
Google Sheets (контент-план)
        │ status=ready && publish_at<=now
        ▼
   CF-01 Publisher
        ├─ Lock → queued
        ├─ Drive download / public URL
        ├─ AI captions (optional)
        ├─ status → publishing
        └─ Router
             ├─ Instagram Reels (container → wait → publish)
             ├─ VK (video.save → upload → wall.post)
             ├─ YouTube (upload private + publishAt)
             └─ TikTok (creator_info → init PULL_FROM_URL → status)
        ▼
   status=published + IDs + Telegram alert
        │
        ├─ CF-02: комментарии → лид-магнит
        └─ CF-03: ежедневная аналитика
```

## Почему не один гигантский сценарий

1. **Лимиты operations** — проще масштабировать по частям  
2. **Разные SLA** — постинг ≠ вебхуки ≠ аналитика  
3. **Ошибки** — падение TikTok не должно ронять VK  
4. **Токены** — TikTok refresh живёт отдельно  

## Переменные / Data Stores

### Scenario Variables
- `ig_user_id`, `ig_access_token`
- `vk_group_id`, `vk_access_token`
- `tt_client_key`, `tt_client_secret` (для CF-04)

### Data Store `cf_tokens`
```json
{
  "tiktok_main": {
    "access_token": "...",
    "refresh_token": "...",
    "expires_at": "..."
  }
}
```

### Data Store `cf_dedupe`
- ключ = `comment_id` / `publish_id` — защита от двойных DM и репостов

## Фильтры CF-01 (обязательно добавить)

После Watch Rows:
1. `status` = `ready`
2. `publish_at` ≤ `now`
3. `video_url` не пустой
4. (опционально) дневной лимит не превышен

## Обработка ошибок (паттерн)

На каждой publish-ветке:
```
HTTP module
  └─ onerror
       ├─ Telegram alert
       ├─ Sheets: status=partial / error_log+=platform
       └─ Break / Resume
```

После роутера — агрегирующая логика:
- все ок → `published`
- часть ок → `partial`
- ничего → `error`

## Импорт в Make

1. Scenario → ⋯ → **Import Blueprint**  
2. Выбрать JSON из `blueprints/`  
3. Reconnect connections  
4. Прописать Sheet ID / Variables  
5. Прогнать 1 тестовый bundle  

> Модули YouTube/Sheets могут отличаться версией в вашем аккаунте.  
> Если импорт ругается на `module` — замените модуль одноимённым из панели Make, маппинг полей сохраните.

## Веб-схема процесса

Откройте [`index.html`](./index.html) в браузере — интерактивная карта сценариев, чеклист и порядок запуска.
