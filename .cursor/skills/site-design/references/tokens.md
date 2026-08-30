# Токены и компоненты Армады

## Цвет — `src/app/globals.css`

| Токен | Значение | Роль |
|---|---|---|
| `--background` | `#0b0f14` | фон |
| `--foreground` | `#f1f5f9` | основной текст |
| `--surface` | `#0f1724` | панели |
| `--surface-elevated` | `#151d2e` | поднятые поверхности |
| `--muted` | `#1a2332` | вторичный фон |
| `--muted-foreground` | `#94a3b8` | вторичный текст |
| `--border` | `rgba(148, 163, 184, 0.12)` | линии |
| `--accent` | `#f59e0b` | янтарь CTA / ссылки |
| `--accent-soft` | `#fbbf24` | светлый янтарь |
| `--accent-foreground` | `#0b0f14` | текст на янтаре |
| `--emerald` | `#10b981` | MAX / успех |
| `--card` | `rgba(21, 29, 46, 0.72)` | стекло карточки |
| `--header-h` | `72px` | высота шапки |

PWA: `background_color` `#0B0F14`, `theme_color` `#F59E0B`.

Жёсткий графит героя/подвала (не заменять токеном наугад): `#080b11`, `#07090d`, `#080c11`.

## Тени — `tailwind.config.ts`

- `shadow-glow` / `shadow-glow-sm` — янтарь
- `shadow-card` / `shadow-card-hover` — глубина карточек

## Радиусы

| Класс | Где |
|---|---|
| `rounded-lg` | пункты нав |
| `rounded-xl` | кнопки, инпуты |
| `rounded-2xl` | glass, FAQ |
| `rounded-3xl` | крупные карточки, MAX-блок |
| `rounded-full` | pill-бейджи |

## Кнопки — `src/components/ui/button.tsx`

`rounded-xl text-sm font-semibold`, hover `scale-[1.02]`, focus `ring-accent`.

| variant | Назначение |
|---|---|
| `default` + `shine` | главный CTA |
| `emerald` + `shine` | MAX |
| `outline` | Telegram / вторичное |
| `secondary` | нейтральное |
| `ghost` | шапка, тихие действия |
| `link` | текстовая ссылка |

Размеры: `sm` (шапка), `default`, `lg`.

Инпуты: `rounded-xl border-border bg-surface h-11`, focus `ring-accent`.

## Готовые блоки

| Компонент | Файл | Когда |
|---|---|---|
| Шапка | `header.tsx` | не дублировать нав |
| Главный герой | `hero.tsx` | только `/` |
| Внутренний герой | `destination-hero.tsx` | accent `amber` \| `emerald` |
| Заголовок секции | `SectionHeading` в `fade-in.tsx` | все H2-блоки |
| Крошки | `breadcrumbs.tsx` | блог, города, FAQ |
| Карточки направлений | `home-destinations.tsx` | главная |
| Города | `home-cities.tsx`, `city-landing.tsx` | гео |
| FAQ | `faq.tsx`, `page-faq.tsx`, `faq-list.tsx` | аккордеон Radix |
| Контакты | `contacts.tsx`, `contact-buttons.tsx` | MAX/TG/телефон |
| Sticky mobile | `sticky-actions.tsx` | не перекрывать |
| Подвал | `footer.tsx` | 4 колонки с `md` |
| Статья | `article-page.tsx` | блог |
| Сервисы ФГИС/ОСГОП | `document-service-landing.tsx` | разные фото |

Утилиты CSS: `.premium-card`, `.glass`, `.premium-grid`, `.metric-tile`, `.gradient-text`, `.divider-glow`, `.section-anchor`.

## Контейнеры

- Широкий: `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- Узкий (статья, FAQ, заявка): `max-w-3xl`
- Сетка карточек: `gap-4 sm:gap-6`, на `md`/`lg` 2–3 колонки

## Иконки

Только `lucide-react`. Акцент иконки в карточке: янтарь или изумруд в круге `rounded-xl bg-accent/10`.
