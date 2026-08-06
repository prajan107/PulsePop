from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.trend_analysis import TrendAnalysis


class TrendCluster(Base):
    """DB model representing a unified cluster of correlated trend analyses across sources."""

    __tablename__ = "trend_clusters"

    id: Mapped[int] = mapped_column(primary_key=True)
    canonical_title: Mapped[str] = mapped_column(String(512), nullable=False)
    canonical_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    cluster_key: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    trend_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    trend_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    popularity_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    freshness_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    source_diversity_score: Mapped[float] = mapped_column(
        Float, default=0.0, nullable=False
    )
    sentiment_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    last_calculated_at: Mapped[datetime | None] = mapped_column(
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

    analyses: Mapped[list["TrendAnalysis"]] = relationship(
        "TrendAnalysis", back_populates="cluster", lazy="selectin"
    )


__all__ = ["TrendCluster"]
