# Доступ к OpenAI из среды агента

## Факт
Cloud Agent работает в AWS (США, Ohio). С этой машины:
- `https://api.openai.com` **доступен** (нужен только API-ключ)
- Личный VPN-сервер для входа **с вашего домашнего ПК** поднять нельзя: у VM нет публичного inbound IP/портов

## Что уже сделано
1. Локальная модель Ollama (`qwen2.5:3b`) — работает без OpenAI
2. API OpenAI можно включить сразу, положив ключ в `.env`:

```env
LLM_API_KEY=sk-...
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
```

3. ChatGPT в браузере можно открыть на удалённом рабочем столе агента (США)

## Чего не делать
Не ждать стабильный VPN на ephemeral Cloud Agent — сессия временная.
Для постоянного VPN нужен отдельный VPS (Timeweb/Hetzner/etc.) вне Cursor.
