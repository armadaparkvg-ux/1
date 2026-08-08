from __future__ import annotations

from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from video_publisher.models import (
    Platform,
    PlatformResult,
    PublicationStatus,
    PublishRequest,
    VideoMetadata,
)
from video_publisher.orchestrator import VideoPublisherService
from video_publisher.platforms.base import BasePlatformPublisher
from video_publisher.scheduler import PublicationScheduler


class FakePublisher(BasePlatformPublisher):
    platform = Platform.VK

    def __init__(self, settings, platform: Platform, *, native_schedule: bool = False):
        super().__init__(settings)
        self.platform = platform
        self._native = native_schedule
        self.calls = 0

    def is_configured(self) -> bool:
        return True

    def supports_native_schedule(self) -> bool:
        return self._native

    def publish(self, video_path: Path, metadata: VideoMetadata) -> PlatformResult:
        self.calls += 1
        return self._result(
            PublicationStatus.PUBLISHED,
            external_id=f"{self.platform.value}-ok",
        )


def test_immediate_parallel_publish(settings, tmp_video, db):
    pubs = {
        Platform.VK: FakePublisher(settings, Platform.VK),
        Platform.TIKTOK: FakePublisher(settings, Platform.TIKTOK),
    }
    service = VideoPublisherService(settings=settings, db=db, publishers=pubs)
    results = service.publish(
        PublishRequest(
            video_path=tmp_video,
            metadata=VideoMetadata(title="Сейчас"),
            platforms=[Platform.VK, Platform.TIKTOK],
            parallel=True,
        )
    )
    assert len(results) == 2
    assert all(r.status == PublicationStatus.PUBLISHED for r in results)
    assert pubs[Platform.VK].calls == 1
    assert pubs[Platform.TIKTOK].calls == 1
    jobs = db.list_jobs()
    assert len(jobs) == 2
    assert all(j.status == PublicationStatus.PUBLISHED.value for j in jobs)


def test_deferred_for_non_native_schedule(settings, tmp_video, db):
    future = datetime.now(timezone.utc) + timedelta(hours=2)
    pubs = {
        Platform.VK: FakePublisher(settings, Platform.VK),
        Platform.YOUTUBE: FakePublisher(settings, Platform.YOUTUBE, native_schedule=True),
    }
    service = VideoPublisherService(settings=settings, db=db, publishers=pubs)
    results = service.publish(
        PublishRequest(
            video_path=tmp_video,
            metadata=VideoMetadata(title="Позже", publish_at=future),
            platforms=[Platform.VK, Platform.YOUTUBE],
            parallel=False,
        )
    )
    by_platform = {r.platform: r for r in results}
    assert by_platform[Platform.VK].status == PublicationStatus.SCHEDULED
    assert by_platform[Platform.YOUTUBE].status == PublicationStatus.PUBLISHED
    assert pubs[Platform.VK].calls == 0
    assert pubs[Platform.YOUTUBE].calls == 1

    # Scheduler подхватывает due VK job (сдвигаем publish_at в прошлое)
    jobs = db.list_jobs(status=PublicationStatus.SCHEDULED)
    assert len(jobs) == 1
    with db.session() as session:
        job = session.get(type(jobs[0]), jobs[0].id)
        job.publish_at = datetime.now(timezone.utc) - timedelta(minutes=1)
        session.commit()

    sched = PublicationScheduler(service=service, settings=settings)
    n = sched.process_due_jobs()
    assert n == 1
    assert pubs[Platform.VK].calls == 1


def test_metadata_hashtags_normalize():
    m = VideoMetadata(title="t", hashtags="такси, акция #промо")
    assert m.hashtags == ["#такси", "#акция", "#промо"]
