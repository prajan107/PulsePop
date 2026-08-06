from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Any
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.raw_trend import RawTrend
from app.models.trend_analysis import AnalysisStatus, TrendAnalysis
from app.models.trend_cluster import TrendCluster


class AnalyticsRepository:
    """Repository for executing database aggregation and analytics queries."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    def _apply_time_filter(self, query: Any, model_time_col: Any, days: int | None) -> Any:
        if days and days > 0:
            cutoff = datetime.now(timezone.utc) - timedelta(days=days)
            return query.where(model_time_col >= cutoff)
        return query

    async def get_top_trends(
        self, days: int | None = None, limit: int = 10
    ) -> list[TrendCluster]:
        """Fetch top-scoring TrendClusters, optionally filtered by days."""
        query = select(TrendCluster).order_by(TrendCluster.trend_score.desc()).limit(limit)
        query = self._apply_time_filter(query, TrendCluster.created_at, days)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_trending_topics(
        self, days: int | None = None, limit: int = 10
    ) -> list[dict[str, Any]]:
        """Aggregate JSON topics from completed TrendAnalysis records."""
        query = select(TrendAnalysis).where(TrendAnalysis.status == AnalysisStatus.COMPLETED)
        query = self._apply_time_filter(query, TrendAnalysis.created_at, days)
        result = await self.session.execute(query)
        analyses = result.scalars().all()

        topic_counter: Counter[str] = Counter()
        for a in analyses:
            if a.topics and isinstance(a.topics, list):
                for t in a.topics:
                    t_name = t.upper() if isinstance(t, str) else str(t).upper()
                    topic_counter[t_name] += 1

        top_topics = topic_counter.most_common(limit)
        return [
            {"topic": topic, "count": count, "average_confidence": 0.95}
            for topic, count in top_topics
        ]

    async def get_trending_entities(
        self, days: int | None = None, limit: int = 10
    ) -> list[dict[str, Any]]:
        """Aggregate JSON entities from completed TrendAnalysis records."""
        query = select(TrendAnalysis).where(TrendAnalysis.status == AnalysisStatus.COMPLETED)
        query = self._apply_time_filter(query, TrendAnalysis.created_at, days)
        result = await self.session.execute(query)
        analyses = result.scalars().all()

        entity_counter: Counter[tuple[str, str]] = Counter()
        conf_sums: dict[tuple[str, str], float] = {}

        for a in analyses:
            if a.entities and isinstance(a.entities, list):
                for e in a.entities:
                    if isinstance(e, dict) and "name" in e:
                        name = e.get("name", "").strip()
                        e_type = e.get("type", "UNKNOWN").strip().upper()
                        if name:
                            key = (name, e_type)
                            entity_counter[key] += 1
                            conf_sums[key] = conf_sums.get(key, 0.0) + e.get("confidence", 0.9)

        top_entities = entity_counter.most_common(limit)
        results = []
        for (name, e_type), count in top_entities:
            avg_conf = round(conf_sums[(name, e_type)] / count, 2)
            results.append({
                "entity_name": name,
                "entity_type": e_type,
                "count": count,
                "average_confidence": avg_conf,
            })
        return results

    async def get_sentiment_distribution(
        self, days: int | None = None
    ) -> dict[str, Any]:
        """Aggregate sentiment distribution counts and percentages."""
        query = select(
            TrendAnalysis.sentiment_label, func.count(TrendAnalysis.id)
        ).where(TrendAnalysis.status == AnalysisStatus.COMPLETED).group_by(TrendAnalysis.sentiment_label)
        query = self._apply_time_filter(query, TrendAnalysis.created_at, days)

        result = await self.session.execute(query)
        rows = result.all()

        counts = {"positive": 0, "negative": 0, "neutral": 0}
        total = 0
        for label, count in rows:
            lbl = (label or "neutral").lower()
            if lbl in counts:
                counts[lbl] += count
                total += count
            else:
                counts["neutral"] += count
                total += count

        pos_pct = round((counts["positive"] / total) * 100.0, 2) if total > 0 else 0.0
        neg_pct = round((counts["negative"] / total) * 100.0, 2) if total > 0 else 0.0
        neu_pct = round((counts["neutral"] / total) * 100.0, 2) if total > 0 else 0.0

        return {
            "positive": counts["positive"],
            "negative": counts["negative"],
            "neutral": counts["neutral"],
            "positive_percentage": pos_pct,
            "negative_percentage": neg_pct,
            "neutral_percentage": neu_pct,
        }

    async def get_source_distribution(
        self, days: int | None = None
    ) -> list[dict[str, Any]]:
        """Aggregate distribution of RawTrend sources."""
        query = select(RawTrend.source, func.count(RawTrend.id)).group_by(RawTrend.source)
        query = self._apply_time_filter(query, RawTrend.created_at, days)

        result = await self.session.execute(query)
        rows = result.all()

        total = sum(count for _, count in rows)
        results = []
        for source, count in rows:
            pct = round((count / total) * 100.0, 2) if total > 0 else 0.0
            results.append({
                "source": source or "unknown",
                "count": count,
                "percentage": pct,
            })
        return results

    async def get_overview_statistics(
        self, days: int | None = None
    ) -> dict[str, Any]:
        """Query aggregate statistics across raw trends, clusters, and analyses."""
        # 1. Total Raw Trends
        raw_query = select(func.count(RawTrend.id))
        raw_query = self._apply_time_filter(raw_query, RawTrend.created_at, days)
        total_raw = (await self.session.execute(raw_query)).scalar() or 0

        # 2. Total Clusters & Average Trend Score
        cluster_query = select(
            func.count(TrendCluster.id),
            func.avg(TrendCluster.trend_score),
        )
        cluster_query = self._apply_time_filter(cluster_query, TrendCluster.created_at, days)
        cluster_res = (await self.session.execute(cluster_query)).first()
        total_clusters = cluster_res[0] if cluster_res and cluster_res[0] else 0
        avg_score = round(float(cluster_res[1]), 2) if cluster_res and cluster_res[1] is not None else 0.0

        # 3. Analyses Stats (Completed, Failed, Avg Confidence, Avg Proc Time)
        analysis_query = select(
            func.count(TrendAnalysis.id),
            func.avg(TrendAnalysis.sentiment_confidence),
            func.avg(TrendAnalysis.processing_time_ms),
        ).where(TrendAnalysis.status == AnalysisStatus.COMPLETED)
        analysis_query = self._apply_time_filter(analysis_query, TrendAnalysis.created_at, days)
        an_res = (await self.session.execute(analysis_query)).first()

        completed_count = an_res[0] if an_res and an_res[0] else 0
        avg_conf = round(float(an_res[1]), 2) if an_res and an_res[1] is not None else 0.0
        avg_proc_time = round(float(an_res[2]), 2) if an_res and an_res[2] is not None else 0.0

        failed_query = select(func.count(TrendAnalysis.id)).where(
            TrendAnalysis.status == AnalysisStatus.FAILED
        )
        failed_query = self._apply_time_filter(failed_query, TrendAnalysis.created_at, days)
        failed_count = (await self.session.execute(failed_query)).scalar() or 0

        # 4. Top Topic & Top Source
        topics = await self.get_trending_topics(days=days, limit=1)
        top_topic = topics[0]["topic"] if topics else None

        sources = await self.get_source_distribution(days=days)
        top_source = sources[0]["source"] if sources else None

        avg_cluster_size = round(total_raw / total_clusters, 2) if total_clusters > 0 else 0.0

        return {
            "total_raw_trends": total_raw,
            "total_clusters": total_clusters,
            "average_trend_score": avg_score,
            "average_sentiment_confidence": avg_conf,
            "average_processing_time_ms": avg_proc_time,
            "top_trending_topic": top_topic,
            "top_source": top_source,
            "average_cluster_size": avg_cluster_size,
            "completed_analyses": completed_count,
            "failed_analyses": failed_count,
        }


__all__ = ["AnalyticsRepository"]
