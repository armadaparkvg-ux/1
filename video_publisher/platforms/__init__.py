"""Платформенные адаптеры публикации."""

from video_publisher.platforms.base import BasePlatformPublisher
from video_publisher.platforms.instagram import InstagramPublisher
from video_publisher.platforms.tiktok import TikTokPublisher
from video_publisher.platforms.vk import VKPublisher
from video_publisher.platforms.youtube import YouTubePublisher

__all__ = [
    "BasePlatformPublisher",
    "VKPublisher",
    "YouTubePublisher",
    "InstagramPublisher",
    "TikTokPublisher",
]
