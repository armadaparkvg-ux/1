# Armada Publish — личная платформа автопубликации

Веб-кабинет + CLI для автоматической публикации роликов таксопарка  
на **VK**, **YouTube Shorts**, **Instagram Reels**, **TikTok**.

## Что с этим делать (быстрый старт)

1. Установите зависимости и создайте `.env`:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -e ".[dev]"
   cp .env.example .env
   ```
2. В `.env` задайте пароль кабинета и токены площадок:
   ```env
   WEB_PASSWORD=ваш-секретный-пароль
   WEB_SECRET_KEY=длинная-случайная-строка
   WEB_BRAND_NAME=Armada Publish
   VK_ACCESS_TOKEN=...
   VK_GROUP_ID=...
   ```
3. Запустите личную платформу:
   ```bash
   video-publisher web
   ```
4. Откройте в браузере: [http://127.0.0.1:8080](http://127.0.0.1:8080)  
   Войдите с `WEB_PASSWORD` → загрузите ролик → выберите площадки → опубликуйте или отложите.

Без токенов кабинет всё равно откроется: на странице **Площадки** будет видно, что ещё не подключено.

## Возможности кабинета

- Загрузка видео drag-and-drop
- Выбор площадок, заголовок / описание / хэштеги
- Отложенная публикация (очередь + встроенный шедулер)
- Трекинг статусов: `pending` / `scheduled` / `uploading` / `published` / `failed`
- Логи `container_id`, `publish_id`, `external_id` для дебага
- Простой пароль доступа (личная платформа, не SaaS для тысяч пользователей)

## CLI (если нужен терминал / cron)

```bash
video-publisher platforms
video-publisher publish ./promo.mp4 --title "Акция" --platforms vk,youtube
video-publisher scheduler          # фоновый шедулер
video-publisher scheduler-once     # один прогон (cron)
video-publisher status
video-publisher web                # веб-кабинет
```

## Конфигурация площадок

| Платформа | Переменные |
|-----------|------------|
| VK | `VK_ACCESS_TOKEN`, `VK_GROUP_ID` |
| YouTube | `YOUTUBE_TOKEN_FILE` или `YOUTUBE_CLIENT_SECRETS_FILE` |
| Instagram | `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_IG_USER_ID`, `PUBLIC_VIDEO_BASE_URL` |
| TikTok | `TIKTOK_ACCESS_TOKEN` (до аудита: `TIKTOK_PRIVACY_LEVEL=SELF_ONLY`) |
| Кабинет | `WEB_PASSWORD`, `WEB_SECRET_KEY`, `WEB_PORT` |

> Instagram принимает только публичный HTTPS `video_url`. Положите файл на CDN/S3 и укажите URL в форме или `PUBLIC_VIDEO_BASE_URL`.

## Архитектура

```
video_publisher/
  web/                 # личный кабинет (FastAPI + UI)
  platforms/           # VK, YouTube, Instagram, TikTok
  orchestrator.py      # параллельная публикация
  scheduler.py         # очередь отложенных постов
  db.py                # SQLite статусы
  cli.py               # терминальный интерфейс
```

### Flows API

- **VK** — `video.save` → multipart upload / импорт по `link`
- **YouTube** — resumable upload (5MB chunks), нативный `publishAt`
- **Instagram** — container → poll `FINISHED` → `media_publish` + `content_publishing_limit`
- **TikTok** — init → chunked PUT → poll `PUBLISH_COMPLETE` (шедулинг свой)

## Тесты

```bash
pytest -q
```

## Замечания по доступам

- Instagram: Business/Creator + Facebook Page, App Review для publish scopes
- YouTube: OAuth `youtube.upload` (API key недостаточно)
- TikTok: до аудита только `SELF_ONLY`
- VK: токен с правом `video` для группы
