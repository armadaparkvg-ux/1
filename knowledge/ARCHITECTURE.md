# Архитектура ИИ поддержки «Армада»

## Выбор модели
1. DeepSeek Chat — цена/русский/доступность
2. OpenAI GPT-4o-mini — если есть API key
3. GigaChat / YandexGPT — 152-ФЗ

Fine-tune не нужен на старте. Используем BM25 intent + optional LLM.

## Каналы
Web, Telegram, MAX webhook.
