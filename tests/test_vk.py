from __future__ import annotations

import httpx
import respx

from video_publisher.models import PublicationStatus, VideoMetadata
from video_publisher.platforms.vk import VKPublisher


@respx.mock
def test_vk_publish_file_flow(settings, tmp_video):
    save_route = respx.post("https://api.vk.com/method/video.save").mock(
        return_value=httpx.Response(
            200,
            json={
                "response": {
                    "upload_url": "https://pu.vk.com/upload",
                    "owner_id": -123456,
                    "video_id": 777,
                }
            },
        )
    )
    upload_route = respx.post("https://pu.vk.com/upload").mock(
        return_value=httpx.Response(
            200,
            json={"owner_id": -123456, "video_id": 777, "size": 100, "video_hash": "abc"},
        )
    )

    pub = VKPublisher(settings)
    result = pub.publish(
        tmp_video,
        VideoMetadata(title="Акция выходного дня", description="Скидка 20%", hashtags=["такси", "акция"]),
    )
    pub.close()

    assert save_route.called
    assert upload_route.called
    assert result.status == PublicationStatus.PUBLISHED
    assert result.external_id == "-123456_777"
    assert result.url == "https://vk.com/video-123456_777"


@respx.mock
def test_vk_publish_by_link(settings, tmp_video):
    respx.post("https://api.vk.com/method/video.save").mock(
        return_value=httpx.Response(
            200,
            json={"response": {"owner_id": -1, "video_id": 2}},
        )
    )
    pub = VKPublisher(settings)
    result = pub.publish(
        tmp_video,
        VideoMetadata(title="Импорт", vk_link="https://youtube.com/watch?v=abc"),
    )
    pub.close()
    assert result.status == PublicationStatus.PUBLISHED
    assert result.external_id == "-1_2"
