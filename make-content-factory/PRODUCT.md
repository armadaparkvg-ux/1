# Content Factory — продуктовая спецификация v2

Платформа автопостинга, собранная из сильных сторон Buffer, Later, Hootsuite, SMMplanner, Postmypost + Make-native automation.

## Что взяли у лидеров

| Фича | Источник | Как у нас |
|---|---|---|
| Publishing Queue + best time | Buffer | Вкладка Queue, слоты peak hours, статус `queued` |
| Visual calendar / feed preview | Later | Вкладка Calendar, сетка 9:16 превью |
| Approvals | Hootsuite / Planable / Postmypost | Статусы draft→review→approved→ready + CF-06 |
| AI adapt per platform | Buffer / Postmypost | AI Studio + модуль в CF-01 |
| Bulk import Sheets/CSV | Publer / Postmypost / SMMplanner | `content-plan.csv` + Watch Rows |
| RSS ingest | SMMplanner | CF-05 RSS → draft rows |
| Evergreen recycle | SocialBee | CF-07 категории + повтор через N дней |
| Cross analytics | Metricool / Sprout | Analytics board + CF-03 |
| Make/n8n hooks | Postmypost | Нативные blueprints |
| Comment → DM | Instagram best practice | CF-02 (наш дифференциатор) |
| Token vault | TikTok reality | CF-04 Data Store |
| UTM templates | SMMplanner / Postmypost | колонка `utm_campaign` |

## Чего сознательно НЕ копируем

- Серый multi-account + proxy (риск банов) — только официальные API
- Тяжёлый enterprise listening à la Sprinklr (вне scope v2)
- Одинаковый текст на все сети без адаптации

## Модель статусов контента

```
idea → draft → review → approved → ready → queued → publishing → published
                                                      ↘ partial / error
published → recycle_candidate → ready (evergreen)
```

## Роли

| Роль | Может |
|---|---|
| Creator | draft, AI, media |
| Editor | review, edit captions |
| Approver | approved / reject |
| Publisher | ready → publish (или авто через Make) |
| Analyst | analytics, recycle decisions |

## Метрики успеха платформы

- Time-to-publish (от ready до live) < 15 мин в слоте
- % native adapt (разные captions) > 90%
- Partial failures < 5%
- Lead magnet conversion (comment→DM open)
