from __future__ import annotations

from pathlib import Path

import httpx
import pytest
import respx

from video_publisher.exceptions import NetworkRetryableError
from video_publisher.retry import backoff_seconds, retry_call
from video_publisher.utils.chunked_upload import chunked_put_upload


def test_backoff_increases():
    a1 = backoff_seconds(1, base=2, cap=100)
    a3 = backoff_seconds(3, base=2, cap=100)
    assert 0 < a1 <= 4
    assert a3 >= a1 * 0.5  # jitter, но порядок величины растёт


def test_retry_call_succeeds_after_failures():
    state = {"n": 0}

    def flaky():
        state["n"] += 1
        if state["n"] < 3:
            raise NetworkRetryableError("temp")
        return "ok"

    assert retry_call(flaky, max_attempts=5, min_wait=0.01, max_wait=0.05) == "ok"
    assert state["n"] == 3


@respx.mock
def test_chunked_put_upload_with_retry(tmp_path: Path):
    path = tmp_path / "v.mp4"
    path.write_bytes(b"x" * 2500)

    calls = {"n": 0}

    def side_effect(request: httpx.Request) -> httpx.Response:
        calls["n"] += 1
        if calls["n"] == 1:
            return httpx.Response(500, text="boom")
        return httpx.Response(200, json={"ok": True})

    respx.put("https://upload.example/video").mock(side_effect=side_effect)

    resp = chunked_put_upload(
        "https://upload.example/video",
        path,
        chunk_size=1000,
        max_attempts=4,
    )
    assert resp.status_code == 200
    assert calls["n"] >= 2
