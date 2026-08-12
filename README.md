# Park Armada Support AI

ИИ-агент службы поддержки водителей таксопарка **«Армада»**.

Отвечает как живой менеджер по базе знаний (`bot3.doc`), стилю диалогов и актуальному сайту [park-armada.ru](https://park-armada.ru/).

## Почему не «просто дообучить OpenAI»

Для поддержки водителей **лучше RAG + эталонные ответы менеджера**, а не fine-tune:

| Подход | Когда нужен | Минусы |
|---|---|---|
| **BM25/intent + шаблоны менеджера** | 70–90% типовых вопросов | Суховато без LLM |
| **RAG + LLM (рекомендуем)** | Живой диалог, уточнения, перефразы | Нужен API-ключ |
| Fine-tune GPT | Очень большой уникальный корпус | Дорого, долго, быстро устаревает при смене тарифов |

**Рекомендуемые модели для старта:**

1. **DeepSeek Chat** (`deepseek-chat`) — сильный русский, доступен из РФ, дёшево  
2. **OpenAI GPT-4o-mini / GPT-4.1-mini** — отличное качество диалога (нужен ключ OpenAI)  
3. **GigaChat / YandexGPT** — если критичен 152‑ФЗ и данные только в РФ (подключается тем же OpenAI-compatible слоем или отдельным адаптером)

Платформа уже работает **офлайн** без ключа: отдаёт эталонные ответы менеджера по поиску намерений.

## Быстрый старт

```bash
cd /workspace
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # при необходимости добавьте LLM_API_KEY
uvicorn app.main:app --host 0.0.0.0 --port 8080
```

Откройте http://127.0.0.1:8080 — веб-чат.

### С LLM (OpenAI)

```env
LLM_API_KEY=sk-...
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
POLISH_WITH_LLM=false
```

### С DeepSeek

```env
LLM_API_KEY=sk-...
LLM_BASE_URL=https://api.deepseek.com
LLM_MODEL=deepseek-chat
```

## API

- `GET /health` — статус и провайдер  
- `POST /api/chat` — `{"message":"...","session_id":null,"channel":"web"}`  
- `GET /api/intents` — загруженные намерения  
- `POST /webhook/telegram` — webhook Telegram Bot API  
- `POST /webhook/max` — адаптер MAX (`user_id`, `text`, `secret`)

Telegram long-polling:

```bash
export TELEGRAM_BOT_TOKEN=123:ABC
python -m app.channels.telegram_polling
```

## Обучение / база

```bash
python scripts/rebuild_index.py
python scripts/eval_agent.py
```

Знания лежат в:

- `knowledge/intents.json` — намерения и ответы менеджера (из bot3 + сайт)
- `knowledge/site_facts.md` — факты с park-armada.ru
- `knowledge/bot3.doc` / `bot3_raw.txt` — исходная база
- `knowledge/style_from_crm.md` — стиль (AmoCRM без логина недоступен; разобран bot3)

## Каналы

- **Сайт** — виджет/чат на этом сервере (можно встроить iframe)
- **Telegram** — webhook или polling
- **MAX** — webhook stub `/webhook/max` (подключить middleware MAX → наш API)

## Мульти-ИИ

Если задача буксует — делегируем Claude/GPT субагентам Cursor или `scripts/delegate_ai.py`. См. `knowledge/MULTI_AI.md`. Результаты кладём в `data/delegations/`.

## Структура

```
app/           # FastAPI + агент + провайдеры
knowledge/     # база знаний
scripts/       # rebuild / eval
tests/         # автотесты
data/          # отчёты по стилю CRM
```
