"""Мультиплатформенная публикация видео для таксопарка."""

__version__ = "0.1.0"

from video_publisher.models import Platform, PublicationStatus, VideoMetadata
from video_publisher.orchestrator import VideoPublisherService

__all__ = [
    "Platform",
    "PublicationStatus",
    "VideoMetadata",
    "VideoPublisherService",
    "__version__",
]
