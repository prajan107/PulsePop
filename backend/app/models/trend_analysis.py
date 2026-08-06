from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Any

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.raw_trend import RawTrend
    from app.models.trend_cluster import TrendCluster


class AnalysisStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class TrendAnalysis(Base):
    __tablename__ = "trend_analyses"
    __table_args__ = (
        UniqueConstraint(
            "raw_trend_id", "pipeline_version", name="uq_raw_trend_pipeline_version"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    raw_trend_id: Mapped[int] = mapped_column(
        ForeignKey("raw_trends.id"), index=True, nullable=False
    )
    cluster_id: Mapped[int | None] = mapped_column(
        ForeignKey("trend_clusters.id"), index=True, nullable=True
    )
    status: Mapped[AnalysisStatus] = mapped_column(
        String(50), default=AnalysisStatus.COMPLETED, nullable=False
    )
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    sentiment_label: Mapped[str | None] = mapped_column(String(50), nullable=True)
    sentiment_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    embedding: Mapped[list[float] | None] = mapped_column(JSON, nullable=True)
    entities: Mapped[list[dict[str, Any]] | None] = mapped_column(JSON, nullable=True)
    topics: Mapped[list[str] | dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    provider: Mapped[str] = mapped_column(String(100), nullable=False)
    provider_version: Mapped[str | None] = mapped_column(String(50), nullable=True)
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    pipeline_version: Mapped[str] = mapped_column(String(50), default="1.0", nullable=False)
    processing_time_ms: Mapped[float | None] = mapped_column(Float, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    retry_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    raw_trend: Mapped["RawTrend"] = relationship(
        "RawTrend", back_populates="analyses", lazy="selectin"
    )
    cluster: Mapped["TrendCluster | None"] = relationship(
        "TrendCluster", back_populates="analyses", lazy="selectin"
    )


__all__ = ["TrendAnalysis", "AnalysisStatus"]
