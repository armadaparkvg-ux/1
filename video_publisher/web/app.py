"""FastAPI: личный кабинет автопубликации для таксопарка."""

from __future__ import annotations

import logging
import secrets
import shutil
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from fastapi import (
    Depends,
    FastAPI,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware

from video_publisher.config import Settings, get_settings
from video_publisher.db import Database
from video_publisher.logging_setup import setup_logging
from video_publisher.models import Platform, PublicationStatus, PublishRequest, VideoMetadata
from video_publisher.orchestrator import VideoPublisherService
from video_publisher.scheduler import PublicationScheduler

logger = logging.getLogger(__name__)

WEB_DIR = Path(__file__).resolve().parent
TEMPLATES = Jinja2Templates(directory=str(WEB_DIR / "templates"))

PLATFORM_META = {
    Platform.VK: {"label": "VK Видео", "hint": "Группа таксопарка"},
    Platform.YOUTUBE: {"label": "YouTube Shorts", "hint": "Нативный publishAt"},
    Platform.INSTAGRAM: {"label": "Instagram Reels", "hint": "Нужен публичный URL"},
    Platform.TIKTOK: {"label": "TikTok", "hint": "Очередь на нашей стороне"},
}


def _job_row(job) -> dict:
    return {
        "id": job.id,
        "batch_id": job.batch_id,
        "platform": job.platform,
        "status": job.status,
        "title": job.title,
        "description": job.description,
        "hashtags": job.hashtags,
        "publish_at": job.publish_at.isoformat() if job.publish_at else None,
        "external_id": job.external_id,
        "container_id": job.container_id,
        "publish_id": job.publish_id,
        "result_url": job.result_url,
        "error": job.error,
        "error_code": job.error_code,
        "attempts": job.attempts,
        "created_at": job.created_at.isoformat() if job.created_at else None,
        "updated_at": job.updated_at.isoformat() if job.updated_at else None,
        "video_path": job.video_path,
    }


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    setup_logging(settings.log_level)
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    Path("data").mkdir(parents=True, exist_ok=True)

    service = VideoPublisherService(settings=settings)
    scheduler = PublicationScheduler(service=service, settings=settings)

    @asynccontextmanager
    async def lifespan(_app: FastAPI):
        scheduler.start(blocking=False)
        logger.info("Web platform ready on %s:%s", settings.web_host, settings.web_port)
        try:
            yield
        finally:
            scheduler.shutdown()

    app = FastAPI(title=settings.web_brand_name, lifespan=lifespan)
    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.web_secret_key,
        session_cookie="armada_session",
        same_site="lax",
        https_only=False,
        max_age=60 * 60 * 24 * 14,
    )
    app.mount("/static", StaticFiles(directory=str(WEB_DIR / "static")), name="static")

    app.state.settings = settings
    app.state.service = service
    app.state.db = service.db
    app.state.scheduler = scheduler

    def require_auth(request: Request) -> bool:
        if request.session.get("authenticated"):
            return True
        accept = request.headers.get("accept", "")
        if "text/html" in accept and not request.url.path.startswith("/api/"):
            raise HTTPException(
                status_code=status.HTTP_307_TEMPORARY_REDIRECT,
                headers={"Location": "/login"},
            )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="login_required")

    def _ctx(request: Request, **extra):
        configured = {p.value for p in service.configured_platforms()}
        return {
            "request": request,
            "brand": settings.web_brand_name,
            "authenticated": bool(request.session.get("authenticated")),
            "platforms_meta": [
                {
                    "id": p.value,
                    "label": PLATFORM_META[p]["label"],
                    "hint": PLATFORM_META[p]["hint"],
                    "configured": p.value in configured,
                }
                for p in Platform
            ],
            **extra,
        }

    # ---------- Pages ----------

    @app.get("/", response_class=HTMLResponse)
    async def home(request: Request):
        if not request.session.get("authenticated"):
            return RedirectResponse("/login", status_code=302)
        return RedirectResponse("/dashboard", status_code=302)

    @app.get("/login", response_class=HTMLResponse)
    async def login_page(request: Request):
        if request.session.get("authenticated"):
            return RedirectResponse("/dashboard", status_code=302)
        return TEMPLATES.TemplateResponse(
            request,
            "login.html",
            _ctx(request, error=request.query_params.get("error")),
        )

    @app.post("/login")
    async def login_submit(request: Request, password: str = Form(...)):
        if secrets.compare_digest(password, settings.web_password):
            request.session["authenticated"] = True
            return RedirectResponse("/dashboard", status_code=303)
        return RedirectResponse("/login?error=1", status_code=303)

    @app.post("/logout")
    async def logout(request: Request):
        request.session.clear()
        return RedirectResponse("/login", status_code=303)

    @app.get("/dashboard", response_class=HTMLResponse)
    async def dashboard(request: Request, auth: bool = Depends(require_auth)):
        jobs = service.db.list_jobs(limit=200)
        counts = {s.value: 0 for s in PublicationStatus}
        for job in jobs:
            counts[job.status] = counts.get(job.status, 0) + 1
        recent = [_job_row(j) for j in jobs[:12]]
        return TEMPLATES.TemplateResponse(
            request,
            "dashboard.html",
            _ctx(request, counts=counts, recent=recent, total=len(jobs)),
        )

    @app.get("/publish", response_class=HTMLResponse)
    async def publish_page(request: Request, auth: bool = Depends(require_auth)):
        return TEMPLATES.TemplateResponse(request, "publish.html", _ctx(request))

    @app.get("/jobs", response_class=HTMLResponse)
    async def jobs_page(request: Request, auth: bool = Depends(require_auth)):
        status_filter = request.query_params.get("status")
        st = PublicationStatus(status_filter) if status_filter else None
        jobs = [_job_row(j) for j in service.db.list_jobs(status=st, limit=200)]
        return TEMPLATES.TemplateResponse(
            request,
            "jobs.html",
            _ctx(request, jobs=jobs, status_filter=status_filter or ""),
        )

    @app.get("/platforms", response_class=HTMLResponse)
    async def platforms_page(request: Request, auth: bool = Depends(require_auth)):
        return TEMPLATES.TemplateResponse(request, "platforms.html", _ctx(request))

    # ---------- API ----------

    @app.get("/api/health")
    async def health():
        return {"ok": True, "brand": settings.web_brand_name}

    @app.get("/api/platforms")
    async def api_platforms(auth: bool = Depends(require_auth)):
        configured = {p.value for p in service.configured_platforms()}
        return [
            {
                "id": p.value,
                "label": PLATFORM_META[p]["label"],
                "configured": p.value in configured,
            }
            for p in Platform
        ]

    @app.get("/api/jobs")
    async def api_jobs(
        status_filter: str | None = None,
        limit: int = 100,
        auth: bool = Depends(require_auth),
    ):
        st = PublicationStatus(status_filter) if status_filter else None
        return [_job_row(j) for j in service.db.list_jobs(status=st, limit=limit)]

    @app.post("/api/publish")
    async def api_publish(
        request: Request,
        video: UploadFile = File(...),
        title: str = Form(...),
        description: str = Form(""),
        hashtags: str = Form(""),
        platforms: str = Form("vk,youtube,instagram,tiktok"),
        publish_at: str = Form(""),
        public_video_url: str = Form(""),
        cover_url: str = Form(""),
        vk_link: str = Form(""),
        sequential: str = Form(""),
        auth: bool = Depends(require_auth),
    ):
        if not video.filename:
            raise HTTPException(400, "Файл не выбран")

        suffix = Path(video.filename).suffix.lower() or ".mp4"
        safe_name = (
            f"{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_"
            f"{secrets.token_hex(4)}{suffix}"
        )
        dest = settings.upload_dir / safe_name
        with dest.open("wb") as out:
            shutil.copyfileobj(video.file, out)

        selected: list[Platform] = []
        for item in platforms.split(","):
            item = item.strip().lower()
            if not item:
                continue
            try:
                selected.append(Platform(item))
            except ValueError as exc:
                raise HTTPException(400, f"Неизвестная платформа: {item}") from exc

        dt = None
        if publish_at.strip():
            try:
                dt = datetime.fromisoformat(publish_at.replace("Z", "+00:00"))
            except ValueError as exc:
                raise HTTPException(400, "Некорректный publish_at (нужен ISO-8601)") from exc

        metadata = VideoMetadata(
            title=title.strip(),
            description=description.strip(),
            hashtags=hashtags,
            publish_at=dt,
            public_video_url=public_video_url.strip() or None,
            cover_url=cover_url.strip() or None,
            vk_link=vk_link.strip() or None,
        )
        pub_request = PublishRequest(
            video_path=dest,
            metadata=metadata,
            platforms=selected or list(Platform),
            parallel=not bool(sequential),
        )

        try:
            results = service.publish(pub_request)
        except Exception as exc:  # noqa: BLE001
            logger.exception("Publish failed")
            raise HTTPException(500, str(exc)) from exc

        payload = {
            "file": safe_name,
            "results": [r.model_dump(mode="json") for r in results],
        }

        # HTML-форма → редирект на jobs; fetch/API → JSON
        accept = request.headers.get("accept", "")
        if "application/json" in accept or request.headers.get("x-requested-with") == "fetch":
            return JSONResponse(payload)
        return RedirectResponse("/jobs?just=1", status_code=303)

    @app.post("/api/scheduler/run-once")
    async def api_scheduler_once(request: Request, auth: bool = Depends(require_auth)):
        n = scheduler.process_due_jobs()
        accept = request.headers.get("accept", "")
        if "application/json" in accept or request.headers.get("x-requested-with") == "fetch":
            return {"processed": n}
        return RedirectResponse(f"/jobs?ran={n}", status_code=303)

    return app


def run_web(settings: Settings | None = None) -> None:
    import uvicorn

    settings = settings or get_settings()
    uvicorn.run(
        "video_publisher.web.app:create_app",
        factory=True,
        host=settings.web_host,
        port=settings.web_port,
        reload=False,
        log_level=settings.log_level.lower(),
    )
