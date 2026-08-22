from __future__ import annotations

from pathlib import Path

import pytest

from video_publisher.config import Settings
from video_publisher.db import Database


@pytest.fixture
def tmp_video(tmp_path: Path) -> Path:
    path = tmp_path / "promo.mp4"
    # Небольшой «фейковый» mp4-подобный файл для upload-тестов
    path.write_bytes(b"\x00\x00\x00\x18ftypmp42" + b"\x00" * 2048)
    return path


@pytest.fixture
def settings(tmp_path: Path) -> Settings:
    db_path = tmp_path / "test.db"
    return Settings(
        database_url=f"sqlite:///{db_path}",
        log_level="DEBUG",
        public_video_base_url="https://cdn.example.com/videos",
        vk_access_token="vk-test-token",
        vk_group_id=123456,
        instagram_access_token="ig-test-token",
        instagram_ig_user_id="17841400000000000",
        tiktok_access_token="tt-test-token",
        tiktok_privacy_level="SELF_ONLY",
        tiktok_chunk_size=1024,
        youtube_token_file=tmp_path / "missing_yt_token.json",
        youtube_client_secrets_file=tmp_path / "missing_yt_secrets.json",
    )


@pytest.fixture
def db(settings: Settings) -> Database:
    return Database(settings.database_url)
