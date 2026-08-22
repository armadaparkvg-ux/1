# AGENTS.md

## Cursor Cloud specific instructions

### Repository layout (important)
This repository's `main` branch is essentially empty (a placeholder `README.md`).
Each real project lives on its own branch:

- `cursor/armada-support-ai-3e65` — **Park Armada Support AI** (this branch's
  project): a FastAPI RAG support agent for taxi-fleet drivers.
- `cursor/armada-landing-1d2d` — Next.js 14 landing site.
- `cursor/video-multiplatform-publisher-d2fc` — Python/FastAPI video publisher.
- `cursor/make-content-factory-architecture-781c` — static HTML/JS content app.
- `cursor/support-bot-amocrm-4727` — single-file Python support bot + amoCRM.

The notes below apply to the **Park Armada Support AI** project on this branch.

### Service: Park Armada Support AI (FastAPI)
There is no auto-start: dependencies are refreshed by the environment update
script (venv + `pip install`), but the server must be started manually.
`scripts/start_services.sh` is a convenience launcher (also pulls in the
optional Ollama). Standard run/test commands live in `README.md`. In short:

- Run the web chat + API: `.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8080`
  then open http://127.0.0.1:8080 (web chat) or hit `GET /health`, `POST /api/chat`.
- Run tests: `.venv/bin/python -m pytest -q` (6 tests, all offline).
- Validate the knowledge base: `.venv/bin/python scripts/rebuild_index.py`
  and `.venv/bin/python scripts/eval_agent.py` (prints an intent-match score).
- Telegram long-polling channel: `.venv/bin/python -m app.channels.telegram_polling`
  (needs `TELEGRAM_BOT_TOKEN`).

### Non-obvious gotchas
- **The app is fully functional offline — no LLM API key required.** With the
  default `.env` (`POLISH_WITH_LLM=false`), replies come from the BM25 intent
  matcher + curated manager answers in `knowledge/intents.json`; no network/LLM
  call is made. `GET /health` reports `llm_enabled: true` and an Ollama provider
  only because `.env` *points* at a local Ollama URL — it is not actually called
  unless you set `POLISH_WITH_LLM=true` AND have Ollama serving on `:11434`.
- **Ollama is optional.** The repo's `scripts/bootstrap.sh`/`scripts/start_services.sh`
  will install/start Ollama and pull `qwen2.5:3b`, but this is a large, slow,
  network-heavy download that is NOT needed to run, test, or demo the service.
  It is intentionally excluded from the environment update script.
- **`antiword`/`catdoc` are not needed at runtime.** They are only used to
  regenerate the knowledge base from `knowledge/bot3.doc`. `intents.json` is
  already committed, and `scripts/rebuild_index.py` only *validates* the
  committed `intents.json` (it does not parse the `.doc`).
- `.env` is created from `.env.example` on first setup and is git-ignored. Real
  LLM/Telegram/MAX secrets come from environment variables (Cursor Secrets),
  never hard-coded. `MAX_WEBHOOK_SECRET` defaults to a placeholder.
- The venv lives at `.venv/`; use `.venv/bin/uvicorn` / `.venv/bin/python`
  (or activate it) so the installed dependencies are on the path.
- There is no linter configured for this project.
