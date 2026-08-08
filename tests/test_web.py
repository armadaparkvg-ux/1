from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from video_publisher.config import Settings
from video_publisher.models import Platform, PlatformResult, PublicationStatus, VideoMetadata
from video_publisher.orchestrator import VideoPublisherService
from video_publisher.platforms.base import BasePlatformPublisher
from video_publisher.web.app import create_app


class OkPublisher(BasePlatformPublisher):
    platform = Platform.VK

    def __init__(self, settings, platform: Platform):
        super().__init__(settings)
        self.platform = platform

    def is_configured(self) -> bool:
        return True

    def publish(self, video_path: Path, metadata: VideoMetadata) -> PlatformResult:
        return self._result(PublicationStatus.PUBLISHED, external_id=f"{self.platform.value}-1")


@pytest.fixture
def web_client(tmp_path: Path):
    settings = Settings(
        database_url=f"sqlite:///{tmp_path / 'web.db'}",
        web_password="secret",
        web_secret_key="test-secret-key-32chars-minimum!!",
        web_brand_name="Test Publish",
        upload_dir=tmp_path / "uploads",
        vk_access_token="t",
        vk_group_id=1,
        youtube_token_file=tmp_path / "no-yt.json",
        youtube_client_secrets_file=tmp_path / "no-secrets.json",
        scheduler_poll_interval_seconds=3600,
    )
    settings.upload_dir.mkdir(parents=True, exist_ok=True)

    app = create_app(settings=settings)
    pubs = {
        Platform.VK: OkPublisher(settings, Platform.VK),
        Platform.YOUTUBE: OkPublisher(settings, Platform.YOUTUBE),
    }
    app.state.service.publishers = pubs
    # keep db/scheduler from create_app

    with TestClient(app) as client:
        yield client


def test_login_and_dashboard(web_client: TestClient):
    r = web_client.get("/dashboard", follow_redirects=False)
    assert r.status_code in {401, 302, 307} or r.status_code == 401

    bad = web_client.post("/login", data={"password": "wrong"}, follow_redirects=False)
    assert bad.status_code == 303
    assert "error=1" in bad.headers["location"]

    ok = web_client.post("/login", data={"password": "secret"}, follow_redirects=False)
    assert ok.status_code == 303
    assert "/dashboard" in ok.headers["location"]

    dash = web_client.get("/dashboard")
    assert dash.status_code == 200
    assert "Обзор публикаций" in dash.text
    assert "Test Publish" in dash.text


def test_publish_via_api(web_client: TestClient, tmp_path: Path):
    web_client.post("/login", data={"password": "secret"})
    video = tmp_path / "clip.mp4"
    video.write_bytes(b"\x00\x00\x00\x18ftypmp42" + b"0" * 500)

    resp = web_client.post(
        "/api/publish",
        data={
            "title": "Акция",
            "description": "Скидка",
            "hashtags": "такси",
            "platforms": "vk,youtube",
        },
        files={"video": ("clip.mp4", video.read_bytes(), "video/mp4")},
        headers={"accept": "application/json", "x-requested-with": "fetch"},
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert len(body["results"]) == 2
    assert all(r["status"] == "published" for r in body["results"])

    jobs = web_client.get("/api/jobs")
    assert jobs.status_code == 200
    assert len(jobs.json()) == 2


def test_platforms_page(web_client: TestClient):
    web_client.post("/login", data={"password": "secret"})
    page = web_client.get("/platforms")
    assert page.status_code == 200
    assert "VK Видео" in page.text
