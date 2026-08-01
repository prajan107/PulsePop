from datetime import datetime

from pydantic import BaseModel


class TrendCreate(BaseModel):
    title: str
    summary: str | None = None
    category_id: int | None = None
    source_id: int | None = None
    sentiment_score: float = 0.0
    trend_score: float = 0.0
    popularity_score: float = 0.0


class TrendUpdate(BaseModel):
    title: str | None = None
    summary: str | None = None
    category_id: int | None = None
    source_id: int | None = None
    sentiment_score: float | None = None
    trend_score: float | None = None
    popularity_score: float | None = None


class TrendResponse(BaseModel):
    id: int
    title: str
    summary: str | None = None
    category_id: int | None = None
    source_id: int | None = None
    sentiment_score: float
    trend_score: float
    popularity_score: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
