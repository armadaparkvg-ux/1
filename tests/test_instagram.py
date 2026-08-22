from __future__ import annotations

import httpx
import respx
import pytest

from video_publisher.exceptions import RateLimitError
from video_publisher.models import PublicationStatus, VideoMetadata
from video_publisher.platforms.instagram import InstagramPublisher


@respx.mock
def test_instagram_reels_flow(settings, tmp_video, monkeypatch):
    monkeypatch.setattr("video_publisher.platforms.base.time.sleep", lambda *_: None)

    ig = settings.instagram_ig_user_id
    base = f"https://graph.facebook.com/{settings.instagram_api_version}"

    respx.get(f"{base}/{ig}/content_publishing_limit").mock(
        return_value=httpx.Response(
            200,
            json={"data": [{"quota_usage": 3, "config": {"quota_total": 50}}]},
        )
    )
    respx.post(f"{base}/{ig}/media").mock(
        return_value=httpx.Response(200, json={"id": "container_123"})
    )
    status_route = respx.get(f"{base}/container_123").mock(
        side_effect=[
            httpx.Response(200, json={"status_code": "IN_PROGRESS"}),
            httpx.Response(200, json={"status_code": "FINISHED"}),
        ]
    )
    respx.post(f"{base}/{ig}/media_publish").mock(
        return_value=httpx.Response(200, json={"id": "media_999"})
    )

    pub = InstagramPublisher(settings)
    result = pub.publish(
        tmp_video,
        VideoMetadata(
            title="Турнир водителей",
            description="Призы каждую неделю",
            hashtags=["турнир"],
            public_video_url="https://cdn.example.com/videos/promo.mp4",
        ),
    )
    pub.close()

    assert status_route.call_count == 2
    assert result.status == PublicationStatus.PUBLISHED
    assert result.container_id == "container_123"
    assert result.external_id == "media_999"


@respx.mock
def test_instagram_quota_exceeded(settings, tmp_video):
    ig = settings.instagram_ig_user_id
    base = f"https://graph.facebook.com/{settings.instagram_api_version}"
    respx.get(f"{base}/{ig}/content_publishing_limit").mock(
        return_value=httpx.Response(
            200,
            json={"data": [{"quota_usage": 50, "config": {"quota_total": 50}}]},
        )
    )
    pub = InstagramPublisher(settings)
    with pytest.raises(RateLimitError):
        pub.check_quota()
    pub.close()
