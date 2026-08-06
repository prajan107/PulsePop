from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.trend_analysis import TrendAnalysis
from app.models.trend_cluster import TrendCluster


class TrendClusterRepository:
    """Repository for managing persistence operations on TrendCluster entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, cluster: TrendCluster) -> TrendCluster:
        """Create and persist a new TrendCluster record."""
        self.session.add(cluster)
        await self.session.commit()
        await self.session.refresh(cluster)
        return cluster

    async def get_by_id(self, cluster_id: int) -> TrendCluster | None:
        """Fetch a TrendCluster record by primary key id."""
        result = await self.session.execute(
            select(TrendCluster)
            .options(
                selectinload(TrendCluster.analyses).selectinload(
                    TrendAnalysis.raw_trend
                )
            )
            .where(TrendCluster.id == cluster_id)
        )
        return result.scalar_one_or_none()

    async def get_by_cluster_key(self, cluster_key: str) -> TrendCluster | None:
        """Fetch a TrendCluster record by unique cluster_key."""
        result = await self.session.execute(
            select(TrendCluster)
            .options(
                selectinload(TrendCluster.analyses).selectinload(
                    TrendAnalysis.raw_trend
                )
            )
            .where(TrendCluster.cluster_key == cluster_key)
        )
        return result.scalar_one_or_none()

    async def get_all(self) -> list[TrendCluster]:
        """Fetch all TrendCluster records ordered by created_at desc."""
        result = await self.session.execute(
            select(TrendCluster)
            .options(
                selectinload(TrendCluster.analyses).selectinload(
                    TrendAnalysis.raw_trend
                )
            )
            .order_by(TrendCluster.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_recent_clusters(self, limit: int = 100) -> list[TrendCluster]:
        """Fetch recent TrendCluster records up to specified limit."""
        result = await self.session.execute(
            select(TrendCluster)
            .options(
                selectinload(TrendCluster.analyses).selectinload(
                    TrendAnalysis.raw_trend
                )
            )
            .order_by(TrendCluster.updated_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def find_candidate_clusters(
        self, topics: list[str], entity_names: list[str]
    ) -> list[TrendCluster]:
        """Fetch candidate clusters sharing at least one topic or entity name."""
        all_clusters = await self.get_recent_clusters(limit=200)
        if not topics and not entity_names:
            return all_clusters

        topic_set = {t.upper() for t in topics} if topics else set()
        entity_set = {e.lower() for e in entity_names} if entity_names else set()

        candidates = []
        for cluster in all_clusters:
            matches = False
            for analysis in cluster.analyses:
                # Check topic overlap
                if analysis.topics and topic_set:
                    analysis_topics = {
                        (t.upper() if isinstance(t, str) else str(t).upper())
                        for t in analysis.topics
                    }
                    if topic_set & analysis_topics:
                        matches = True
                        break

                # Check entity overlap
                if analysis.entities and entity_set:
                    analysis_entities = {
                        e.get("name", "").lower()
                        for e in analysis.entities
                        if isinstance(e, dict) and e.get("name")
                    }
                    if entity_set & analysis_entities:
                        matches = True
                        break

            if matches:
                candidates.append(cluster)

        # If no candidates match by topic/entity filtering, fallback to recent clusters
        return candidates if candidates else all_clusters

    async def assign_analysis(
        self, cluster: TrendCluster, analysis: TrendAnalysis
    ) -> TrendCluster:
        """Assign a TrendAnalysis record to a TrendCluster and update trend_count."""
        analysis.cluster_id = cluster.id
        self.session.add(analysis)

        # Recalculate trend count based on assigned analyses
        result = await self.session.execute(
            select(TrendAnalysis.id).where(TrendAnalysis.cluster_id == cluster.id)
        )
        cluster.trend_count = len(result.scalars().all())

        await self.session.commit()
        await self.session.refresh(cluster)
        return cluster

    async def recalculate_score(
        self,
        cluster: TrendCluster,
        trend_score: float,
        popularity_score: float,
        freshness_score: float,
        source_diversity_score: float,
        sentiment_score: float,
    ) -> TrendCluster:
        """Update scoring metrics and calculation timestamp on a TrendCluster."""
        cluster.trend_score = trend_score
        cluster.popularity_score = popularity_score
        cluster.freshness_score = freshness_score
        cluster.source_diversity_score = source_diversity_score
        cluster.sentiment_score = sentiment_score
        cluster.last_calculated_at = datetime.now(timezone.utc)

        await self.session.commit()
        await self.session.refresh(cluster)
        return cluster

    async def update(self, cluster: TrendCluster) -> TrendCluster:
        """Persist updates to an existing TrendCluster record."""
        await self.session.commit()
        await self.session.refresh(cluster)
        return cluster

    async def delete(self, cluster_id: int) -> bool:
        """Delete a TrendCluster record by id."""
        record = await self.get_by_id(cluster_id)
        if not record:
            return False
        await self.session.delete(record)
        await self.session.commit()
        return True


__all__ = ["TrendClusterRepository"]
