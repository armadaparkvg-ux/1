# video-publisher

Python-модуль автоматической мультиплатформенной публикации видео таксопарка  
(акции, турниры водителей, промо-ролики) на **VK**, **YouTube Shorts**, **Instagram Reels**, **TikTok**.

Единый CLI/сервис принимает видеофайл + метаданные и публикует на все подключённые площадки через официальные API.

## Возможности

- Единый конфиг через `.env` (секреты не хардкодятся)
- Retry с экспоненциальным backoff для сетевых сбоев и chunked upload
- SQLite-таблица статусов: `pending` / `scheduled` / `uploading` / `processing` / `published` / `failed`
- Логирование `container_id`, `publish_id`, `upload_id` на каждом шаге
- Планировщик (APScheduler / cron) для отложенных публикаций:
  - **YouTube** — нативный `publishAt`
  - **VK / TikTok / Instagram** — своя очередь в БД
- Отдельная обработка квот: YouTube `quotaExceeded`, Instagram `content_publishing_limit`, TikTok audit (`SELF_ONLY`)

## Порядок реализации платформ

1. **VK** — `video.save` → multipart `video_file` (или импорт по `link`)
2. **YouTube** — resumable upload (init → PUT чанками 5MB + `Content-Range`)
3. **Instagram / TikTok** — общая container/init + poll модель

## Установка

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
# заполните токены в .env
```

## Конфигурация

См. `.env.example`. Минимально:

| Платформа | Переменные |
|-----------|------------|
| VK | `VK_ACCESS_TOKEN`, `VK_GROUP_ID` |
| YouTube | `YOUTUBE_TOKEN_FILE` (OAuth refresh token) или `YOUTUBE_CLIENT_SECRETS_FILE` |
| Instagram | `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_IG_USER_ID`, `PUBLIC_VIDEO_BASE_URL` |
| TikTok | `TIKTOK_ACCESS_TOKEN` (до аудита — `TIKTOK_PRIVACY_LEVEL=SELF_ONLY`) |

> Instagram Graph API принимает только публичный HTTPS `video_url` (не локальный файл).  
> Положите ролик на CDN/S3 и укажите `--public-video-url` или `PUBLIC_VIDEO_BASE_URL`.

## CLI

```bash
# Какие платформы готовы к работе
video-publisher platforms

# Публикация сразу на все подключённые
video-publisher publish ./promo.mp4 \
  --title "Акция выходного дня" \
  --description "Скидка 20% на поездки" \
  --hashtags "такси акция промо" \
  --public-video-url "https://cdn.example.com/promo.mp4"

# Только VK и YouTube
video-publisher publish ./promo.mp4 \
  --title "Турнир водителей" \
  --platforms vk,youtube

# Отложенная публикация (VK/IG/TikTok → очередь; YouTube → publishAt)
video-publisher publish ./promo.mp4 \
  --title "Вечерний промо" \
  --publish-at "2026-08-08T20:00:00+03:00"

# Фоновый шедулер (или cron: video-publisher scheduler-once)
video-publisher scheduler

# Статусы из БД
video-publisher status
video-publisher status --status-filter failed
```

Эквивалент: `python -m video_publisher ...`

## Архитектура

```
video_publisher/
  cli.py              # Click CLI
  config.py           # pydantic-settings из .env
  models.py           # VideoMetadata, статусы, платформы
  db.py               # SQLAlchemy: publication_jobs
  retry.py            # tenacity + exponential backoff
  orchestrator.py     # параллельная/последовательная публикация
  scheduler.py        # APScheduler due-jobs
  platforms/
    base.py           # общий poll_until для container/init
    vk.py
    youtube.py
    instagram.py
    tiktok.py
  utils/
    chunked_upload.py # Content-Range PUT с retry
```

### Flows

**VK**  
`POST video.save` → `POST upload_url` (`video_file`)

**YouTube**  
`POST /upload/.../videos?uploadType=resumable` → `PUT` чанками 5MB  
Квота: ~1600 units/upload, дефолт 10000/день ≈ 6 видео

**Instagram Reels**  
`POST /{ig-user-id}/media` (REELS) → poll `status_code=FINISHED` → `POST /media_publish`  
Перед батчем: `GET /content_publishing_limit`

**TikTok**  
`POST /v2/post/publish/video/init/` → `PUT upload_url` чанками → poll `PUBLISH_COMPLETE`  
Нет нативного шедулинга — очередь в БД + APScheduler

## Тесты

```bash
pytest -q
```

Тесты используют `respx` и мокают HTTP; живые токены не нужны.

## Замечания по доступам

- **Instagram**: Business/Creator + Facebook Page; scopes `instagram_business_basic`, `instagram_business_content_publish` (App Review)
- **YouTube**: OAuth scope `youtube.upload`, API key недостаточен
- **TikTok**: до аудита приложения контент только как `SELF_ONLY`
- **VK**: токен с правом `video`, для группы — group token / `group_id`
