from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from app.agent import SupportAgent, fingerprint_kb
from app.config import settings

ROOT = Path(__file__).resolve().parents[1]
STATIC = Path(__file__).resolve().parent / "static"

app = FastAPI(title=settings.app_name, version="1.0.0")
agent = SupportAgent()

if STATIC.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC)), name="static")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: str | None = None
    channel: str = "web"


@app.get("/", response_class=HTMLResponse)
def index() -> HTMLResponse:
    html = (STATIC / "index.html").read_text(encoding="utf-8")
    return HTMLResponse(html)


@app.get("/health")
def health() -> dict:
    return {
        "ok": True,
        "app": settings.app_name,
        "provider": agent.provider.name,
        "llm_enabled": agent.provider.enabled,
        "intents": len(agent.kb.intents),
        "kb_fingerprint": fingerprint_kb(settings.knowledge_path),
    }


@app.post("/api/chat")
def chat(req: ChatRequest) -> dict:
    return agent.reply(req.message, session_id=req.session_id, channel=req.channel)


@app.get("/api/intents")
def list_intents() -> dict:
    return {
        "count": len(agent.kb.intents),
        "intents": [{"id": i["id"], "name": i["name"], "variations": i["variations"][:5]} for i in agent.kb.intents],
    }


@app.post("/webhook/telegram")
async def telegram_webhook(request: Request) -> JSONResponse:
    """Telegram Bot API webhook. Set TELEGRAM_BOT_TOKEN and point webhook to /webhook/telegram."""
    if not settings.telegram_bot_token:
        raise HTTPException(503, "TELEGRAM_BOT_TOKEN not configured")
    payload = await request.json()
    message = payload.get("message") or payload.get("edited_message") or {}
    chat = message.get("chat") or {}
    chat_id = chat.get("id")
    text = message.get("text") or ""
    if not chat_id or not text:
        return JSONResponse({"ok": True})
    result = agent.reply(text, session_id=f"tg:{chat_id}", channel="telegram")
    # Send via Bot API
    import httpx

    async with httpx.AsyncClient(timeout=30) as client:
        await client.post(
            f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage",
            json={"chat_id": chat_id, "text": result["reply"]},
        )
    return JSONResponse({"ok": True, "intent_id": result.get("intent_id")})


@app.post("/webhook/max")
async def max_webhook(request: Request) -> JSONResponse:
    """MAX messenger webhook stub (platform-specific payload mapping).

    Configure MAX bot to POST messages here. Expected minimal JSON:
    {"user_id": "...", "text": "...", "secret": "..."}.
    """
    payload = await request.json()
    if settings.max_webhook_secret and payload.get("secret") != settings.max_webhook_secret:
        raise HTTPException(403, "bad secret")
    user_id = str(payload.get("user_id") or payload.get("chat_id") or "anon")
    text = payload.get("text") or payload.get("message") or ""
    if not text:
        return JSONResponse({"ok": True})
    result = agent.reply(text, session_id=f"max:{user_id}", channel="max")
    # Echo-style response for MAX adapter / middleware
    return JSONResponse(
        {
            "ok": True,
            "user_id": user_id,
            "text": result["reply"],
            "intent_id": result.get("intent_id"),
            "mode": result.get("mode"),
        }
    )


def run() -> None:
    import uvicorn

    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=settings.debug)


if __name__ == "__main__":
    run()
