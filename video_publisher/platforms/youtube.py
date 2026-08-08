"""YouTube Data API v3 — resumable upload (чанками по 5MB)."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from pathlib import Path

import httpx
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

from video_publisher.exceptions import AuthError, QuotaExceededError, PublisherError
from video_publisher.models import Platform, PlatformResult, PublicationStatus, VideoMetadata
from video_publisher.platforms.base import BasePlatformPublisher

logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
YOUTUBE_UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos"
CHUNK_SIZE = 5 * 1024 * 1024


class YouTubePublisher(BasePlatformPublisher):
    platform = Platform.YOUTUBE

    def is_configured(self) -> bool:
        return (
            self.settings.youtube_token_file.exists()
            or self.settings.youtube_client_secrets_file.exists()
        )

    def supports_native_schedule(self) -> bool:
        return True

    def _load_credentials(self) -> Credentials:
        token_path = self.settings.youtube_token_file
        secrets_path = self.settings.youtube_client_secrets_file
        creds: Credentials | None = None

        if token_path.exists():
            creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)

        if creds and creds.expired and creds.refresh_token:
            logger.info("[youtube] refreshing access token")
            creds.refresh(Request())
            token_path.parent.mkdir(parents=True, exist_ok=True)
            token_path.write_text(creds.to_json(), encoding="utf-8")

        if not creds or not creds.valid:
            if not secrets_path.exists():
                raise AuthError(
                    "Нужен youtube_token.json или youtube_client_secrets.json",
                    platform="youtube",
                )
            # Интерактивный flow — только для локальной первичной авторизации
            flow = InstalledAppFlow.from_client_secrets_file(str(secrets_path), SCOPES)
            creds = flow.run_local_server(port=0)
            token_path.parent.mkdir(parents=True, exist_ok=True)
            token_path.write_text(creds.to_json(), encoding="utf-8")

        return creds

    def publish(self, video_path: Path, metadata: VideoMetadata) -> PlatformResult:
        if not self.is_configured():
            return self._fail(AuthError("YouTube credentials не настроены", platform="youtube"))

        try:
            return self._resumable_upload(video_path, metadata)
        except QuotaExceededError as exc:
            return self._fail(exc)
        except PublisherError as exc:
            return self._fail(exc)
        except HttpError as exc:
            return self._fail(self._map_http_error(exc))
        except Exception as exc:  # noqa: BLE001
            return self._fail(exc)

    def _map_http_error(self, exc: HttpError) -> PublisherError:
        status = getattr(exc, "status_code", None) or getattr(exc.resp, "status", None)
        content = exc.content.decode("utf-8", errors="replace") if exc.content else str(exc)
        if status == 403 and ("quotaExceeded" in content or "dailyLimitExceeded" in content):
            return QuotaExceededError(
                "YouTube quota exceeded (10000 units/day, upload≈1600)",
                platform="youtube",
            )
        return PublisherError(f"YouTube API error {status}: {content[:500]}", platform="youtube")

    def _build_body(self, metadata: VideoMetadata) -> dict:
        privacy = metadata.youtube_privacy or self.settings.youtube_default_privacy
        category = metadata.youtube_category_id or self.settings.youtube_category_id
        tags = metadata.youtube_tags or [h.lstrip("#") for h in metadata.hashtags]

        status: dict = {"privacyStatus": privacy, "selfDeclaredMadeForKids": False}
        # Нативный шедулинг через publishAt (требует privacyStatus=private)
        if metadata.publish_at is not None:
            publish_at = metadata.publish_at
            if publish_at.tzinfo is None:
                publish_at = publish_at.replace(tzinfo=timezone.utc)
            if publish_at > datetime.now(timezone.utc):
                status["privacyStatus"] = "private"
                status["publishAt"] = publish_at.astimezone(timezone.utc).strftime(
                    "%Y-%m-%dT%H:%M:%S.000Z"
                )
                logger.info("[youtube] native schedule publishAt=%s", status["publishAt"])

        return {
            "snippet": {
                "title": metadata.title[:100],
                "description": metadata.youtube_description()[:5000],
                "tags": tags[:500],
                "categoryId": category,
            },
            "status": status,
        }

    def _resumable_upload(self, video_path: Path, metadata: VideoMetadata) -> PlatformResult:
        """
        Resumable upload через google-api-python-client MediaFileUpload.

        Эквивалент ручного flow:
          1) POST /upload/.../videos?uploadType=resumable → Location
          2) PUT Location чанками Content-Range
        """
        creds = self._load_credentials()
        youtube = build("youtube", "v3", credentials=creds, cache_discovery=False)
        body = self._build_body(metadata)

        media = MediaFileUpload(
            str(video_path),
            mimetype="video/mp4",
            chunksize=CHUNK_SIZE,
            resumable=True,
        )

        logger.info(
            "[youtube] start resumable upload file=%s size=%s",
            video_path.name,
            video_path.stat().st_size,
        )
        request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

        response = None
        upload_id: str | None = None
        while response is None:
            try:
                status, response = request.next_chunk()
            except HttpError as exc:
                raise self._map_http_error(exc) from exc

            if status:
                pct = int(status.progress() * 100)
                upload_id = getattr(status, "resumable_uri", None) or upload_id
                logger.info("[youtube] upload progress %s%% upload_uri=%s", pct, bool(upload_id))

        video_id = response.get("id")
        logger.info("[youtube] published video_id=%s", video_id)

        scheduled = bool(body["status"].get("publishAt"))
        return self._result(
            PublicationStatus.SCHEDULED if scheduled else PublicationStatus.PUBLISHED,
            external_id=video_id,
            upload_id=upload_id or video_id,
            url=f"https://youtube.com/shorts/{video_id}" if video_id else None,
        )

    def resumable_upload_raw(
        self,
        video_path: Path,
        metadata: VideoMetadata,
        *,
        access_token: str,
    ) -> PlatformResult:
        """
        Низкоуровневый resumable upload (для тестов / без google client).

        1. POST init → Location
        2. PUT чанками с Content-Range
        """
        from video_publisher.utils.chunked_upload import chunked_put_upload

        body = self._build_body(metadata)
        size = video_path.stat().st_size
        init_headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json; charset=UTF-8",
            "X-Upload-Content-Length": str(size),
            "X-Upload-Content-Type": "video/mp4",
        }
        init_url = f"{YOUTUBE_UPLOAD_URL}?uploadType=resumable&part=snippet,status"
        logger.info("[youtube] raw init resumable upload size=%s", size)
        resp = self._request("POST", init_url, headers=init_headers, json=body, expected={200})
        upload_uri = resp.headers.get("Location")
        if not upload_uri:
            raise PublisherError("YouTube не вернул Location (upload URI)", platform="youtube")
        logger.info("[youtube] upload_uri получен")

        put_headers = {"Authorization": f"Bearer {access_token}"}
        final = chunked_put_upload(
            upload_uri,
            video_path,
            chunk_size=CHUNK_SIZE,
            content_type="video/mp4",
            headers=put_headers,
            client=self.client,
        )
        data = final.json() if final.content else {}
        video_id = data.get("id")
        scheduled = bool(body["status"].get("publishAt"))
        return self._result(
            PublicationStatus.SCHEDULED if scheduled else PublicationStatus.PUBLISHED,
            external_id=video_id,
            upload_id=upload_uri,
            url=f"https://youtube.com/shorts/{video_id}" if video_id else None,
        )
