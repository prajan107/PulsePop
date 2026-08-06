from datetime import datetime, timezone
from enum import Enum
from pydantic import BaseModel, Field


class SentimentLabel(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"


class EntityType(str, Enum):
    PERSON = "PERSON"
    ORGANIZATION = "ORGANIZATION"
    COMPANY = "COMPANY"
    PRODUCT = "PRODUCT"
    LOCATION = "LOCATION"
    EVENT = "EVENT"
    TECHNOLOGY = "TECHNOLOGY"


class TopicLabel(str, Enum):
    TECHNOLOGY = "TECHNOLOGY"
    ARTIFICIAL_INTELLIGENCE = "ARTIFICIAL_INTELLIGENCE"
    FINANCE = "FINANCE"
    BUSINESS = "BUSINESS"
    ENTERTAINMENT = "ENTERTAINMENT"
    SPORTS = "SPORTS"
    POLITICS = "POLITICS"
    SCIENCE = "SCIENCE"
    HEALTH = "HEALTH"
    GAMING = "GAMING"
    SOCIAL_MEDIA = "SOCIAL_MEDIA"
    OTHER = "OTHER"


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


class DuplicateResult(BaseModel):
    is_duplicate: bool
    similarity_score: float
    reason: str
    provider: str
    model: str


class Entity(BaseModel):
    name: str
    type: EntityType
    confidence: float


class EntityExtractionResult(BaseModel):
    entities: list[Entity]
    provider: str
    model: str


class TopicResult(BaseModel):
    topics: list[TopicLabel]
    confidence: float
    provider: str
    model: str


class AIAnalysisResult(BaseModel):
    summary: SummaryResult
    sentiment: SentimentResult
    embedding: EmbeddingResult
    entities: EntityExtractionResult
    topics: TopicResult
    processing_time_ms: float
    completed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    pipeline_version: str = "1.0"
    provider: str
    model: str
