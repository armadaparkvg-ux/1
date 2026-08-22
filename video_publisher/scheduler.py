"""Планировщик отложенных публикаций (TikTok, VK, Instagram).

YouTube использует нативный publishAt — в очередь не попадает.
Instagram: задача стартует по расписанию, дальше внутренний poll container.
"""

from __future__ import annotations

import logging
import signal
import time
from datetime import datetime, timezone

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

from video_publisher.config import Settings, get_settings
from video_publisher.models import PublicationStatus
from video_publisher.orchestrator import VideoPublisherService

logger = logging.getLogger(__name__)


class PublicationScheduler:
    def __init__(
        self,
        service: VideoPublisherService | None = None,
        settings: Settings | None = None,
    ):
        self.settings = settings or get_settings()
        self.service = service or VideoPublisherService(settings=self.settings)
        self.scheduler = BackgroundScheduler(timezone=self.settings.scheduler_timezone)

    def process_due_jobs(self) -> int:
        due = self.service.db.get_due_jobs(now=datetime.now(timezone.utc))
        if not due:
            return 0
        logger.info("Found %s due publication job(s)", len(due))
        processed = 0
        for job in due:
            logger.info(
                "Processing scheduled job_id=%s platform=%s publish_at=%s",
                job.id,
                job.platform,
                job.publish_at,
            )
            try:
                result = self.service.publish_job(job.id)
                logger.info(
                    "Job %s → %s error=%s",
                    job.id,
                    result.status.value,
                    result.error,
                )
            except Exception:  # noqa: BLE001
                logger.exception("Failed processing job_id=%s", job.id)
                self.service.db.update_job(
                    job.id,
                    status=PublicationStatus.FAILED,
                    error="Unhandled scheduler exception",
                    error_code="SchedulerError",
                )
            processed += 1
        return processed

    def start(self, *, blocking: bool = True) -> None:
        interval = self.settings.scheduler_poll_interval_seconds
        self.scheduler.add_job(
            self.process_due_jobs,
            trigger=IntervalTrigger(seconds=interval),
            id="process_due_publications",
            replace_existing=True,
            max_instances=1,
            coalesce=True,
        )
        self.scheduler.start()
        logger.info(
            "Scheduler started: poll every %ss, tz=%s",
            interval,
            self.settings.scheduler_timezone,
        )
        if not blocking:
            return

        stop = False

        def _stop(*_args) -> None:
            nonlocal stop
            stop = True

        signal.signal(signal.SIGINT, _stop)
        signal.signal(signal.SIGTERM, _stop)
        try:
            while not stop:
                time.sleep(1)
        finally:
            self.shutdown()

    def shutdown(self) -> None:
        if self.scheduler.running:
            self.scheduler.shutdown(wait=False)
        self.service.close()
        logger.info("Scheduler stopped")


def run_scheduler(settings: Settings | None = None) -> None:
    PublicationScheduler(settings=settings).start(blocking=True)
