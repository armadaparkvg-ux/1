# Конкурентный анализ → что внедряем в Content Factory

## Матрица лидеров

| Сервис | Сильные стороны | Слабые стороны | Что берём |
|---|---|---|---|
| **Buffer** | Простота, очередь, AI rewrite под площадки, best time, дешёвый вход | Слабый визуальный календарь, мало enterprise-governance | Queue + AI adapt per platform + best-time slots |
| **Later** | Visual grid IG/TikTok, media-first, link-in-bio | Слабее VK/RU, дороже при масштабе | Visual calendar + feed preview + media library |
| **Hootsuite** | Inbox, listening, approvals, 30+ каналов | Дорого, тяжёлый UX | Approval workflow + unified alerts |
| **Sprout Social** | Аналитика, CRM, listening | Цена enterprise | Cross-platform analytics dashboard |
| **Metricool / Publer** | Цена + bulk + отчёты | Меньше «вау»-UX | Bulk CSV/Sheets import + competitor-lite metrics |
| **SocialBee** | Evergreen recycling по категориям | Ограничения для агентств | Evergreen / recycle queue |
| **Planable** | Согласования с клиентом | Не самый сильный native publish | Status: draft → review → approved → ready |
| **SMMplanner** | VK/TG/OK, RSS-репостер, Stories tools | UI устарел, нет free | RSS autopost + RU platforms first-class |
| **Postmypost** | Mass upload, approvals, API/Make/n8n, AI brand voice | Зависит от Meta-доступа в РФ | Bulk + brand voice AI + Make-native API hooks |

## Ключевые технологии рынка (must-have 2026)

1. **Content Calendar** (drag visual plan)
2. **Publishing Queue** + best-time windows
3. **Platform-native adapt** (не один текст на все сети)
4. **AI captions / hashtags / rewrite**
5. **Bulk import** (CSV / Sheets / Drive folder)
6. **Approval workflow** (команда / клиент)
7. **Media library** + превью 9:16
8. **RSS / competitor repost pipeline**
9. **Cross-platform analytics**
10. **UTM templates** + deep links
11. **Evergreen recycle**
12. **Webhooks / Make / n8n** для кастомных воронок
13. **Comment → DM lead magnet** (наш дифференциатор)
14. **Token vault** (TikTok 24h refresh и т.п.)

## Наш продуктовый фокус

**Content Factory = лучшее из планировщиков + Make-native automation + RU first-class (VK).**

Не копируем «ещё один Buffer». Собираем операционную систему контент-завода:
- план → адаптация → согласование → выкладка → вовлечение → аналитика → recycle

## Приоритет внедрения (в этом релизе)

| P0 (ядро UX) | P1 (автоматизация) | P2 (рост) |
|---|---|---|
| Visual calendar | CF-01 multi-publish | Lead magnet CF-02 |
| Queue + best time | CF-05 RSS ingest | Evergreen CF-07 |
| AI adapt captions | CF-06 Approvals gate | Boost winner |
| Bulk Sheets schema | CF-04 Token refresh | Competitor watch |
| Analytics board | CF-03 Metrics daily | White-label export |
