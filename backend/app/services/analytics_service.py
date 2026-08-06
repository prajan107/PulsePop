from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.analytics_repository import AnalyticsRepository
from app.schemas.analytics import (
    AnalyticsOverviewResponse,
    SentimentDistributionResponse,
    SourceDistributionResponse,
    TopTrendResponse,
    TrendingEntityResponse,
    TrendingTopicResponse,
)


class AnalyticsService:
    """Business logic service layer for backend intelligence analytics."""

    def __init__(self, session: AsyncSession) -> None:
        self.repo = AnalyticsRepository(session)

    async def get_top_trends(
        self, days: int | None = None, limit: int = 10
    ) -> list[TopTrendResponse]:
        """Retrieve top-scoring trends mapped to TopTrendResponse objects."""
        clusters = await self.repo.get_top_trends(days=days, limit=limit)
        return [
            TopTrendResponse(
                id=c.id,
                canonical_title=c.canonical_title,
                canonical_summary=c.canonical_summary,
                cluster_key=c.cluster_key,
                trend_score=c.trend_score,
                popularity_score=c.popularity_score,
                freshness_score=c.freshness_score,
                source_diversity_score=c.source_diversity_score,
                sentiment_score=c.sentiment_score,
                trend_count=c.trend_count,
                created_at=c.created_at,
                updated_at=c.updated_at,
            )
            for c in clusters
        ]

    async def get_trending_topics(
        self, days: int | None = None, limit: int = 10
    ) -> list[TrendingTopicResponse]:
        """Retrieve aggregated trending topics."""
        data = await self.repo.get_trending_topics(days=days, limit=limit)
        return [TrendingTopicResponse(**item) for item in data]

    async def get_trending_entities(
        self, days: int | None = None, limit: int = 10
    ) -> list[TrendingEntityResponse]:
        """Retrieve aggregated trending entities."""
        data = await self.repo.get_trending_entities(days=days, limit=limit)
        return [TrendingEntityResponse(**item) for item in data]

    async def get_sentiment_distribution(
        self, days: int | None = None
    ) -> SentimentDistributionResponse:
        """Retrieve sentiment distribution statistics."""
        data = await self.repo.get_sentiment_distribution(days=days)
        return SentimentDistributionResponse(**data)

    async def get_source_distribution(
        self, days: int | None = None
    ) -> list[SourceDistributionResponse]:
        """Retrieve source distribution statistics."""
        data = await self.repo.get_source_distribution(days=days)
        return [SourceDistributionResponse(**item) for item in data]

    async def get_overview(
        self, days: int | None = None
    ) -> AnalyticsOverviewResponse:
        """Retrieve overview analytics statistics."""
        data = await self.repo.get_overview_statistics(days=days)
        return AnalyticsOverviewResponse(**data)


__all__ = ["AnalyticsService"]
