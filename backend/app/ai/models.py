from datetime import datetime, timezone
from enum import Enum
from pydantic import BaseModel, Field


class SentimentLabel(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"


class AIResponse(BaseModel):
    text: str
    provider: str
    model: str
    latency_ms: float | None = None
    finish_reason: str | None = None
    usage_metadata: dict = Field(default_factory=dict)


class SentimentResult(BaseModel):
    label: SentimentLabel
    confidence: float
    reason: str


class SummaryResult(BaseModel):
    summary: str
    key_points: list[str]
    confidence: float
    provider: str | None = None
    model: str | None = None


class EmbeddingResult(BaseModel):
    vector: list[float]
    provider: str
    model: str
    dimensions: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
