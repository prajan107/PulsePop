from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class RawTrendData(BaseModel):
    """Pydantic model representing raw trend data extracted from a collector."""

    title: str
    content: str | None = None
    author: str | None = None
    url: str
    published_at: datetime
    source: str
    language: str = "en"
    metadata: dict[str, Any] = Field(default_factory=dict)


__all__ = ["RawTrendData"]
