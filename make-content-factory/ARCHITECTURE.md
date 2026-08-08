# Make Content Factory — архитектура v2

Платформа автопостинга = UI Content Factory + Google Sheets + Make scenarios CF-01…CF-07.

## Карта сценариев

| # | Сценарий | Триггер | Источник идеи |
|---|---|---|---|
| CF-01 | Publisher Core | Sheets `ready` / 15 мин | Postmypost / Buffer publish |
| CF-02 | IG Lead Magnet | Meta comments webhook | Instagram Private Reply |
| CF-03 | Analytics Daily | Daily 09:00 | Metricool / Sprout |
| CF-04 | TikTok Token Refresh | Every 12h | TikTok OAuth reality |
| CF-05 | RSS Ingest → draft | RSS new item | SMMplanner RSS |
| CF-06 | Approvals Gate | `review` + Telegram | Planable / Hootsuite |
| CF-07 | Evergreen Recycle | Daily | SocialBee categories |

## Поток

```
RSS / Bulk CSV / Manual
        ↓
   draft  →  AI Studio adapt
        ↓
   review →  CF-06 Approvals
        ↓
 approved → ready
        ↓
   Queue (best-time slots)
        ↓
   CF-01 Publisher Router
        ├─ Instagram Reels
        ├─ VK native video
        ├─ YouTube + publishAt
        └─ TikTok Direct Post
        ↓
   published IDs
        ├─ CF-02 Comment → DM
        ├─ CF-03 Analytics
        └─ CF-07 Recycle winners
```

## UI модули платформы (`index.html`)

| View | Аналог рынка | Функция |
|---|---|---|
| Calendar | Later | Недельная сетка + 9:16 preview |
| Queue | Buffer | Слоты peak_* + UTM + publish |
| AI Studio | Buffer / Postmypost | Per-platform captions |
| Approvals | Planable | Approve / Reject |
| Analytics | Metricool | KPI + recycle signals |
| Media | Later | Drive library + codec checks |
| Integrations | Postmypost API | Список CF blueprints |

## Статусы

`idea → draft → review → approved → ready → queued → publishing → published|partial|error`  
`published → ready` (через CF-07 recycle)

## Переменные / Data Stores

- Variables: `ig_user_id`, `ig_access_token`, `vk_group_id`, `vk_access_token`, `tt_client_key`, `tt_client_secret`
- Data Store `cf_tokens`: TikTok access/refresh
- Data Store `cf_dedupe`: comment_id / publish_id

## Импорт

1. Открыть `index.html` → «Запустить платформу»  
2. Импорт `sheets/content-plan.csv`  
3. Make → Import Blueprint `blueprints/0*.json`  
4. Порядок ON: CF-04 → CF-06 → CF-01 → CF-02 → CF-05 → CF-07 → CF-03  
