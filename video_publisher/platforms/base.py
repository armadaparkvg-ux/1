"""Базовый интерфейс издателя и общий polling для container/init модели."""

from __future__ import annotations

import logging
import time
from abc import ABC, abstractmethod
from collections.abc import Callable
from pathlib import Path
from typing import Any

import httpx

from video_publisher.config import Settings
from video_publisher.exceptions import (
    NetworkRetryableError,
    ProcessingTimeoutError,
    PublisherError,
)
from video_publisher.models import Platform, PlatformResult, PublicationStatus, VideoMetadata
from video_publisher.retry import with_retry

logger = logging.getLogger(__name__)


class BasePlatformPublisher(ABC):
    platform: Platform

    def __init__(self, settings: Settings, http_client: httpx.Client | None = None):
        self.settings = settings
        self._owns_client = http_client is None
        self.client = http_client or httpx.Client(timeout=httpx.Timeout(120.0, connect=30.0))

    def close(self) -> None:
        if self._owns_client:
            self.client.close()

    @abstractmethod
    def is_configured(self) -> bool:
        ...

    @abstractmethod
    def publish(self, video_path: Path, metadata: VideoMetadata) -> PlatformResult:
        ...

    def check_quota(self) -> None:
        """Опциональная проверка квот перед батчем. По умолчанию no-op."""

    def supports_native_schedule(self) -> bool:
        return False

    def _result(
        self,
        status: PublicationStatus,
        *,
        external_id: str | None = None,
        container_id: str | None = None,
        publish_id: str | None = None,
        upload_id: str | None = None,
        url: str | None = None,
        error: str | None = None,
        error_code: str | None = None,
    ) -> PlatformResult:
        return PlatformResult(
            platform=self.platform,
            status=status,
            external_id=external_id,
            container_id=container_id,
            publish_id=publish_id,
            upload_id=upload_id,
            url=url,
            error=error,
            error_code=error_code,
        )

    def _fail(self, exc: Exception, **ids: Any) -> PlatformResult:
        code = type(exc).__name__
        logger.exception("[%s] publish failed: %s", self.platform.value, exc)
        return self._result(
            PublicationStatus.FAILED,
            error=str(exc),
            error_code=code,
            **ids,
        )

    @with_retry(max_attempts=5, min_wait=1.0, max_wait=30.0)
    def _request(
        self,
        method: str,
        url: str,
        *,
        expected: set[int] | None = None,
        **kwargs: Any,
    ) -> httpx.Response:
        expected = expected or {200, 201, 202, 204}
        try:
            resp = self.client.request(method, url, **kwargs)
        except httpx.TransportError as exc:
            raise NetworkRetryableError(str(exc), platform=self.platform.value) from exc

        if resp.status_code in {408, 429} or resp.status_code >= 500:
            raise NetworkRetryableError(
                f"HTTP {resp.status_code}: {resp.text[:400]}",
                platform=self.platform.value,
            )
        if resp.status_code not in expected:
            raise PublisherError(
                f"HTTP {resp.status_code}: {resp.text[:500]}",
                platform=self.platform.value,
            )
        return resp

    def poll_until(
        self,
        *,
        fetch_status: Callable[[], str],
        success_values: set[str],
        failure_values: set[str],
        timeout_seconds: float = 600.0,
        interval_seconds: float = 5.0,
        label: str = "status",
    ) -> str:
        """
        Общий поллинг для Instagram container и TikTok publish_id.

        fetch_status() → str (status_code / status)
        """
        deadline = time.monotonic() + timeout_seconds
        last = ""
        while time.monotonic() < deadline:
            last = fetch_status()
            logger.info("[%s] poll %s=%s", self.platform.value, label, last)
            if last in success_values:
                return last
            if last in failure_values:
                raise PublisherError(
                    f"{label} failed with status={last}",
                    platform=self.platform.value,
                )
            time.sleep(interval_seconds)
        raise ProcessingTimeoutError(
            f"Timeout waiting for {label}; last={last}",
            platform=self.platform.value,
        )
