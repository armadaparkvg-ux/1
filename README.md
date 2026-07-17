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

## DNS (Reg.ru)

Домен зарегистрирован в REG.RU, NS: `ns1.hosting.reg.ru` / `ns2.hosting.reg.ru`.

В панели хостинга добавьте A-записи на IP сервера и дождитесь распространения DNS (до 24 ч).
