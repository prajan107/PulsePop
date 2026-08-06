from datetime import datetime, timezone
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.models import AIAnalysisResult
from app.models.trend_analysis import AnalysisStatus, TrendAnalysis
from app.repositories.trend_analysis_repository import TrendAnalysisRepository


class TrendAnalysisService:
    """Service for managing persistence and retrieval of AI trend analysis results."""

    def __init__(self, session: AsyncSession) -> None:
        self.repo = TrendAnalysisRepository(session)

    async def save_analysis(
        self,
        raw_trend_id: int,
        analysis_result: AIAnalysisResult | None = None,
        error_message: str | None = None,
        status: AnalysisStatus = AnalysisStatus.COMPLETED,
        provider_version: str | None = None,
        started_at: datetime | None = None,
        retry_count: int = 0,
    ) -> TrendAnalysis:
        """Upsert AI trend analysis for a given raw_trend_id and pipeline_version.

        If a record with matching (raw_trend_id, pipeline_version) exists, updates it;
        otherwise inserts a new TrendAnalysis record.
        """
        pipeline_version = (
            analysis_result.pipeline_version if analysis_result else "1.0"
        )
        existing = await self.repo.get_by_raw_trend_and_version(
            raw_trend_id, pipeline_version
        )

        summary = analysis_result.summary.summary if analysis_result else None
        sentiment_label = (
            analysis_result.sentiment.label.value
            if (analysis_result and hasattr(analysis_result.sentiment.label, "value"))
            else (str(analysis_result.sentiment.label) if analysis_result else None)
        )
        sentiment_confidence = (
            analysis_result.sentiment.confidence if analysis_result else None
        )
        embedding = analysis_result.embedding.vector if analysis_result else None
        entities = (
            [e.model_dump() for e in analysis_result.entities.entities]
            if analysis_result
            else None
        )
        topics = (
            [
                t.value if hasattr(t, "value") else str(t)
                for t in analysis_result.topics.topics
            ]
            if analysis_result
            else None
        )
        provider = (
            analysis_result.provider
            if analysis_result
            else ("gemini" if not error_message else "system")
        )
        model = (
            analysis_result.model
            if analysis_result
            else ("gemini-2.5-flash" if not error_message else "system")
        )
        processing_time_ms = (
            analysis_result.processing_time_ms if analysis_result else None
        )
        completed_at = (
            analysis_result.completed_at
            if analysis_result
            else datetime.now(timezone.utc)
        )

        effective_status = status
        if error_message and status == AnalysisStatus.COMPLETED:
            effective_status = AnalysisStatus.FAILED

        if existing:
            existing.status = effective_status
            existing.summary = summary
            existing.sentiment_label = sentiment_label
            existing.sentiment_confidence = sentiment_confidence
            existing.embedding = embedding
            existing.entities = entities
            existing.topics = topics
            existing.provider = provider
            existing.provider_version = provider_version
            existing.model = model
            existing.processing_time_ms = processing_time_ms
            existing.error_message = error_message
            existing.retry_count = retry_count
            if started_at:
                existing.started_at = started_at
            existing.completed_at = completed_at
            return await self.repo.update(existing)

        new_analysis = TrendAnalysis(
            raw_trend_id=raw_trend_id,
            status=effective_status,
            summary=summary,
            sentiment_label=sentiment_label,
            sentiment_confidence=sentiment_confidence,
            embedding=embedding,
            entities=entities,
            topics=topics,
            provider=provider,
            provider_version=provider_version,
            model=model,
            pipeline_version=pipeline_version,
            processing_time_ms=processing_time_ms,
            error_message=error_message,
            retry_count=retry_count,
            started_at=started_at,
            completed_at=completed_at,
        )
        return await self.repo.create(new_analysis)

    async def get_analysis(self, raw_trend_id: int) -> list[TrendAnalysis]:
        """Retrieve all analysis records for a given raw_trend_id."""
        return await self.repo.get_by_raw_trend(raw_trend_id)

    async def update_analysis(
        self, analysis_id: int, **kwargs: Any
    ) -> TrendAnalysis | None:
        """Update fields on an existing TrendAnalysis record."""
        record = await self.repo.get_by_id(analysis_id)
        if not record:
            return None

        for key, value in kwargs.items():
            if hasattr(record, key):
                setattr(record, key, value)

        return await self.repo.update(record)


__all__ = ["TrendAnalysisService"]
