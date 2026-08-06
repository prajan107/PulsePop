import asyncio
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.ai.models import (
    AIAnalysisResult,
    EmbeddingResult,
    Entity,
    EntityExtractionResult,
    EntityType,
    SentimentLabel,
    SentimentResult,
    SummaryResult,
    TopicLabel,
    TopicResult,
)
from app.ai.pipeline import AIProcessingPipeline
from app.collectors.models import RawTrendData
from app.models.base import Base
from app.models.raw_trend import RawTrend
from app.models.trend_analysis import AnalysisStatus, TrendAnalysis
from app.services.ingestion_pipeline_service import IngestionPipelineService
from app.services.ingestion_service import IngestionService
from app.services.trend_analysis_service import TrendAnalysisService


async def run_in_async_session(test_fn):
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session_factory = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session_factory() as session:
        await test_fn(session)

    await engine.dispose()


def get_mock_ai_result():
    return AIAnalysisResult(
        summary=SummaryResult(
            summary="PulsePop AI intelligence platform tracks emerging trends.",
            key_points=["Real-time intelligence", "Trend persistence"],
            confidence=0.96,
            provider="gemini",
            model="gemini-2.5-flash",
        ),
        sentiment=SentimentResult(
            label=SentimentLabel.POSITIVE,
            confidence=0.92,
            reason="Positive market reception",
        ),
        embedding=EmbeddingResult(
            vector=[0.12, -0.45, 0.78, 0.33],
            provider="gemini",
            model="models/text-embedding-004",
            dimensions=4,
        ),
        entities=EntityExtractionResult(
            entities=[
                Entity(name="PulsePop", type=EntityType.COMPANY, confidence=0.99)
            ],
            provider="gemini",
            model="gemini-2.5-flash",
        ),
        topics=TopicResult(
            topics=[TopicLabel.TECHNOLOGY, TopicLabel.ARTIFICIAL_INTELLIGENCE],
            confidence=0.95,
            provider="gemini",
            model="gemini-2.5-flash",
        ),
        processing_time_ms=145.5,
        completed_at=datetime.now(timezone.utc),
        pipeline_version="1.0",
        provider="gemini",
        model="gemini-2.5-flash",
    )


def test_ingestion_pipeline_triggers_ai_only_for_new_trends():
    async def _test(session: AsyncSession):
        # 1. Pre-insert an existing trend to test duplicate URL skipping
        existing_raw = RawTrend(
            title="Existing Trend",
            url="https://example.com/existing",
            published_at=datetime.now(timezone.utc),
            source="news",
            category="technology",
        )
        session.add(existing_raw)
        await session.commit()

        # 2. Mock AI pipeline
        mock_pipeline = MagicMock(spec=AIProcessingPipeline)
        mock_pipeline.process_async = AsyncMock(return_value=get_mock_ai_result())

        pipeline_service = IngestionPipelineService(
            session=session,
            pipeline=mock_pipeline,
            analysis_service=TrendAnalysisService(session),
        )

        ingestion_service = IngestionService(
            session=session, pipeline_service=pipeline_service
        )

        # 3. Batch contains 2 new items + 1 duplicate item
        raw_batch = [
            RawTrendData(
                title="New Trend 1",
                url="https://example.com/new-1",
                published_at=datetime.now(timezone.utc),
                source="news",
            ),
            RawTrendData(
                title="New Trend 2",
                url="https://example.com/new-2",
                published_at=datetime.now(timezone.utc),
                source="reddit",
            ),
            RawTrendData(
                title="Duplicate Trend",
                url="https://example.com/existing",  # Duplicate URL!
                published_at=datetime.now(timezone.utc),
                source="news",
            ),
        ]

        stats = await ingestion_service.ingest_raw_data(raw_batch)

        assert stats["inserted"] == 2
        assert stats["skipped"] == 1
        assert stats["analyzed"] == 2
        assert stats["failed"] == 0

        # AI pipeline should only be called twice (for the 2 newly inserted trends)
        assert mock_pipeline.process_async.call_count == 2

        # Check TrendAnalysis records exist for newly inserted trends
        analysis_service = TrendAnalysisService(session)
        analyses_1 = await analysis_service.get_analysis(existing_raw.id)
        assert len(analyses_1) == 0  # Duplicate skipped AI

    asyncio.run(run_in_async_session(_test))


def test_ingestion_pipeline_handles_partial_ai_failure():
    async def _test(session: AsyncSession):
        mock_ai_result = get_mock_ai_result()

        # Pipeline succeeds for first item, fails for second item
        mock_pipeline = MagicMock(spec=AIProcessingPipeline)

        async def _side_effect(text: str):
            if "Fail" in text:
                raise RuntimeError("LLM API Timeout Error")
            return mock_ai_result

        mock_pipeline.process_async = AsyncMock(side_effect=_side_effect)

        pipeline_service = IngestionPipelineService(
            session=session,
            pipeline=mock_pipeline,
            analysis_service=TrendAnalysisService(session),
        )

        ingestion_service = IngestionService(
            session=session, pipeline_service=pipeline_service
        )

        raw_batch = [
            RawTrendData(
                title="Normal Trend",
                url="https://example.com/normal",
                published_at=datetime.now(timezone.utc),
                source="news",
            ),
            RawTrendData(
                title="Failing Trend",
                url="https://example.com/failing",
                published_at=datetime.now(timezone.utc),
                source="youtube",
            ),
        ]

        stats = await ingestion_service.ingest_raw_data(raw_batch)

        assert stats["inserted"] == 2
        assert stats["skipped"] == 0
        assert stats["analyzed"] == 1
        assert stats["failed"] == 1

    asyncio.run(run_in_async_session(_test))
