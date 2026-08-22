"""Instagram Graph API — Reels (container → poll → publish)."""

from __future__ import annotations

import logging
from pathlib import Path

from video_publisher.exceptions import (
    AuthError,
    PublisherError,
    RateLimitError,
    ValidationError,
)
from video_publisher.models import Platform, PlatformResult, PublicationStatus, VideoMetadata
from video_publisher.platforms.base import BasePlatformPublisher

logger = logging.getLogger(__name__)


class InstagramPublisher(BasePlatformPublisher):
    platform = Platform.INSTAGRAM

    @property
    def _base(self) -> str:
        return f"https://graph.facebook.com/{self.settings.instagram_api_version}"

    def is_configured(self) -> bool:
        return bool(self.settings.instagram_access_token and self.settings.instagram_ig_user_id)

    def check_quota(self) -> None:
        """Проверка content_publishing_limit перед батч-публикацией."""
        if not self.is_configured():
            return
        ig_user = self.settings.instagram_ig_user_id
        url = f"{self._base}/{ig_user}/content_publishing_limit"
        params = {
            "fields": "quota_usage,config",
            "access_token": self.settings.instagram_access_token,
        }
        resp = self._request("GET", url, params=params)
        data = resp.json()
        items = data.get("data") or []
        if not items:
            logger.warning("[instagram] content_publishing_limit пустой ответ: %s", data)
            return

        info = items[0]
        usage = int(info.get("quota_usage") or 0)
        config = info.get("config") or {}
        quota_total = int(config.get("quota_total") or 25)
        logger.info(
            "[instagram] publishing quota usage=%s/%s (24h)",
            usage,
            quota_total,
        )
        if usage >= quota_total:
            raise RateLimitError(
                f"Instagram rate limit: {usage}/{quota_total} постов за 24ч",
                platform="instagram",
                retry_after_seconds=3600,
            )

    def publish(self, video_path: Path, metadata: VideoMetadata) -> PlatformResult:
        if not self.is_configured():
            return self._fail(
                AuthError("INSTAGRAM_ACCESS_TOKEN / INSTAGRAM_IG_USER_ID не заданы", platform="instagram")
            )

        container_id: str | None = None
        try:
            self.check_quota()
            video_url = self._resolve_video_url(video_path, metadata)
            container_id = self._create_container(video_url, metadata)
            self._wait_container(container_id)
            media_id = self._publish_container(container_id)
            return self._result(
                PublicationStatus.PUBLISHED,
                external_id=media_id,
                container_id=container_id,
                url=f"https://www.instagram.com/reel/{media_id}/" if media_id else None,
            )
        except PublisherError as exc:
            return self._fail(exc, container_id=container_id)
        except Exception as exc:  # noqa: BLE001
            return self._fail(exc, container_id=container_id)

    def _resolve_video_url(self, video_path: Path, metadata: VideoMetadata) -> str:
        if metadata.public_video_url:
            return metadata.public_video_url
        base = (self.settings.public_video_base_url or "").rstrip("/")
        if base:
            return f"{base}/{video_path.name}"
        raise ValidationError(
            "Instagram требует публичный HTTPS video_url "
            "(задайте metadata.public_video_url или PUBLIC_VIDEO_BASE_URL)",
            platform="instagram",
        )

    def _create_container(self, video_url: str, metadata: VideoMetadata) -> str:
        ig_user = self.settings.instagram_ig_user_id
        url = f"{self._base}/{ig_user}/media"
        data = {
            "media_type": "REELS",
            "video_url": video_url,
            "caption": metadata.caption(max_len=2200),
            "share_to_feed": "true",
            "access_token": self.settings.instagram_access_token,
        }
        if metadata.cover_url:
            data["cover_url"] = metadata.cover_url

        logger.info("[instagram] create media container video_url=%s", video_url)
        resp = self._request("POST", url, data=data)
        payload = resp.json()
        if "error" in payload:
            self._raise_graph_error(payload["error"])
        container_id = payload.get("id")
        if not container_id:
            raise PublisherError(f"Нет container id в ответе: {payload}", platform="instagram")
        logger.info("[instagram] container_id=%s", container_id)
        return str(container_id)

    def _wait_container(self, container_id: str) -> None:
        def fetch() -> str:
            url = f"{self._base}/{container_id}"
            params = {
                "fields": "status_code,status",
                "access_token": self.settings.instagram_access_token,
            }
            resp = self._request("GET", url, params=params)
            payload = resp.json()
            if "error" in payload:
                self._raise_graph_error(payload["error"])
            return str(payload.get("status_code") or payload.get("status") or "UNKNOWN")

        self.poll_until(
            fetch_status=fetch,
            success_values={"FINISHED"},
            failure_values={"ERROR", "EXPIRED"},
            timeout_seconds=600.0,
            interval_seconds=5.0,
            label="container_status",
        )

    def _publish_container(self, container_id: str) -> str:
        ig_user = self.settings.instagram_ig_user_id
        url = f"{self._base}/{ig_user}/media_publish"
        data = {
            "creation_id": container_id,
            "access_token": self.settings.instagram_access_token,
        }
        logger.info("[instagram] media_publish creation_id=%s", container_id)
        resp = self._request("POST", url, data=data)
        payload = resp.json()
        if "error" in payload:
            self._raise_graph_error(payload["error"])
        media_id = payload.get("id")
        if not media_id:
            raise PublisherError(f"Нет media id: {payload}", platform="instagram")
        logger.info("[instagram] published media_id=%s", media_id)
        return str(media_id)

    def _raise_graph_error(self, error: dict) -> None:
        code = error.get("code")
        subcode = error.get("error_subcode")
        message = error.get("message", "unknown")
        # 4 / 17 / 32 / 613 — типичные rate limit / spam
        if code in {4, 17, 32, 613} or "rate limit" in message.lower():
            raise RateLimitError(
                f"Instagram rate limit: {message} (code={code}, subcode={subcode})",
                platform="instagram",
            )
        raise PublisherError(
            f"Instagram Graph error code={code} subcode={subcode}: {message}",
            platform="instagram",
        )
