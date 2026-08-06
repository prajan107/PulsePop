from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trend import Trend
from app.models.trend_cluster import TrendCluster
from app.repositories.trend_repository import TrendRepository


class TrendMaterializerService:
    """Service responsible for materializing processed TrendCluster objects into persisted Trend entities for UI presentation."""

    def __init__(
        self,
        session: AsyncSession,
        repository: TrendRepository | None = None,
    ) -> None:
        self.session = session
        self.repo = repository or TrendRepository(session)

    async def materialize_cluster(self, cluster: TrendCluster) -> Trend:
        """Project a single TrendCluster into a persisted Trend record."""
        title = cluster.canonical_title.strip() if cluster.canonical_title else "Untitled Trend"
        summary = cluster.canonical_summary

        # Extract primary source_id if member analyses are available
        source_id = None
        if cluster.analyses:
            for analysis in cluster.analyses:
                if analysis.raw_trend and analysis.raw_trend.metadata_json:
                    # Optional source lookup
                    pass

        # Normalize metrics for consumption by UI components
        trend_score = max(0.0, min(100.0, float(cluster.trend_score)))
        
        # Ensure popularity score is normalized on 0.0 - 1.0 scale
        pop_score = float(cluster.popularity_score)
        if pop_score > 1.0:
            pop_score = pop_score / 100.0
        popularity_score = max(0.0, min(1.0, pop_score))

        sentiment_score = float(cluster.sentiment_score)
        if sentiment_score > 1.0:
            sentiment_score = sentiment_score / 100.0

        return await self.repo.upsert_from_cluster(
            title=title,
            summary=summary,
            category_id=None,
            source_id=source_id,
            sentiment_score=sentiment_score,
            trend_score=trend_score,
            popularity_score=popularity_score,
        )

    async def materialize_batch(
        self, clusters: list[TrendCluster]
    ) -> list[Trend]:
        """Batch materialize multiple TrendCluster objects into persisted Trend records."""
        trends = []
        for cluster in clusters:
            trend = await self.materialize_cluster(cluster)
            trends.append(trend)
        return trends


__all__ = ["TrendMaterializerService"]
