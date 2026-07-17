# Таксопарк «Армада»

Премиальный лендинг для подключения водителей к Яндекс Такси.

## Стек

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix)
- Framer Motion
- Zod + React Hook Form

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Сборка

```bash
npm run build
npm start
```

## API

`POST /api/lead` — приём заявок (заглушка с валидацией Zod и honeypot).
