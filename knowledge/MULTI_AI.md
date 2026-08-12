# Мульти-ИИ оркестрация

Если задача буксует — **не застревать**: отдать субагенту и забрать результат.

## Доступные делегаты в этой среде Cursor

| ИИ | Как вызываем | Сильные стороны |
|---|---|---|
| **Claude** (Opus/Sonnet) | Cursor Task subagent `model=claude-*` | архитектура, ревью, сложный код, промпты |
| **ChatGPT / GPT** | Cursor Task `model=gpt-*` или OpenAI API | быстрые правки, тексты, API-интеграции |
| **Composer** | Task `model=composer-*` | правки по репо |
| **Computer Use** | Task `subagent_type=computerUse` | браузер, AmoCRM, UI |

Claude Code CLI / GitHub Copilot CLI в VM **не установлены**. Эквивалент: субагенты Cursor + OpenAI-compatible API.

## Правило работы

1. Сначала пробую сам (код, тесты, сервер).
2. Если блокер > 1 попытки или нужен другой взгляд — `scripts/delegate_ai.py` или Task на Claude/GPT.
3. Забираю артефакт из `data/delegations/`.
4. Вливаю в проект, прогоняю `eval_agent.py` / тесты, коммичу.

## Быстрый вызов

```bash
source .venv/bin/activate
python scripts/delegate_ai.py --provider openai --task "Улучши ответы по выводу DRIVEE"
python scripts/delegate_ai.py --provider deepseek --task "Добавь 10 вариаций вопросов про ФГИС"
```

Для Claude/GPT внутри Cursor — субагент Task (см. ниже в логах агента).
