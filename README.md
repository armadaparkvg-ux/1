# Таксопарк «Армада»

Премиальный лендинг для подключения водителей к Яндекс Такси.

**Домен:** [https://park-armada.ru](https://park-armada.ru)

## Стек

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix)
- Framer Motion
- Zod + React Hook Form
- Яндекс.Метрика `110811547`

## Запуск (локально)

```bash
npm install
npm run dev
```

## Сборка ZIP для хостинга

```bash
npm run zip:hosting
```

- `dist/park-armada-hosting-*.zip` — содержимое для `public_html`
- `dist/park-armada-source-*.zip` — исходники

## DNS (Reg.ru)

NS: `ns1.hosting.reg.ru` / `ns2.hosting.reg.ru`. Добавьте A-запись на IP хостинга.
