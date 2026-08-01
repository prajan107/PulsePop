from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class NormalizedTrendData(BaseModel):
    """Pydantic v2 model representing normalized trend data ready for storage."""

    title: str
    summary: str | None = None
    author: str | None = None
    url: str
    published_at: datetime
    source_name: str
    category_name: str = "General"
    language: str = "en"
    sentiment_score: float | None = None
    trend_score: float | None = None
    popularity_score: float | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


__all__ = ["NormalizedTrendData"]
