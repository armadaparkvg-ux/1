from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(ROOT / ".env"), env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Park Armada Support AI"
    host: str = "0.0.0.0"
    port: int = 8080
    debug: bool = True

    knowledge_path: str = str(ROOT / "knowledge" / "intents.json")
    site_facts_path: str = str(ROOT / "knowledge" / "site_facts.md")

    # OpenAI-compatible API (OpenAI, DeepSeek, Ollama, etc.)
    # Default: local Ollama — works without cloud API keys
    llm_api_key: str = "ollama"
    llm_base_url: str = "http://127.0.0.1:11434/v1"
    llm_model: str = "qwen2.5:3b"
    # Alternatives via env:
    # DeepSeek: LLM_BASE_URL=https://api.deepseek.com LLM_MODEL=deepseek-chat LLM_API_KEY=sk-...
    # OpenAI:   LLM_BASE_URL=https://api.openai.com/v1 LLM_MODEL=gpt-4o-mini LLM_API_KEY=sk-...
    polish_with_llm: bool = False
    intent_threshold: float = 0.35

    telegram_bot_token: str = ""
    max_webhook_secret: str = ""

    public_base_url: str = "http://127.0.0.1:8080"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
