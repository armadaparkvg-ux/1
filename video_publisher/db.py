"""SQLite/SQLAlchemy трекинг статусов публикаций."""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from sqlalchemy import (
    DateTime,
    Integer,
    String,
    Text,
    create_engine,
    select,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

from video_publisher.models import Platform, PublicationStatus


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Base(DeclarativeBase):
    pass


class PublicationJob(Base):
    """Одна запись = одна платформа в рамках батча публикации."""

    __tablename__ = "publication_jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    batch_id: Mapped[str] = mapped_column(String(64), index=True)
    platform: Mapped[str] = mapped_column(String(32), index=True)
    status: Mapped[str] = mapped_column(String(32), index=True, default=PublicationStatus.PENDING.value)

    video_path: Mapped[str] = mapped_column(Text)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text, default="")
    hashtags: Mapped[str] = mapped_column(Text, default="")  # JSON/space-separated
    public_video_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    publish_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)

    # Идентификаторы платформ для дебага
    external_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    container_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    publish_id: Mapped[str | None] = mapped_column(String(128), nullable=True)
    upload_id: Mapped[str | None] = mapped_column(String(256), nullable=True)
    result_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    error_code: Mapped[str | None] = mapped_column(String(64), nullable=True)
    attempts: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )


class Database:
    def __init__(self, database_url: str):
        # Гарантируем наличие каталога для sqlite
        if database_url.startswith("sqlite:///"):
            db_path = Path(database_url.replace("sqlite:///", "", 1))
            db_path.parent.mkdir(parents=True, exist_ok=True)

        connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
        self.engine = create_engine(database_url, future=True, connect_args=connect_args)
        self._session_factory = sessionmaker(bind=self.engine, expire_on_commit=False, future=True)
        Base.metadata.create_all(self.engine)

    def session(self) -> Session:
        return self._session_factory()

    def create_jobs(
        self,
        *,
        batch_id: str,
        video_path: str,
        title: str,
        description: str,
        hashtags: str,
        platforms: Iterable[Platform],
        publish_at: datetime | None = None,
        public_video_url: str | None = None,
        initial_status: PublicationStatus = PublicationStatus.PENDING,
    ) -> list[PublicationJob]:
        jobs: list[PublicationJob] = []
        with self.session() as session:
            for platform in platforms:
                job = PublicationJob(
                    batch_id=batch_id,
                    platform=platform.value,
                    status=initial_status.value,
                    video_path=video_path,
                    title=title,
                    description=description,
                    hashtags=hashtags,
                    public_video_url=public_video_url,
                    publish_at=publish_at,
                )
                session.add(job)
                jobs.append(job)
            session.commit()
            for job in jobs:
                session.refresh(job)
        return jobs

    def update_job(
        self,
        job_id: int,
        *,
        status: PublicationStatus | None = None,
        external_id: str | None = None,
        container_id: str | None = None,
        publish_id: str | None = None,
        upload_id: str | None = None,
        result_url: str | None = None,
        error: str | None = None,
        error_code: str | None = None,
        increment_attempts: bool = False,
    ) -> PublicationJob | None:
        with self.session() as session:
            job = session.get(PublicationJob, job_id)
            if not job:
                return None
            if status is not None:
                job.status = status.value
            if external_id is not None:
                job.external_id = external_id
            if container_id is not None:
                job.container_id = container_id
            if publish_id is not None:
                job.publish_id = publish_id
            if upload_id is not None:
                job.upload_id = upload_id
            if result_url is not None:
                job.result_url = result_url
            if error is not None:
                job.error = error
            if error_code is not None:
                job.error_code = error_code
            if increment_attempts:
                job.attempts += 1
            job.updated_at = utcnow()
            session.commit()
            session.refresh(job)
            return job

    def get_due_jobs(self, *, now: datetime | None = None, limit: int = 50) -> list[PublicationJob]:
        now = now or utcnow()
        with self.session() as session:
            stmt = (
                select(PublicationJob)
                .where(PublicationJob.status == PublicationStatus.SCHEDULED.value)
                .where(PublicationJob.publish_at.is_not(None))
                .where(PublicationJob.publish_at <= now)
                .order_by(PublicationJob.publish_at.asc())
                .limit(limit)
            )
            return list(session.scalars(stmt).all())

    def get_jobs_by_batch(self, batch_id: str) -> list[PublicationJob]:
        with self.session() as session:
            stmt = select(PublicationJob).where(PublicationJob.batch_id == batch_id)
            return list(session.scalars(stmt).all())

    def list_jobs(
        self,
        *,
        status: PublicationStatus | None = None,
        platform: Platform | None = None,
        limit: int = 100,
    ) -> list[PublicationJob]:
        with self.session() as session:
            stmt = select(PublicationJob).order_by(PublicationJob.id.desc()).limit(limit)
            if status is not None:
                stmt = stmt.where(PublicationJob.status == status.value)
            if platform is not None:
                stmt = stmt.where(PublicationJob.platform == platform.value)
            return list(session.scalars(stmt).all())
