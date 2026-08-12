# AGENTS.md

## Cursor Cloud specific instructions

### Repository layout (important)
This repository's `main` branch is essentially empty. Each real project lives on
its own branch:

- `cursor/video-multiplatform-publisher-d2fc` — **Armada Publish** (this branch's
  project): Python 3.12 / FastAPI web cabinet + CLI for multi-platform video
  publishing (VK, YouTube, Instagram, TikTok).
- `cursor/armada-landing-1d2d` — Next.js 14 landing page.
- `cursor/make-content-factory-architecture-781c` — static HTML/JS Make.com docs.
- `cursor/support-bot-amocrm-4727` — single-file Python support bot.

The notes below apply to the **Armada Publish** Python project.

### Service: Armada Publish (video_publisher)
Standard commands live in `README.md` and `pyproject.toml` (`[project.scripts]`).
Quick reference: use the project's virtualenv at `.venv` (`source .venv/bin/activate`).

- Run web cabinet + API + scheduler: `video-publisher web` → http://127.0.0.1:8080
  (log in with `WEB_PASSWORD`, default port `8080`).
- Run tests: `pytest` (16 tests; external platform APIs are mocked with `respx`).
- CLI: `video-publisher platforms | publish | status | scheduler | scheduler-once`.
- There is **no linter configured** for this Python project (the `.eslintrc.json`
  belongs to the Next.js landing branch, not here).

### Non-obvious gotchas
- **`.env.example` breaks startup as-is.** It ships `VK_GROUP_ID=` (empty), but the
  setting is typed `int | None`, so pydantic-settings fails to parse the empty
  string and the app/CLI crash on boot. Leave `VK_GROUP_ID` **unset/commented**
  unless you have a real integer group id. (The app also runs fine with **no**
  `.env` at all, using built-in defaults.)
- **Publishing needs a configured platform.** `POST /api/publish` (and the CLI
  `publish`) raise `500 "Нет ни одной настроенной платформы"` when no platform is
  configured. A platform is "configured" only when its credentials are present
  (e.g. VK needs both `VK_ACCESS_TOKEN` and an integer `VK_GROUP_ID`).
- **No-network demo pattern.** To exercise the full publish flow without real
  tokens or outbound calls: set a dummy `VK_ACCESS_TOKEN` + integer `VK_GROUP_ID`,
  then publish with a **future** `publish_at`. VK/TikTok have no native scheduling,
  so the job is stored as `scheduled` (deferred) and no external API is called
  until the scheduler runs it.
- Data is SQLite under `data/publications.db`; uploads go to `uploads/`. Both are
  gitignored and safe to delete to reset local state (restart the server after).
