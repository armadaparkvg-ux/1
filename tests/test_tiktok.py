from __future__ import annotations

import httpx
import respx

from video_publisher.models import PublicationStatus, VideoMetadata
from video_publisher.platforms.tiktok import TikTokPublisher


@respx.mock
def test_tiktok_publish_flow(settings, tmp_video, monkeypatch):
    monkeypatch.setattr("video_publisher.platforms.base.time.sleep", lambda *_: None)

    init = respx.post("https://open.tiktokapis.com/v2/post/publish/video/init/").mock(
        return_value=httpx.Response(
            200,
            json={
                "error": {"code": "ok", "message": ""},
                "data": {
                    "publish_id": "v_pub_123",
                    "upload_url": "https://upload.us.tiktok.com/video",
                },
            },
        )
    )
    upload = respx.put("https://upload.us.tiktok.com/video").mock(
        return_value=httpx.Response(200, json={})
    )
    status = respx.post("https://open.tiktokapis.com/v2/post/publish/status/fetch/").mock(
        side_effect=[
            httpx.Response(
                200,
                json={"error": {"code": "ok"}, "data": {"status": "PROCESSING_UPLOAD"}},
            ),
            httpx.Response(
                200,
                json={"error": {"code": "ok"}, "data": {"status": "PUBLISH_COMPLETE"}},
            ),
        ]
    )

    pub = TikTokPublisher(settings)
    result = pub.publish(
        tmp_video,
        VideoMetadata(title="Промо таксопарка", tiktok_privacy_level="SELF_ONLY"),
    )
    pub.close()

    assert init.called
    assert upload.called
    assert status.call_count == 2
    assert result.status == PublicationStatus.PUBLISHED
    assert result.publish_id == "v_pub_123"


@respx.mock
def test_tiktok_audit_restriction(settings, tmp_video):
    respx.post("https://open.tiktokapis.com/v2/post/publish/video/init/").mock(
        return_value=httpx.Response(
            200,
            json={
                "error": {
                    "code": "unaudited_client_can_only_post_to_private_accounts",
                    "message": "Please set privacy to SELF_ONLY",
                }
            },
        )
    )
    pub = TikTokPublisher(settings)
    result = pub.publish(tmp_video, VideoMetadata(title="x"))
    pub.close()
    assert result.status == PublicationStatus.FAILED
    assert result.error_code == "AuditRestrictionError"
