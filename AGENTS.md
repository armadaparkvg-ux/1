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
- `cursor/armada-support-ai-3e65` — FastAPI support-AI bot (has its own Dockerfile).
- `cursor/support-bot-amocrm-4727` — single-file Python support bot.

The notes below apply to the **Armada Publish** Python project (this branch).

### Service: Armada Publish (`video_publisher`)
Standard commands live in `README.md` and `pyproject.toml` (`[project.scripts]`).
The project uses a virtualenv at `.venv` — activate it with
`source .venv/bin/activate` before running anything.

- Run web cabinet + API + scheduler: `video-publisher web` → http://127.0.0.1:8080
  (log in with `WEB_PASSWORD`, default port `8080`, binds `0.0.0.0`).
- Run tests: `pytest` (16 tests; external platform APIs are mocked with `respx`,
  so no network/tokens are needed).
- CLI: `video-publisher platforms | publish | status | scheduler | scheduler-once`.
- There is **no linter configured** for this Python project (the `.eslintrc.json`
  in the repo belongs to the Next.js landing branch, not here).

### Non-obvious gotchas
- **`.env.example` breaks startup as-is.** It ships `VK_GROUP_ID=` (empty), but the
  setting is typed `int | None`, so pydantic-settings raises
  `int_parsing` and the app/CLI crash on boot. Leave `VK_GROUP_ID` **unset/commented**
  unless you have a real integer group id. (The app also runs fine with **no**
  `.env` at all, using built-in defaults — no platforms are enabled in that case.)
- **Publishing needs a configured platform.** A platform is "configured" only when
  its credentials are present (e.g. VK needs both `VK_ACCESS_TOKEN` and an integer
  `VK_GROUP_ID`). With none configured, publish raises 500 "Нет ни одной
  настроенной платформы".
- **No-network demo pattern.** To exercise the full publish flow without real
  tokens or outbound calls: set a dummy `VK_ACCESS_TOKEN` + integer `VK_GROUP_ID`,
  then publish with a **future** `publish_at`. VK/TikTok have no native scheduling,
  so the job is stored as `scheduled` (deferred) and no external API is called
  until the scheduler runs it. Publishing with **no / past** `publish_at` triggers
  an immediate real VK API call, which fails with a dummy token (job → `failed`).
- **Web publish form date field.** "Отложить до" is an `<input type=datetime-local>`;
  browsers may require the seconds segment before the form submits (HTML5
  validation). The API itself accepts naive ISO-8601 (e.g. `2027-01-01T10:00:00`).
- Data is SQLite under `data/publications.db`; uploads go to `uploads/`. Both are
  gitignored and safe to delete to reset local state (restart the server after).
