"""CLI: video-publisher publish | schedule-run | status | platforms."""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path

import click

from video_publisher.config import get_settings
from video_publisher.db import Database
from video_publisher.logging_setup import setup_logging
from video_publisher.models import Platform, PublishRequest, VideoMetadata
from video_publisher.orchestrator import VideoPublisherService
from video_publisher.scheduler import PublicationScheduler, run_scheduler


def _parse_platforms(raw: str | None) -> list[Platform]:
    if not raw:
        return list(Platform)
    items = [p.strip().lower() for p in raw.split(",") if p.strip()]
    result: list[Platform] = []
    for item in items:
        try:
            result.append(Platform(item))
        except ValueError as exc:
            raise click.ClickException(
                f"Неизвестная платформа: {item}. Доступны: {', '.join(p.value for p in Platform)}"
            ) from exc
    return result


def _parse_dt(value: str | None) -> datetime | None:
    if not value:
        return None
    # ISO-8601: 2026-08-08T18:00:00+03:00 или 2026-08-08T15:00:00Z
    normalized = value.replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(normalized)
    except ValueError as exc:
        raise click.ClickException(
            f"Некорректная дата publish-at: {value}. Ожидается ISO-8601."
        ) from exc


@click.group()
@click.option("--log-level", default=None, help="DEBUG|INFO|WARNING|ERROR")
@click.pass_context
def main(ctx: click.Context, log_level: str | None) -> None:
    """Мультиплатформенная публикация видео таксопарка."""
    settings = get_settings()
    setup_logging(log_level or settings.log_level)
    ctx.ensure_object(dict)
    ctx.obj["settings"] = settings


@main.command("platforms")
@click.pass_context
def platforms_cmd(ctx: click.Context) -> None:
    """Показать, какие платформы сконфигурированы."""
    service = VideoPublisherService(settings=ctx.obj["settings"])
    try:
        configured = {p.value for p in service.configured_platforms()}
        for p in Platform:
            mark = "OK" if p.value in configured else "--"
            click.echo(f"[{mark}] {p.value}")
    finally:
        service.close()


@main.command("publish")
@click.argument("video", type=click.Path(exists=True, dir_okay=False, path_type=Path))
@click.option("--title", required=True, help="Заголовок ролика")
@click.option("--description", default="", help="Описание")
@click.option("--hashtags", default="", help="Хэштеги через пробел или запятую")
@click.option("--publish-at", default=None, help="ISO-8601 дата отложенной публикации")
@click.option(
    "--platforms",
    "platforms_raw",
    default=None,
    help="Список платформ через запятую (vk,youtube,instagram,tiktok)",
)
@click.option("--public-video-url", default=None, help="Публичный HTTPS URL для Instagram")
@click.option("--cover-url", default=None, help="Обложка (Instagram cover_url)")
@click.option("--vk-link", default=None, help="Импорт в VK по ссылке (YouTube и т.п.)")
@click.option("--sequential", is_flag=True, help="Публиковать последовательно, не параллельно")
@click.option("--json-out", is_flag=True, help="Вывести результат в JSON")
@click.pass_context
def publish_cmd(
    ctx: click.Context,
    video: Path,
    title: str,
    description: str,
    hashtags: str,
    publish_at: str | None,
    platforms_raw: str | None,
    public_video_url: str | None,
    cover_url: str | None,
    vk_link: str | None,
    sequential: bool,
    json_out: bool,
) -> None:
    """Опубликовать видео на подключённые площадки."""
    metadata = VideoMetadata(
        title=title,
        description=description,
        hashtags=hashtags,
        publish_at=_parse_dt(publish_at),
        public_video_url=public_video_url,
        cover_url=cover_url,
        vk_link=vk_link,
    )
    request = PublishRequest(
        video_path=video,
        metadata=metadata,
        platforms=_parse_platforms(platforms_raw),
        parallel=not sequential,
    )
    service = VideoPublisherService(settings=ctx.obj["settings"])
    try:
        results = service.publish(request)
    finally:
        service.close()

    if json_out:
        click.echo(json.dumps([r.model_dump(mode="json") for r in results], ensure_ascii=False, indent=2))
    else:
        for r in results:
            click.echo(
                f"{r.platform.value:10} {r.status.value:12} "
                f"id={r.external_id or '-'} "
                f"container={r.container_id or '-'} "
                f"publish={r.publish_id or '-'} "
                f"err={r.error or '-'}"
            )

    if any(r.status.value == "failed" for r in results):
        sys.exit(1)


@main.command("status")
@click.option("--batch-id", default=None)
@click.option("--limit", default=50, show_default=True)
@click.option("--status-filter", default=None, help="pending|scheduled|uploading|published|failed")
@click.pass_context
def status_cmd(
    ctx: click.Context,
    batch_id: str | None,
    limit: int,
    status_filter: str | None,
) -> None:
    """Показать статусы публикаций из БД."""
    db = Database(ctx.obj["settings"].database_url)
    if batch_id:
        jobs = db.get_jobs_by_batch(batch_id)
    else:
        from video_publisher.models import PublicationStatus

        st = PublicationStatus(status_filter) if status_filter else None
        jobs = db.list_jobs(status=st, limit=limit)

    if not jobs:
        click.echo("Нет записей")
        return

    for job in jobs:
        click.echo(
            f"#{job.id} batch={job.batch_id[:8]} {job.platform:10} {job.status:12} "
            f"at={job.publish_at} ext={job.external_id or '-'} "
            f"container={job.container_id or '-'} publish_id={job.publish_id or '-'} "
            f"err={job.error or '-'}"
        )


@main.command("scheduler")
@click.pass_context
def scheduler_cmd(ctx: click.Context) -> None:
    """Запустить фоновый шедулер отложенных публикаций (VK/IG/TikTok)."""
    run_scheduler(settings=ctx.obj["settings"])


@main.command("scheduler-once")
@click.pass_context
def scheduler_once_cmd(ctx: click.Context) -> None:
    """Обработать due-задачи один раз (удобно для cron)."""
    sched = PublicationScheduler(settings=ctx.obj["settings"])
    try:
        n = sched.process_due_jobs()
        click.echo(f"Processed {n} job(s)")
    finally:
        sched.service.close()


if __name__ == "__main__":
    main()
