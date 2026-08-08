# Content Factory

Платформа автопостинга видео (Instagram · VK · YouTube · TikTok), собранная из сильных сторон Buffer, Later, Hootsuite, SMMplanner, Postmypost и SocialBee — на Make.com.

## Живая ссылка

Публичный демо-URL (Cloudflare Tunnel, пока агент/сервер онлайн):

**https://raised-football-phys-sas.trycloudflare.com/**

После включения GitHub Pages (Actions workflow `deploy-pages.yml`) постоянный адрес будет:

`https://armadaparkvg-ux.github.io/1/`

## Открыть

1. [`index.html`](./index.html) — лендинг + **платформа** (Calendar, Queue, AI, Approvals, Analytics…)  
2. [`COMPETITIVE-ANALYSIS.md`](./COMPETITIVE-ANALYSIS.md) — анализ лидеров  
3. [`PRODUCT.md`](./PRODUCT.md) — что внедрили и почему  
4. [`CHECKLIST.md`](./CHECKLIST.md) — доступы для запуска  

## Что внедрили с рынка

| Фича | Откуда |
|---|---|
| Visual calendar + 9:16 preview | Later |
| Queue + best-time | Buffer |
| Approvals gate | Hootsuite / Planable / Postmypost |
| AI adapt per platform | Buffer / Postmypost |
| Bulk Sheets / CSV | Publer / SMMplanner |
| RSS → draft | SMMplanner |
| Evergreen recycle | SocialBee |
| Cross analytics | Metricool / Sprout |
| Comment → DM | Instagram Private Reply |
| Make-native API publish | Postmypost-like + CF blueprints |

## Make scenarios

`blueprints/01`…`07` — Publisher, Lead Magnet, Analytics, Token Refresh, RSS, Approvals, Evergreen.

## Быстрый старт

```text
1. Открыть index.html → «Запустить платформу»
2. Импорт sheets/content-plan.csv в Google Sheets
3. Import Blueprint в Make
4. CF-04 → CF-06 → CF-01 → остальные
5. Тест: 1 ролик только в VK
```
