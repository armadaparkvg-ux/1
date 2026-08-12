# AGENTS.md

## Cursor Cloud specific instructions

### Repository layout (important)
This repository's `main` branch is essentially empty. Each real project lives on
its own branch:

- `cursor/support-bot-amocrm-4727` — **Парк АРМАДА support bot** (this branch's
  project): a single-file Python AI support bot with amoCRM integration.
- `cursor/armada-landing-1d2d` — Next.js 14 landing site.
- `cursor/video-multiplatform-publisher-d2fc` — Python/FastAPI video publisher.
- `cursor/make-content-factory-architecture-781c` — static HTML/JS Make.com docs.

The notes below apply to the **support bot** project.

### Service: Парк АРМАДА support bot (`support_bot.py`)
- **No dependencies to install.** The bot uses only the Python 3 standard library
  (`asyncio`, `urllib`, `json`, `re`, …), so there is no `requirements.txt` and no
  virtualenv is required. Run it directly with the system `python3` (3.10+).
- Run the scripted demo conversation: `python3 support_bot.py`
  (this is `BOT_MODE=demo`, the default).
- Run an interactive REPL: `BOT_MODE=interactive python3 support_bot.py`
  (type messages; empty line / `exit` / `quit` to leave).
- Pipeline per message: intent detection → knowledge-base retrieval → CRM
  escalation → response generation. The knowledge base lives in `bot.txt`
  (path overridable via `BOT_KB_PATH`); the bot logs `KB file present ...` and
  uses embedded rules derived from it.

### Non-obvious gotchas
- **amoCRM is in dry-run by default** (`AMO_DRY_RUN=1`). The demo therefore makes
  **no** outbound CRM calls — it logs `DRY amoCRM ...` lines showing the contact /
  lead / note / task payloads it *would* send. To hit the real amoCRM API, set
  `AMO_DRY_RUN=0` plus `AMO_BASE_URL` and `AMO_ACCESS_TOKEN` (and optionally the
  `AMO_PIPELINE_ID` / `AMO_STATUS_ID` / `AMO_RESPONSIBLE_USER_ID` / `AMO_PHONE_FIELD_ID`
  env vars). All tokens come only from the environment — never hard-coded.
- Channel entry points exist for Telegram / WhatsApp / webchat
  (`handle_telegram_update`, `handle_whatsapp_webhook`, `handle_webchat`), but the
  file has no long-running server / webhook listener — `__main__` only runs the
  demo or interactive REPL. Wire those handlers into your own transport to deploy.
- There are no automated tests and no linter configured in this project.
