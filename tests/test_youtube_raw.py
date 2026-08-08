from __future__ import annotations

import httpx
import respx

from video_publisher.models import PublicationStatus, VideoMetadata
from video_publisher.platforms.youtube import YouTubePublisher


@respx.mock
def test_youtube_raw_resumable_upload(settings, tmp_video):
    init = respx.post(url__startswith="https://www.googleapis.com/upload/youtube/v3/videos").mock(
        return_value=httpx.Response(
            200,
            headers={"Location": "https://www.googleapis.com/upload/youtube/v3/videos?upload_id=abc"},
            json={},
        )
    )
    put = respx.put(url__startswith="https://www.googleapis.com/upload/youtube/v3/videos").mock(
        return_value=httpx.Response(200, json={"id": "yt_video_1"})
    )

    pub = YouTubePublisher(settings)
    result = pub.resumable_upload_raw(
        tmp_video,
        VideoMetadata(title="Shorts промо", description="Описание", hashtags=["shorts"]),
        access_token="ya29.test",
    )
    pub.close()

    assert init.called
    assert put.called
    assert result.status == PublicationStatus.PUBLISHED
    assert result.external_id == "yt_video_1"
    assert result.url == "https://youtube.com/shorts/yt_video_1"
