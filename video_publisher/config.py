"""Конфигурация из .env (секреты не хардкодятся)."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = "sqlite:///./data/publications.db"
    log_level: str = "INFO"
    public_video_base_url: str = ""

    # VK
    vk_access_token: str = ""
    vk_group_id: int | None = None
    vk_api_version: str = "5.199"

    # YouTube
    youtube_client_secrets_file: Path = Path("./secrets/youtube_client_secrets.json")
    youtube_token_file: Path = Path("./secrets/youtube_token.json")
    youtube_category_id: str = "22"
    youtube_default_privacy: str = "public"

    # Instagram
    instagram_access_token: str = ""
    instagram_ig_user_id: str = ""
    instagram_api_version: str = "v21.0"

    # TikTok
    tiktok_access_token: str = ""
    tiktok_open_id: str = ""
    tiktok_privacy_level: str = "PUBLIC_TO_EVERYONE"
    # TikTok рекомендует ≥5MB; для тестов/маленьких роликов допускаем меньше
    tiktok_chunk_size: int = Field(default=5_242_880, ge=1024)

    # Scheduler
    scheduler_poll_interval_seconds: int = 30
    scheduler_timezone: str = "Europe/Moscow"

    def enabled_platforms(self) -> list[str]:
        enabled: list[str] = []
        if self.vk_access_token and self.vk_group_id:
            enabled.append("vk")
        if self.youtube_token_file.exists() or self.youtube_client_secrets_file.exists():
            enabled.append("youtube")
        if self.instagram_access_token and self.instagram_ig_user_id:
            enabled.append("instagram")
        if self.tiktok_access_token:
            enabled.append("tiktok")
        return enabled


@lru_cache
def get_settings() -> Settings:
    return Settings()
