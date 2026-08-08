"""Retry с экспоненциальным backoff для сетевых сбоев и chunked upload."""

from __future__ import annotations

import logging
import random
from collections.abc import Callable
from typing import TypeVar

from tenacity import (
    RetryCallState,
    retry,
    retry_if_exception,
    stop_after_attempt,
    wait_exponential_jitter,
)

from video_publisher.exceptions import NetworkRetryableError, RateLimitError

logger = logging.getLogger(__name__)

T = TypeVar("T")


def _is_retryable(exc: BaseException) -> bool:
    if isinstance(exc, (NetworkRetryableError, RateLimitError)):
        return True
    # httpx / requests часто оборачивают временные ошибки
    name = type(exc).__name__
    if name in {
        "ConnectError",
        "ConnectTimeout",
        "ReadTimeout",
        "WriteTimeout",
        "TimeoutException",
        "RemoteProtocolError",
        "ConnectionError",
        "ChunkedEncodingError",
    }:
        return True
    return False


def _log_before_sleep(retry_state: RetryCallState) -> None:
    exc = retry_state.outcome.exception() if retry_state.outcome else None
    wait = retry_state.next_action.sleep if retry_state.next_action else 0
    logger.warning(
        "Retry #%s after %.1fs due to: %s",
        retry_state.attempt_number,
        wait,
        exc,
    )


def with_retry(
    *,
    max_attempts: int = 5,
    min_wait: float = 1.0,
    max_wait: float = 60.0,
) -> Callable[[Callable[..., T]], Callable[..., T]]:
    """Декоратор retry с экспоненциальным backoff + jitter."""

    return retry(
        reraise=True,
        stop=stop_after_attempt(max_attempts),
        wait=wait_exponential_jitter(initial=min_wait, max=max_wait),
        retry=retry_if_exception(_is_retryable),
        before_sleep=_log_before_sleep,
    )


def retry_call(
    fn: Callable[..., T],
    *args,
    max_attempts: int = 5,
    min_wait: float = 1.0,
    max_wait: float = 60.0,
    **kwargs,
) -> T:
    """Вызов функции с retry (удобно внутри chunked upload)."""

    @with_retry(max_attempts=max_attempts, min_wait=min_wait, max_wait=max_wait)
    def _wrapped() -> T:
        return fn(*args, **kwargs)

    return _wrapped()


def backoff_seconds(attempt: int, *, base: float = 2.0, cap: float = 60.0) -> float:
    """Чистый экспоненциальный backoff с jitter (без tenacity)."""
    delay = min(cap, base**attempt)
    return delay * (0.5 + random.random() * 0.5)
