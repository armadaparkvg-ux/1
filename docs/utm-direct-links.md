# UTM-метки для Яндекс Директ — park-armada.ru

Метрика `110811547` сама читает UTM из URL визита.  
Сайт дополнительно **сохраняет UTM** и **добавляет их в текст заявки** (Telegram / MAX).

## Шаблон для всех объявлений

```
https://park-armada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=НАЗВАНИЕ_КАМПАНИИ&utm_content={ad_id}&utm_term={keyword}#якорь
```

Параметры `{ad_id}` и `{keyword}` Директ подставит сам (шаблоны Директа).

## Готовые ссылки по кампаниям

| Кампания | Ссылка |
|----------|--------|
| П1 Подключение | `https://park-armada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=p1_podklyuchenie&utm_content={ad_id}&utm_term={keyword}#tariffs` |
| П2 Самозанятый | `https://park-armada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=p2_samozanyatyj&utm_content={ad_id}&utm_term={keyword}#tariff-self` |
| П3 ИП | `https://park-armada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=p3_ip&utm_content={ad_id}&utm_term={keyword}#tariff-ip` |
| П4 Трудовой | `https://park-armada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=p4_trudovoj&utm_content={ad_id}&utm_term={keyword}#labor-contract` |
| П5 ФГИС | `https://park-armada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=p5_fgis&utm_content={ad_id}&utm_term={keyword}#services` |
| П6 Бренд | `https://park-armada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=p6_brand&utm_content={ad_id}&utm_term={keyword}` |
| Р1 РСЯ | `https://park-armada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=r1_rsya&utm_content={ad_id}&utm_term={keyword}#quiz` |
| Р2 Ретаргет | `https://park-armada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=r2_retarget&utm_content={ad_id}&utm_term={keyword}#apply` |
| Квиз | `https://park-armada.ru/?utm_source=yandex&utm_medium=cpc&utm_campaign=quiz&utm_content={ad_id}&utm_term={keyword}#quiz` |

CSV: `docs/utm-direct-links.csv` и релиз `direct-keywords-v1` (обновлённый).

## Важно

1. **Сначала query, потом якорь:** `?utm_...#quiz` — не наоборот.
2. После клика UTM попадают в Метрику и в сообщение заявки менеджеру.
3. Не меняйте `utm_source=yandex` и `utm_medium=cpc` для Директа — иначе сломается группировка в отчётах.
