"""Исключения платформ и квот."""

from __future__ import annotations


class PublisherError(Exception):
    """Базовая ошибка публикации."""

    def __init__(self, message: str, *, platform: str | None = None, retryable: bool = False):
        super().__init__(message)
        self.platform = platform
        self.retryable = retryable


class NetworkRetryableError(PublisherError):
    """Сетевой сбой / 5xx / временная недоступность — можно ретраить."""

    def __init__(self, message: str, *, platform: str | None = None):
        super().__init__(message, platform=platform, retryable=True)


class AuthError(PublisherError):
    """Проблемы с OAuth / токеном."""

    def __init__(self, message: str, *, platform: str | None = None):
        super().__init__(message, platform=platform, retryable=False)


class QuotaExceededError(PublisherError):
    """Исчерпана квота платформы."""

    def __init__(
        self,
        message: str,
        *,
        platform: str | None = None,
        retry_after_seconds: int | None = None,
    ):
        super().__init__(message, platform=platform, retryable=False)
        self.retry_after_seconds = retry_after_seconds


class RateLimitError(PublisherError):
    """Rate limit (Instagram content_publishing_limit и т.п.)."""

    def __init__(
        self,
        message: str,
        *,
        platform: str | None = None,
        retry_after_seconds: int | None = None,
    ):
        super().__init__(message, platform=platform, retryable=True)
        self.retry_after_seconds = retry_after_seconds


class AuditRestrictionError(PublisherError):
    """TikTok: приложение не прошло аудит, доступен только SELF_ONLY."""

    def __init__(self, message: str, *, platform: str = "tiktok"):
        super().__init__(message, platform=platform, retryable=False)


class ValidationError(PublisherError):
    """Невалидные метаданные или формат видео."""

    def __init__(self, message: str, *, platform: str | None = None):
        super().__init__(message, platform=platform, retryable=False)


class ProcessingTimeoutError(PublisherError):
    """Контейнер / publish не дошёл до FINISHED / PUBLISH_COMPLETE вовремя."""

    def __init__(self, message: str, *, platform: str | None = None):
        super().__init__(message, platform=platform, retryable=True)
