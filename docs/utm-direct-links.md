# UTM для Яндекс Директ (сайт 2026-08-23)

Шаблон:
`?utm_source=yandex&utm_medium=cpc&utm_campaign=<код>&utm_content={ad_id}&utm_term={keyword}`

Полное ТЗ: `TZ-CLAUDE-CODE-YANDEX-DIRECT.md`

| Кампания | utm_campaign | Посадка |
|----------|--------------|---------|
| Трудовой (приоритет 1) | `p4_trudovoj` | `/trudovoj-dogovor/` |
| Самозанятый (2) | `p2_samozanyatyj` | `/taxi/#formats` |
| Подключение общее | `p1_podklyuchenie` | `/taxi/#formats` |
| Доставка (3) | `delivery_courier` | `/delivery/#courier-tariffs` |
| ИП | `p3_ip` | `/taxi/#formats` |
| ФГИС (4, низкий приоритет) | `p5_fgis` | `/license/` |
| ОСГОП | `p5_osgop` | `/osgop/` |
| Бренд | `p6_brand` | `/` |
| Лимит НПД | `p8_limit_npd` | `/blog/limit-npd-2-4-mln/` |
| Статьи (по одной) | `p9_*` | конкретный slug |
| РСЯ | `r1_rsya` | по направлению |
| Ретаргет | `r2_retarget` | по URL визита |
| Города | `geo_<slug>` | `/goroda/<slug>/` |

Не использовать: `/#tariffs` `/#quiz` `/#apply` `/taxi/#labor-contract`.
