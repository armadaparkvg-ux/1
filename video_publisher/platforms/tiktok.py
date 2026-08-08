"""TikTok Content Posting API — init → chunked PUT → status poll."""

from __future__ import annotations

import logging
import math
from pathlib import Path

from video_publisher.exceptions import (
    AuditRestrictionError,
    AuthError,
    PublisherError,
    RateLimitError,
)
from video_publisher.models import Platform, PlatformResult, PublicationStatus, VideoMetadata
from video_publisher.platforms.base import BasePlatformPublisher
from video_publisher.utils.chunked_upload import chunked_put_upload

logger = logging.getLogger(__name__)

TIKTOK_API = "https://open.tiktokapis.com"


class TikTokPublisher(BasePlatformPublisher):
    platform = Platform.TIKTOK

    def is_configured(self) -> bool:
        return bool(self.settings.tiktok_access_token)

    def publish(self, video_path: Path, metadata: VideoMetadata) -> PlatformResult:
        if not self.is_configured():
            return self._fail(AuthError("TIKTOK_ACCESS_TOKEN не задан", platform="tiktok"))

        publish_id: str | None = None
        upload_url: str | None = None
        try:
            init = self._init_upload(video_path, metadata)
            publish_id = init["publish_id"]
            upload_url = init["upload_url"]
            logger.info(
                "[tiktok] init ok publish_id=%s upload_url_expires≈1h",
                publish_id,
            )
            self._upload_chunks(upload_url, video_path)
            self._wait_publish(publish_id)
            return self._result(
                PublicationStatus.PUBLISHED,
                publish_id=publish_id,
                upload_id=upload_url,
                external_id=publish_id,
            )
        except PublisherError as exc:
            return self._fail(exc, publish_id=publish_id, upload_id=upload_url)
        except Exception as exc:  # noqa: BLE001
            return self._fail(exc, publish_id=publish_id, upload_id=upload_url)

    def _auth_headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.settings.tiktok_access_token}",
            "Content-Type": "application/json; charset=UTF-8",
        }

    def _init_upload(self, video_path: Path, metadata: VideoMetadata) -> dict:
        size = video_path.stat().st_size
        chunk_size = self.settings.tiktok_chunk_size
        total_chunks = max(1, math.ceil(size / chunk_size))
        privacy = metadata.tiktok_privacy_level or self.settings.tiktok_privacy_level

        body = {
            "post_info": {
                "title": metadata.title[:150],
                "privacy_level": privacy,
                "disable_duet": metadata.disable_duet,
                "disable_comment": metadata.disable_comment,
                "disable_stitch": metadata.disable_stitch,
            },
            "source_info": {
                "source": "FILE_UPLOAD",
                "video_size": size,
                "chunk_size": chunk_size,
                "total_chunk_count": total_chunks,
            },
        }
        logger.info(
            "[tiktok] POST /v2/post/publish/video/init/ size=%s chunks=%s privacy=%s",
            size,
            total_chunks,
            privacy,
        )
        resp = self._request(
            "POST",
            f"{TIKTOK_API}/v2/post/publish/video/init/",
            headers=self._auth_headers(),
            json=body,
            expected={200},
        )
        payload = resp.json()
        self._raise_if_error(payload)

        data = payload.get("data") or {}
        publish_id = data.get("publish_id")
        upload_url = data.get("upload_url")
        if not publish_id or not upload_url:
            raise PublisherError(f"TikTok init неполный ответ: {payload}", platform="tiktok")
        return {"publish_id": str(publish_id), "upload_url": str(upload_url)}

    def _upload_chunks(self, upload_url: str, video_path: Path) -> None:
        logger.info("[tiktok] chunked PUT upload → %s...", upload_url[:64])

        def on_progress(done: int, total: int) -> None:
            logger.info("[tiktok] upload %s/%s (%.0f%%)", done, total, 100.0 * done / total)

        chunked_put_upload(
            upload_url,
            video_path,
            chunk_size=self.settings.tiktok_chunk_size,
            content_type="video/mp4",
            client=self.client,
            on_progress=on_progress,
        )
        logger.info("[tiktok] chunk upload finished")

    def _wait_publish(self, publish_id: str) -> None:
        def fetch() -> str:
            resp = self._request(
                "POST",
                f"{TIKTOK_API}/v2/post/publish/status/fetch/",
                headers=self._auth_headers(),
                json={"publish_id": publish_id},
                expected={200},
            )
            payload = resp.json()
            self._raise_if_error(payload)
            status = (payload.get("data") or {}).get("status") or "UNKNOWN"
            return str(status)

        self.poll_until(
            fetch_status=fetch,
            success_values={"PUBLISH_COMPLETE"},
            failure_values={"FAILED", "PUBLISH_COMPLETE_BUT_DOWNLOAD_FAILED"},
            timeout_seconds=900.0,
            interval_seconds=5.0,
            label="publish_status",
        )

    def _raise_if_error(self, payload: dict) -> None:
        error = payload.get("error") or {}
        code = str(error.get("code") or "")
        message = error.get("message") or ""
        if not code or code in {"ok", "0"}:
            return

        lower = f"{code} {message}".lower()
        if "unaudited" in lower or "self_only" in lower or "audit" in lower:
            raise AuditRestrictionError(
                "TikTok audit restriction: до аудита приложения публикуйте только как SELF_ONLY. "
                f"{message}",
            )
        if "rate_limit" in lower or code in {"rate_limit_exceeded", "spam_risk"}:
            raise RateLimitError(
                f"TikTok rate limit: {code} {message}",
                platform="tiktok",
            )
        raise PublisherError(f"TikTok API error {code}: {message}", platform="tiktok")
