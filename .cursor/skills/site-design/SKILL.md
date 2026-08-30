---
name: site-design
description: Профессиональный UI park-armada.ru — тёмная тема, янтарь/изумруд, Manrope, карточки, герои, кнопки, адаптив. Использовать при вёрстке, дизайне, лендинге, hero, CTA, карточках, типографике, мобильном меню, новой странице, «сделай красиво», редизайне, Tailwind.
icon: palette
color: orange
---

# Дизайн таксопарка «Армада»

Не рисуй новый визуальный язык. Поднимай качество **внутри** системы: графит + янтарь + изумруд, Manrope, тёмная тема без переключателя.

Токены и компоненты: [references/tokens.md](references/tokens.md).

## Стек UI

Next.js 14, Tailwind 3, Radix (accordion), CVA-кнопки, Lucide. Шрифт **Manrope** (`--font-manrope`, latin + cyrillic). `<html lang="ru" class="dark">` — **только dark**.

Файлы системы:

- `src/app/globals.css` — CSS-переменные, `.glass`, `.premium-card`, `.gradient-text`
- `tailwind.config.ts` — цвета, тени, shine
- `src/components/ui/button.tsx` — единственные CTA
- `src/components/fade-in.tsx` — `SectionHeading`
- `src/components/destination-hero.tsx` — герой внутренних
- `src/app/layout.tsx` — шапка / `main` / подвал / sticky mobile

## Принципы

1. **Иерархия, не декор.** Один H1, секции через `SectionHeading` (eyebrow caps + H2). Не плодить новые заголовочные классы.
2. **Воздух.** Секции `py-10 sm:py-16 lg:py-20`, контейнер `max-w-7xl px-4 sm:px-6 lg:px-8`. Лид — `max-w-2xl` / `max-w-3xl`, не на всю ширину.
3. **Одна поверхность на роль.** Карточки — `.premium-card` или `.glass`. Не изобретать третий «серый ящик» с другими скруглениями.
4. **Сдержанное движение.** `shine` — медленный блик на главном CTA. `pulse` — статичное свечение. Без пульсирующих колец и Framer Motion, который прячет контент (`opacity: 0` ломал мобильный LCP).
5. **`prefers-reduced-motion`** уже глушит анимации — не обходить.
6. **Мобильный низ.** Sticky-бар `StickyActions`. У подвала `pb-[calc(4.75rem+env(safe-area-inset-bottom))]`. Не ставить фиксированные элементы, которые его перекрывают.
7. **Доступность.** Фокус — кольцо accent. Иконки без текста — `aria-label`. Декор — `alt=""`. Контраст янтаря на графите не снижать серым текстом на сером.
8. **Правда в UI.** Не рисовать бейджи «0%», «24/7», «аренда авто». Разрешённые опоры: **от 1,9%**, **10–15 мин**, **8:00–21:00 Мск**, своё авто.

## Как собирать экран

```
Header 72px (fixed)
→ DestinationHero | Hero   (pt-[72px], картинка + двойной градиент, pill, H1, 2–3 CTA)
→ section + SectionHeading
→ сетка premium-card / glass
→ DualPathActions или Button shine + emerald MAX + outline Telegram
→ Footer
```

Главная отвечает только «какое направление?». Глубина — на `/taxi/`, `/trudovoj-dogovor/`, `/delivery/`, `/o-parke/`. Не возвращать длинную простыню на `/`.

CTA-стек (повторять, не менять смысл):

1. Янтарный `Button shine` — регистрация / якорь
2. Изумрудный MAX — заявка
3. Outline Telegram — запасной канал

## Типографика

| Роль | Класс |
|---|---|
| H1 герой | `font-display text-[1.7rem] sm:text-4xl lg:text-5xl font-semibold tracking-tight text-balance` |
| H1 статья | `font-display text-3xl sm:text-4xl font-semibold text-balance` |
| H2 секция | `SectionHeading` → `text-3xl sm:text-4xl` |
| H3 карточка | `font-display text-lg sm:text-xl font-semibold` |
| Eyebrow | `uppercase tracking-wide text-accent` или pill `border-accent/30 bg-accent/10` |
| Лид | `text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground` |
| Бренд в лого | `.gradient-text` |

Не смешивать второй шрифт. Не ставить Inter / Roboto / системный display.

## Картинки

- Герой внутренний: `next/image` fill, `object-cover opacity-65`, поверх тёмные градиенты (`#080b11` / `#07090d`).
- Главная LCP: сырой `<img>` `/images/hero-bg.webp`, не прятать.
- Новые фото: `scripts/optimize-images.mjs` (WebP). Разные услуги — разные файлы и alt (лицензия ≠ ОСГОП).
- OG: 1200×630, не квадрат.

## Запреты дизайна

- Светлая тема «на глаз» без полной палитры.
- Копировать UI/тексты/фото конкурента (в т.ч. Expert Park).
- Разорвать герой на «баннер отдельно, текст отдельно».
- Утилитарные карточки вперемешку с `rounded-3xl` премиум.
- Агрессивный pulse, конфетти, неон, 3D-градиенты не из токенов.
- Прятать блоки через JS-анимацию появления.
- Новые цвета вне `--accent` / `--emerald` / графита (кроме нейтралей slate в токенах).

## Проверка UI

После любой видимой правки — не один скриншот:

1. Прокликать изменённый сценарий (меню, CTA, форма/мессенджер, крошки).
2. Соседние маршруты с тем же компонентом (герой, FAQ, карточки городов).
3. Пустое / ошибочное состояние, если его касались.
4. Desktop и узкий мобильный, если менялись сетка, шапка, sticky.

Локально: `npm run dev`. Статика как на хостинге: `npm run build:static`.
