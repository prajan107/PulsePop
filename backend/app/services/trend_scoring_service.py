import math
from datetime import datetime, timezone
from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.models.raw_trend import RawTrend
from app.models.trend_analysis import TrendAnalysis
from app.models.trend_cluster import TrendCluster
from app.repositories.trend_cluster_repository import TrendClusterRepository


class TrendScoringService:
    """Deterministic scoring engine for computing dynamic 0-100 Trend Scores for TrendClusters."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = TrendClusterRepository(session)

    async def _resolve_analyses_and_raw_trends(
        self, cluster: TrendCluster
    ) -> tuple[list[TrendAnalysis], list[RawTrend]]:
        """Fetch all member TrendAnalyses and their linked RawTrends for a cluster directly from DB."""
        if not cluster.id:
            return list(cluster.analyses or []), [
                a.raw_trend for a in (cluster.analyses or []) if a.raw_trend
            ]

        res = await self.session.execute(
            select(TrendAnalysis)
            .options(selectinload(TrendAnalysis.raw_trend))
            .where(TrendAnalysis.cluster_id == cluster.id)
        )
        analyses = list(res.scalars().all())
        raws = [a.raw_trend for a in analyses if a.raw_trend]
        return analyses, raws

    def _compute_popularity(self, raw_trends: list[RawTrend]) -> float:
        """Compute normalized popularity score (0.0 to 1.0) from RawTrend metrics."""
        if not raw_trends:
            return 0.3

        scores = []
        for raw in raw_trends:
            # Direct popularity / trend scores if available
            if raw.popularity_score is not None:
                scores.append(min(1.0, max(0.0, raw.popularity_score)))
            elif raw.trend_score is not None:
                scores.append(min(1.0, max(0.0, raw.trend_score)))
            elif raw.metadata_json and isinstance(raw.metadata_json, dict):
                # Extract collector metrics (Reddit score, comments, YouTube views)
                meta = raw.metadata_json
                score_val = meta.get("score") or meta.get("upvotes") or meta.get("views") or 0
                num_comments = meta.get("num_comments") or meta.get("comments") or 0
                composite = (float(score_val) * 0.7 + float(num_comments) * 3.0) / 1000.0
                scores.append(min(1.0, max(0.0, composite)))
            else:
                scores.append(0.3)  # default baseline popularity

        return sum(scores) / len(scores) if scores else 0.3

    def _compute_freshness(
        self, analyses: list[TrendAnalysis], raw_trends: list[RawTrend]
    ) -> float:
        """Compute time decay freshness score (0.0 to 1.0) based on publication/completion timestamps."""
        now = datetime.now(timezone.utc)
        latest_time = None

        for analysis in analyses:
            if analysis.completed_at:
                t = analysis.completed_at
                if t.tzinfo is None:
                    t = t.replace(tzinfo=timezone.utc)
                if latest_time is None or t > latest_time:
                    latest_time = t

        for raw in raw_trends:
            if raw.published_at:
                t = raw.published_at
                if t.tzinfo is None:
                    t = t.replace(tzinfo=timezone.utc)
                if latest_time is None or t > latest_time:
                    latest_time = t

        if not latest_time:
            return 1.0

        delta_hours = max(0.0, (now - latest_time).total_seconds() / 3600.0)
        # Linear decay over 72 hours
        return max(0.0, 1.0 - (delta_hours / 72.0))

    def _compute_source_diversity(self, raw_trends: list[RawTrend]) -> float:
        """Compute normalized source diversity score (0.0 to 1.0) based on platform count."""
        sources = {raw.source.lower() for raw in raw_trends if raw.source}
        num_sources = len(sources)
        if num_sources == 0:
            return 0.25
        # 1 source = 0.25, 2 = 0.50, 3 = 0.75, 4+ = 1.0
        return min(1.0, max(0.25, num_sources / 4.0))

    def _compute_sentiment(self, analyses: list[TrendAnalysis]) -> float:
        """Compute normalized sentiment score (0.0 to 1.0) based on confidence and label."""
        if not analyses:
            return 0.5

        scores = []
        for analysis in analyses:
            conf = analysis.sentiment_confidence or 0.5
            label = (analysis.sentiment_label or "").lower()
            # Non-neutral sentiments carry higher intensity
            multiplier = 1.0 if label in ("positive", "negative") else 0.6
            scores.append(min(1.0, conf * multiplier))

        return sum(scores) / len(scores) if scores else 0.5

    def _compute_ai_confidence(self, analyses: list[TrendAnalysis]) -> float:
        """Compute average AI module confidence score (0.0 to 1.0)."""
        if not analyses:
            return 0.8

        confidences = []
        for analysis in analyses:
            if analysis.sentiment_confidence is not None:
                confidences.append(analysis.sentiment_confidence)

            # Average entity confidence
            if analysis.entities and isinstance(analysis.entities, list):
                e_confs = [
                    e.get("confidence", 0.8)
                    for e in analysis.entities
                    if isinstance(e, dict) and "confidence" in e
                ]
                if e_confs:
                    confidences.append(sum(e_confs) / len(e_confs))

        return sum(confidences) / len(confidences) if confidences else 0.8

    async def calculate_score(self, cluster: TrendCluster) -> float:
        """Calculate deterministic composite Trend Score (0 to 100) and update cluster scores."""
        analyses, raw_trends = await self._resolve_analyses_and_raw_trends(cluster)

        pop_norm = self._compute_popularity(raw_trends)
        fresh_norm = self._compute_freshness(analyses, raw_trends)
        source_norm = self._compute_source_diversity(raw_trends)
        sent_norm = self._compute_sentiment(analyses)
        conf_norm = self._compute_ai_confidence(analyses)

        w_pop = settings.TREND_SCORE_POPULARITY_WEIGHT
        w_fresh = settings.TREND_SCORE_FRESHNESS_WEIGHT
        w_source = settings.TREND_SCORE_SOURCE_DIVERSITY_WEIGHT
        w_sent = settings.TREND_SCORE_SENTIMENT_WEIGHT
        w_conf = settings.TREND_SCORE_AI_CONFIDENCE_WEIGHT

        composite = (
            w_pop * pop_norm
            + w_fresh * fresh_norm
            + w_source * source_norm
            + w_sent * sent_norm
            + w_conf * conf_norm
        ) * 100.0

        final_score = round(max(0.0, min(100.0, composite)), 2)

        pop_score = round(pop_norm, 4)
        fresh_score = round(fresh_norm * 100.0, 2)
        source_score = round(source_norm * 100.0, 2)
        sent_score = round(sent_norm * 100.0, 2)

        updated_cluster = await self.repo.recalculate_score(
            cluster=cluster,
            trend_score=final_score,
            popularity_score=pop_score,
            freshness_score=fresh_score,
            source_diversity_score=source_score,
            sentiment_score=sent_score,
        )

        return updated_cluster.trend_score

    async def calculate_batch(
        self, clusters: list[TrendCluster]
    ) -> list[float]:
        """Calculate and update trend scores for a batch of TrendClusters."""
        scores = []
        for cluster in clusters:
            score = await self.calculate_score(cluster)
            scores.append(score)
        return scores


__all__ = ["TrendScoringService"]
