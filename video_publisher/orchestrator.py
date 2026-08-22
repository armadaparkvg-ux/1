"""Оркестратор: параллельная/последовательная публикация на все площадки."""

from __future__ import annotations

import logging
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

from video_publisher.config import Settings, get_settings
from video_publisher.db import Database
from video_publisher.exceptions import PublisherError, RateLimitError, QuotaExceededError
from video_publisher.models import (
    Platform,
    PlatformResult,
    PublicationStatus,
    PublishRequest,
    VideoMetadata,
)
from video_publisher.platforms.base import BasePlatformPublisher
from video_publisher.platforms.instagram import InstagramPublisher
from video_publisher.platforms.tiktok import TikTokPublisher
from video_publisher.platforms.vk import VKPublisher
from video_publisher.platforms.youtube import YouTubePublisher

logger = logging.getLogger(__name__)


class VideoPublisherService:
    """Единый сервис публикации на VK / YouTube / Instagram / TikTok."""

    def __init__(
        self,
        settings: Settings | None = None,
        db: Database | None = None,
        publishers: dict[Platform, BasePlatformPublisher] | None = None,
    ):
        self.settings = settings or get_settings()
        self.db = db or Database(self.settings.database_url)
        self.publishers = publishers or self._default_publishers()

    def _default_publishers(self) -> dict[Platform, BasePlatformPublisher]:
        return {
            Platform.VK: VKPublisher(self.settings),
            Platform.YOUTUBE: YouTubePublisher(self.settings),
            Platform.INSTAGRAM: InstagramPublisher(self.settings),
            Platform.TIKTOK: TikTokPublisher(self.settings),
        }

    def close(self) -> None:
        for pub in self.publishers.values():
            pub.close()

    def configured_platforms(self) -> list[Platform]:
        return [p for p, pub in self.publishers.items() if pub.is_configured()]

    def publish(self, request: PublishRequest) -> list[PlatformResult]:
        """
        Публикует видео на выбранные платформы.

        - YouTube: нативный publishAt
        - Instagram: свой scheduler (отложенный старт + внутренний poll container)
        - VK / TikTok: свой scheduler (нет нативного шедулинга)
        """
        platforms = [p for p in request.platforms if p in self.publishers]
        missing = [p for p in platforms if not self.publishers[p].is_configured()]
        if missing:
            logger.warning("Платформы без конфигурации будут пропущены: %s", missing)
            platforms = [p for p in platforms if p not in missing]

        if not platforms:
            raise PublisherError("Нет ни одной настроенной платформы для публикации")

        batch_id = uuid.uuid4().hex
        now = datetime.now(timezone.utc)
        publish_at = request.metadata.publish_at
        if publish_at and publish_at.tzinfo is None:
            publish_at = publish_at.replace(tzinfo=timezone.utc)
            request.metadata.publish_at = publish_at

        # Разделяем: что публикуем сразу, что кладём в очередь
        immediate: list[Platform] = []
        deferred: list[Platform] = []
        for platform in platforms:
            pub = self.publishers[platform]
            if publish_at and publish_at > now and not pub.supports_native_schedule():
                deferred.append(platform)
            else:
                immediate.append(platform)

        results: list[PlatformResult] = []

        if deferred:
            jobs = self.db.create_jobs(
                batch_id=batch_id,
                video_path=str(request.video_path),
                title=request.metadata.title,
                description=request.metadata.description,
                hashtags=" ".join(request.metadata.hashtags),
                platforms=deferred,
                publish_at=publish_at,
                public_video_url=request.metadata.public_video_url,
                initial_status=PublicationStatus.SCHEDULED,
            )
            for job in jobs:
                logger.info(
                    "[scheduler] job_id=%s platform=%s scheduled_at=%s",
                    job.id,
                    job.platform,
                    job.publish_at,
                )
                results.append(
                    PlatformResult(
                        platform=Platform(job.platform),
                        status=PublicationStatus.SCHEDULED,
                    )
                )

        if not immediate:
            return results

        # Предпроверка квот (Instagram и т.п.)
        for platform in immediate:
            try:
                self.publishers[platform].check_quota()
            except (RateLimitError, QuotaExceededError) as exc:
                logger.error("[%s] quota/limit: %s", platform.value, exc)
                results.append(
                    PlatformResult(
                        platform=platform,
                        status=PublicationStatus.FAILED,
                        error=str(exc),
                        error_code=type(exc).__name__,
                    )
                )
                immediate = [p for p in immediate if p != platform]

        jobs = self.db.create_jobs(
            batch_id=batch_id,
            video_path=str(request.video_path),
            title=request.metadata.title,
            description=request.metadata.description,
            hashtags=" ".join(request.metadata.hashtags),
            platforms=immediate,
            publish_at=publish_at if (publish_at and any(
                self.publishers[p].supports_native_schedule() for p in immediate
            )) else None,
            public_video_url=request.metadata.public_video_url,
            initial_status=PublicationStatus.PENDING,
        )
        job_by_platform = {Platform(j.platform): j for j in jobs}

        def run_one(platform: Platform) -> PlatformResult:
            job = job_by_platform[platform]
            self.db.update_job(
                job.id,
                status=PublicationStatus.UPLOADING,
                increment_attempts=True,
            )
            logger.info(
                "[%s] start publish job_id=%s batch_id=%s file=%s",
                platform.value,
                job.id,
                batch_id,
                request.video_path.name,
            )
            result = self.publishers[platform].publish(request.video_path, request.metadata)
            self.db.update_job(
                job.id,
                status=result.status,
                external_id=result.external_id,
                container_id=result.container_id,
                publish_id=result.publish_id,
                upload_id=result.upload_id,
                result_url=result.url,
                error=result.error,
                error_code=result.error_code,
            )
            logger.info(
                "[%s] done status=%s external_id=%s container_id=%s publish_id=%s",
                platform.value,
                result.status.value,
                result.external_id,
                result.container_id,
                result.publish_id,
            )
            return result

        if request.parallel and len(immediate) > 1:
            with ThreadPoolExecutor(max_workers=len(immediate)) as pool:
                futures = {pool.submit(run_one, p): p for p in immediate}
                for fut in as_completed(futures):
                    results.append(fut.result())
        else:
            for platform in immediate:
                results.append(run_one(platform))

        return results

    def publish_job(self, job_id: int) -> PlatformResult:
        """Публикация отложенной задачи из БД (вызывается шедулером)."""
        with self.db.session() as session:
            from video_publisher.db import PublicationJob

            job = session.get(PublicationJob, job_id)
            if not job:
                raise PublisherError(f"Job {job_id} не найден")
            platform = Platform(job.platform)
            video_path = Path(job.video_path)
            metadata = VideoMetadata(
                title=job.title,
                description=job.description,
                hashtags=job.hashtags.split() if job.hashtags else [],
                public_video_url=job.public_video_url,
                publish_at=None,  # уже due — публикуем сейчас
            )

        if platform not in self.publishers or not self.publishers[platform].is_configured():
            result = PlatformResult(
                platform=platform,
                status=PublicationStatus.FAILED,
                error="Платформа не сконфигурирована",
                error_code="NotConfigured",
            )
            self.db.update_job(job_id, status=result.status, error=result.error, error_code=result.error_code)
            return result

        self.db.update_job(job_id, status=PublicationStatus.UPLOADING, increment_attempts=True)
        # Для отложенных Instagram — свой поллинг container внутри publish()
        result = self.publishers[platform].publish(video_path, metadata)
        self.db.update_job(
            job_id,
            status=result.status,
            external_id=result.external_id,
            container_id=result.container_id,
            publish_id=result.publish_id,
            upload_id=result.upload_id,
            result_url=result.url,
            error=result.error,
            error_code=result.error_code,
        )
        return result
