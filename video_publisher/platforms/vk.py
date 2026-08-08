"""VK API: video.save → multipart upload (или импорт по link)."""

from __future__ import annotations

import logging
from pathlib import Path

import httpx

from video_publisher.exceptions import AuthError, PublisherError, ValidationError
from video_publisher.models import Platform, PlatformResult, PublicationStatus, VideoMetadata
from video_publisher.platforms.base import BasePlatformPublisher
from video_publisher.retry import with_retry

logger = logging.getLogger(__name__)

VK_API = "https://api.vk.com/method"


class VKPublisher(BasePlatformPublisher):
    platform = Platform.VK

    def is_configured(self) -> bool:
        return bool(self.settings.vk_access_token and self.settings.vk_group_id)

    def publish(self, video_path: Path, metadata: VideoMetadata) -> PlatformResult:
        if not self.is_configured():
            return self._fail(AuthError("VK_ACCESS_TOKEN / VK_GROUP_ID не заданы", platform="vk"))

        try:
            if metadata.vk_link:
                return self._publish_by_link(metadata)
            return self._publish_file(video_path, metadata)
        except PublisherError as exc:
            return self._fail(exc)
        except Exception as exc:  # noqa: BLE001
            return self._fail(exc)

    def _common_params(self) -> dict:
        return {
            "access_token": self.settings.vk_access_token,
            "v": self.settings.vk_api_version,
            "group_id": self.settings.vk_group_id,
        }

    def _video_save(self, metadata: VideoMetadata, *, link: str | None = None) -> dict:
        params = {
            **self._common_params(),
            "name": metadata.title[:128],
            "description": metadata.caption(max_len=5000),
        }
        if link:
            params["link"] = link

        logger.info(
            "[vk] video.save group_id=%s name=%r link=%s",
            self.settings.vk_group_id,
            metadata.title,
            bool(link),
        )
        resp = self._request("POST", f"{VK_API}/video.save", data=params)
        payload = resp.json()
        if "error" in payload:
            err = payload["error"]
            raise PublisherError(
                f"VK video.save error {err.get('error_code')}: {err.get('error_msg')}",
                platform="vk",
            )
        response = payload.get("response") or {}
        if not response.get("upload_url") and not link:
            raise PublisherError("VK video.save не вернул upload_url", platform="vk")
        logger.info(
            "[vk] video.save ok owner_id=%s video_id=%s",
            response.get("owner_id"),
            response.get("video_id"),
        )
        return response

    @with_retry(max_attempts=5, min_wait=2.0, max_wait=60.0)
    def _upload_file(self, upload_url: str, video_path: Path) -> dict:
        logger.info("[vk] uploading file %s → upload_url", video_path.name)
        try:
            with video_path.open("rb") as fh:
                files = {"video_file": (video_path.name, fh, "video/mp4")}
                resp = self.client.post(upload_url, files=files, timeout=600.0)
        except httpx.TransportError as exc:
            from video_publisher.exceptions import NetworkRetryableError

            raise NetworkRetryableError(str(exc), platform="vk") from exc

        if resp.status_code >= 500 or resp.status_code == 429:
            from video_publisher.exceptions import NetworkRetryableError

            raise NetworkRetryableError(
                f"VK upload HTTP {resp.status_code}: {resp.text[:300]}",
                platform="vk",
            )
        if resp.status_code >= 400:
            raise PublisherError(
                f"VK upload HTTP {resp.status_code}: {resp.text[:500]}",
                platform="vk",
            )
        data = resp.json()
        # Успешный ответ обычно содержит video_hash / size / owner_id / video_id
        if data.get("error_code") or data.get("error"):
            raise PublisherError(f"VK upload error: {data}", platform="vk")
        logger.info("[vk] upload complete keys=%s", list(data.keys()))
        return data

    def _publish_file(self, video_path: Path, metadata: VideoMetadata) -> PlatformResult:
        if video_path.suffix.lower() not in {".mp4", ".avi", ".mov", ".mpeg", ".mpg", ".3gp", ".flv", ".wmv"}:
            raise ValidationError(
                f"Неподдерживаемый формат для VK: {video_path.suffix}",
                platform="vk",
            )

        saved = self._video_save(metadata)
        upload_url = saved["upload_url"]
        upload_id = str(saved.get("video_id") or "")
        owner_id = saved.get("owner_id")
        video_id = saved.get("video_id")

        uploaded = self._upload_file(upload_url, video_path)
        # После upload video_id/owner_id могут прийти повторно
        owner_id = uploaded.get("owner_id", owner_id)
        video_id = uploaded.get("video_id", video_id)
        external_id = f"{owner_id}_{video_id}" if owner_id and video_id else str(video_id or "")
        url = f"https://vk.com/video{external_id}" if owner_id and video_id else None

        return self._result(
            PublicationStatus.PUBLISHED,
            external_id=external_id,
            upload_id=upload_id,
            url=url,
        )

    def _publish_by_link(self, metadata: VideoMetadata) -> PlatformResult:
        assert metadata.vk_link
        saved = self._video_save(metadata, link=metadata.vk_link)
        owner_id = saved.get("owner_id")
        video_id = saved.get("video_id")
        external_id = f"{owner_id}_{video_id}" if owner_id and video_id else None
        url = f"https://vk.com/video{external_id}" if external_id else None
        return self._result(
            PublicationStatus.PUBLISHED,
            external_id=external_id,
            upload_id=str(video_id) if video_id else None,
            url=url,
        )
