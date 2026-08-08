"""Унифицированная chunked/resumable загрузка с Content-Range и retry."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Callable

import httpx

from video_publisher.exceptions import NetworkRetryableError
from video_publisher.retry import retry_call

logger = logging.getLogger(__name__)

DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024  # 5 MB


def chunked_put_upload(
    upload_url: str,
    file_path: Path,
    *,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    content_type: str = "video/mp4",
    headers: dict[str, str] | None = None,
    client: httpx.Client | None = None,
    on_progress: Callable[[int, int], None] | None = None,
    max_attempts: int = 5,
) -> httpx.Response:
    """
    PUT чанками с заголовком Content-Range: bytes {start}-{end}/{total}.

    Используется YouTube resumable upload и TikTok FILE_UPLOAD.
    """
    owns_client = client is None
    client = client or httpx.Client(timeout=httpx.Timeout(120.0, connect=30.0))
    total = file_path.stat().st_size
    base_headers = dict(headers or {})
    last_response: httpx.Response | None = None

    try:
        with file_path.open("rb") as fh:
            start = 0
            while start < total:
                chunk = fh.read(chunk_size)
                if not chunk:
                    break
                end = start + len(chunk) - 1
                req_headers = {
                    **base_headers,
                    "Content-Type": content_type,
                    "Content-Length": str(len(chunk)),
                    "Content-Range": f"bytes {start}-{end}/{total}",
                }

                def _send(data: bytes = chunk, hdrs: dict[str, str] = req_headers) -> httpx.Response:
                    logger.debug(
                        "Chunk upload %s-%s/%s → %s",
                        start,
                        end,
                        total,
                        upload_url[:80],
                    )
                    resp = client.put(upload_url, content=data, headers=hdrs)
                    if resp.status_code in {408, 429} or resp.status_code >= 500:
                        raise NetworkRetryableError(
                            f"Chunk upload HTTP {resp.status_code}: {resp.text[:300]}",
                        )
                    # 308 Resume Incomplete — нормальный промежуточный ответ YouTube
                    if resp.status_code not in {200, 201, 204, 308}:
                        raise NetworkRetryableError(
                            f"Unexpected chunk status {resp.status_code}: {resp.text[:300]}",
                        )
                    return resp

                last_response = retry_call(_send, max_attempts=max_attempts)
                if on_progress:
                    on_progress(end + 1, total)
                start = end + 1

        if last_response is None:
            raise NetworkRetryableError("Пустой файл — нечего загружать")
        return last_response
    finally:
        if owns_client:
            client.close()
