from datetime import datetime
from pydantic import BaseModel, Field


class TopTrendResponse(BaseModel):
    id: int
    canonical_title: str
    canonical_summary: str | None = None
    cluster_key: str
    trend_score: float
    popularity_score: float
    freshness_score: float
    source_diversity_score: float
    sentiment_score: float
    trend_count: int
    created_at: datetime
    updated_at: datetime


class TrendingTopicResponse(BaseModel):
    topic: str
    count: int
    average_confidence: float = 1.0


class TrendingEntityResponse(BaseModel):
    entity_name: str
    entity_type: str
    count: int
    average_confidence: float = 1.0


class SentimentDistributionResponse(BaseModel):
    positive: int = 0
    negative: int = 0
    neutral: int = 0
    positive_percentage: float = 0.0
    negative_percentage: float = 0.0
    neutral_percentage: float = 0.0


class SourceDistributionResponse(BaseModel):
    source: str
    count: int
    percentage: float


class AnalyticsOverviewResponse(BaseModel):
    total_raw_trends: int
    total_clusters: int
    average_trend_score: float
    average_sentiment_confidence: float
    average_processing_time_ms: float
    top_trending_topic: str | None = None
    top_source: str | None = None
    average_cluster_size: float = 0.0
    completed_analyses: int = 0
    failed_analyses: int = 0


__all__ = [
    "TopTrendResponse",
    "TrendingTopicResponse",
    "TrendingEntityResponse",
    "SentimentDistributionResponse",
    "SourceDistributionResponse",
    "AnalyticsOverviewResponse",
]
