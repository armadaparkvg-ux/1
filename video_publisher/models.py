"""Доменные модели и статусы публикаций."""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Sequence

from pydantic import BaseModel, Field, field_validator


class Platform(str, Enum):
    VK = "vk"
    YOUTUBE = "youtube"
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"


class PublicationStatus(str, Enum):
    PENDING = "pending"
    SCHEDULED = "scheduled"
    UPLOADING = "uploading"
    PROCESSING = "processing"
    PUBLISHED = "published"
    FAILED = "failed"
    CANCELLED = "cancelled"


class VideoMetadata(BaseModel):
    """Метаданные ролика для всех площадок."""

    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=5000)
    hashtags: list[str] = Field(default_factory=list)
    publish_at: datetime | None = None
    cover_url: str | None = None
    # Публичный URL видео (нужен Instagram; опционально VK link-import)
    public_video_url: str | None = None
    # YouTube
    youtube_tags: list[str] | None = None
    youtube_privacy: str | None = None
    youtube_category_id: str | None = None
    # TikTok
    tiktok_privacy_level: str | None = None
    disable_duet: bool = False
    disable_comment: bool = False
    disable_stitch: bool = False
    # VK
    vk_link: str | None = None  # импорт с YouTube без прямой загрузки

    @field_validator("hashtags", mode="before")
    @classmethod
    def normalize_hashtags(cls, value: Sequence[str] | str | None) -> list[str]:
        if value is None:
            return []
        if isinstance(value, str):
            parts = [p.strip() for p in value.replace(",", " ").split()]
            return [p if p.startswith("#") else f"#{p}" for p in parts if p]
        return [h if h.startswith("#") else f"#{h}" for h in value if h]

    def caption(self, *, max_len: int | None = None) -> str:
        tags = " ".join(self.hashtags)
        parts = [p for p in (self.title, self.description, tags) if p]
        text = "\n\n".join(parts)
        if max_len and len(text) > max_len:
            return text[: max_len - 1].rstrip() + "…"
        return text

    def youtube_description(self) -> str:
        tags = " ".join(self.hashtags)
        parts = [p for p in (self.description, tags) if p]
        return "\n\n".join(parts)


class PublishRequest(BaseModel):
    video_path: Path
    metadata: VideoMetadata
    platforms: list[Platform] = Field(
        default_factory=lambda: list(Platform),
    )
    parallel: bool = True

    @field_validator("video_path")
    @classmethod
    def video_must_exist(cls, path: Path) -> Path:
        path = Path(path)
        if not path.is_file():
            raise ValueError(f"Видеофайл не найден: {path}")
        return path.resolve()


class PlatformResult(BaseModel):
    platform: Platform
    status: PublicationStatus
    external_id: str | None = None
    container_id: str | None = None
    publish_id: str | None = None
    upload_id: str | None = None
    url: str | None = None
    error: str | None = None
    error_code: str | None = None
