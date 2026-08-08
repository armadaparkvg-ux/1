# Чеклист: что нужно для запуска Make Content Factory

## 1. Аккаунты и доступы

### Make
- [ ] Аккаунт Make (рекомендуется Core / Pro — нужны роутеры, HTTP, Data Stores)
- [ ] Организация / Team создана
- [ ] Понимание лимита операций (Operations) — видеопайплайн жрёт много

### Контент-хранилище
- [ ] Google аккаунт
- [ ] Google Sheets — таблица контент-плана (импорт `sheets/content-plan.csv`)
- [ ] Google Drive — папка `Content Factory / Videos` + `Covers`
- [ ] Видео доступны по публичной/прямой ссылке **или** скачиваются через Drive модуль

### Instagram
- [ ] Instagram Professional (Business или Creator)
- [ ] Facebook Page, привязанная к Instagram
- [ ] Meta Business Suite доступ
- [ ] Meta Developer App → Instagram Graph API
- [ ] Permissions: `instagram_basic`, `instagram_content_publish`, `instagram_manage_comments`, `instagram_manage_messages`, `pages_show_list`, `pages_read_engagement`
- [ ] Long-lived token / Make connection «Instagram for Business» / «Facebook Graph API»

### ВКонтакте
- [ ] Сообщество VK (группа/паблик)
- [ ] Приложение на [dev.vk.com](https://dev.vk.com)
- [ ] Токен сообщества с правами: `wall`, `video`, `photos`, `stories`, `manage`, `messages` (если бот)
- [ ] Для клипов — актуальные методы shortVideo / video API
- [ ] IP whitelist приложения (если требуется)

### YouTube
- [ ] Google Cloud Project
- [ ] YouTube Data API v3 включён
- [ ] OAuth consent screen + scope `youtube.upload`, `youtube`, `youtube.force-ssl`
- [ ] Канал YouTube верифицирован (для кастомных превью)
- [ ] Запрос повышения квоты, если >6 upload/день
- [ ] Make connection «YouTube»

### TikTok
- [ ] TikTok for Developers app
- [ ] Product: **Content Posting API** + Direct Post enabled
- [ ] Scope `video.publish` (+ `video.upload` при необходимости)
- [ ] **App Audit** пройден (иначе посты private)
- [ ] Verified domain / URL prefix для `PULL_FROM_URL`
- [ ] Refresh-token процесс (access token живёт 24ч)

---

## 2. Инфраструктура Make

### Connections (подключения)
- [ ] Google Sheets
- [ ] Google Drive
- [ ] Instagram / Facebook Graph API
- [ ] YouTube
- [ ] HTTP (для VK и TikTok)
- [ ] OpenAI / другой LLM (опционально — адаптация текстов)
- [ ] Telegram Bot или Email (алерты об ошибках)

### Data Stores
- [ ] `cf_tokens` — refresh tokens TikTok/VK
- [ ] `cf_publish_log` — история публикаций
- [ ] `cf_rate_limits` — счётчики дневных лимитов

### Webhooks
- [ ] Custom Webhook: ручной триггер «опубликовать сейчас»
- [ ] Meta Webhook: комментарии Instagram (сценарий лид-магнита)
- [ ] VK Callback API (опционально)

---

## 3. Спеки медиа (обязательно)

| Площадка | Формат | Ratio | Длина short | Кодек |
|---|---|---|---|---|
| Instagram Reels | MP4/MOV | 9:16 | до лимита API | H.264 + AAC |
| VK клип/видео | MP4 | 9:16 / 16:9 | по лимиту VK | H.264 |
| YouTube Shorts | MP4 | 9:16 | ≤60–180 сек | H.264 |
| TikTok | MP4 | 9:16 | 3 сек–10 мин | H.264 |

- [ ] Все ролики проходят проверку FFmpeg / CapCut export preset
- [ ] Есть обложки 1080×1920 (или кадр из видео)
- [ ] Прямые URL отдаются без авторизации (для IG/TT pull)

---

## 4. Статусы в таблице (договорённость)

| status | Значение |
|---|---|
| `idea` | Идея, не трогать |
| `draft` | Черновик текстов/видео |
| `ready` | Готово к публикации |
| `queued` | Забрано сценарием Make |
| `publishing` | Идёт выкладка |
| `published` | Успех на всех выбранных платформах |
| `partial` | Часть платформ упала |
| `error` | Полный фейл |

---

## 5. Порядок запуска

1. Открыть `index.html` → изучить платформу (Calendar / Queue / AI / Approvals)  
2. Импортировать CSV в Google Sheets (новые колонки: best_time_slot, category, approval_*, recycle_*, utm_campaign)  
3. Заполнить галочки доступов выше  
4. В Make: Import Blueprint из `blueprints/` (CF-01…CF-07)  
5. Подключить Connections + Sheet ID + Data Stores  
6. Прогнать **1 тестовый ролик** только в VK  
7. Затем YouTube (private) → Instagram → TikTok  
8. Включить: CF-04 (токены) → CF-06 (approvals) → CF-01 (publish)  
9. Потом CF-02 (DM), CF-05 (RSS), CF-07 (recycle), CF-03 (analytics)  

---

## 6. Бюджет операций Make (ориентир)

На 1 ролик × 4 площадки ≈ **25–60 operations**  
(Sheets + Drive + AI тексты + 4 publish + логи + ошибки)

При 2 роликах/день × 30 дней ≈ **1 500–3 600 ops/мес** только на публикацию.  
С аналитикой и ботами — закладывайте **×2–3**.
