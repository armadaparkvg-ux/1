# AGENTS.md

## Cursor Cloud specific instructions

### Repository layout (important)
This repository's `main` branch is essentially empty. Each real project lives on
its own branch:

- `cursor/make-content-factory-architecture-781c` — **Make Content Factory** (this
  branch's project): a static HTML/CSS/JS single-page content-planning app plus
  Make.com automation blueprints and product docs.
- `cursor/armada-landing-1d2d` — Next.js 14 landing site.
- `cursor/video-multiplatform-publisher-d2fc` — Python/FastAPI video publisher.
- `cursor/support-bot-amocrm-4727` — single-file Python support bot.

The notes below apply to the **Make Content Factory** project.

### Service: Make Content Factory (static site)
- **No build step and no dependencies.** The app is plain static files under
  `make-content-factory/` (`index.html`, `platform.css`, `app.js`). There is no
  `package.json`, bundler, or backend.
- Serve it locally with any static file server from that directory, e.g.
  `cd make-content-factory && python3 -m http.server 8090`, then open
  `http://127.0.0.1:8090/`.
- Production deploy is GitHub Pages via `.github/workflows/deploy-pages.yml`, which
  simply uploads the `make-content-factory/` directory as the Pages artifact.
- The rest of the folder is reference material: `ARCHITECTURE.md`, `PRODUCT.md`,
  `CHECKLIST.md`, `COMPETITIVE-ANALYSIS.md`, `blueprints/*.json` (importable
  Make.com scenarios), and `sheets/content-plan.csv`.

### Non-obvious gotchas
- **State lives entirely in `localStorage`.** Posts and API config are persisted in
  the browser (`app.js` keys `STORAGE_POSTS` / `STORAGE_API`); there is no server.
  The site seeds demo posts (CF-001…CF-004) on first load. Use the in-app
  "Сбросить демо" button to reset state; clearing site data / using a fresh profile
  also resets it.
- The landing and the app are the same page: clicking "Запустить платформу" calls
  `enterApp()` which hides `#landing` and shows `#app` (no navigation/route change).
- Media uploads are stored as data URLs in `localStorage`, which can exceed quota;
  `savePosts()` catches the error and retries with a lightweight (media-stripped)
  copy, so large media may not persist across reloads.
- Blueprints under `blueprints/` are Make.com scenario exports meant to be imported
  into Make.com — they are not executed by this static site.
