import asyncio
from datetime import datetime, timezone
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
from app.models.base import Base
from app.models.raw_trend import RawTrend
from app.models.trend_analysis import AnalysisStatus, TrendAnalysis
from app.repositories.trend_analysis_repository import TrendAnalysisRepository
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
            summary="PulsePop launches AI analytics suite.",
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


def test_trend_analysis_repository_crud():
    async def _test(session: AsyncSession):
        mock_ai_result = get_mock_ai_result()
        raw_trend = RawTrend(
            title="AI Trend Intelligence",
            url="https://example.com/ai-trend",
            published_at=datetime.now(timezone.utc),
            source="news",
            category="technology",
        )
        session.add(raw_trend)
        await session.commit()
        await session.refresh(raw_trend)

        repo = TrendAnalysisRepository(session)

        # 1. Check exists initially
        assert await repo.exists(raw_trend.id, "1.0") is False

        # 2. Create
        analysis = TrendAnalysis(
            raw_trend_id=raw_trend.id,
            status=AnalysisStatus.COMPLETED,
            summary=mock_ai_result.summary.summary,
            sentiment_label=mock_ai_result.sentiment.label.value,
            sentiment_confidence=mock_ai_result.sentiment.confidence,
            embedding=mock_ai_result.embedding.vector,
            entities=[e.model_dump() for e in mock_ai_result.entities.entities],
            topics=[t.value for t in mock_ai_result.topics.topics],
            provider=mock_ai_result.provider,
            model=mock_ai_result.model,
            pipeline_version="1.0",
            processing_time_ms=mock_ai_result.processing_time_ms,
            completed_at=mock_ai_result.completed_at,
        )
        created = await repo.create(analysis)
        assert created.id is not None
        assert created.raw_trend_id == raw_trend.id

        # 3. Check exists & queries
        assert await repo.exists(raw_trend.id, "1.0") is True
        by_version = await repo.get_by_raw_trend_and_version(raw_trend.id, "1.0")
        assert by_version is not None
        assert by_version.summary == "PulsePop launches AI analytics suite."

        latest = await repo.latest_analysis(raw_trend.id)
        assert latest is not None
        assert latest.id == created.id

        all_analyses = await repo.get_by_raw_trend(raw_trend.id)
        assert len(all_analyses) == 1

        # 4. Update
        created.summary = "Updated AI summary"
        updated = await repo.update(created)
        assert updated.summary == "Updated AI summary"

        # 5. Delete
        deleted = await repo.delete(created.id)
        assert deleted is True
        assert await repo.get_by_id(created.id) is None

    asyncio.run(run_in_async_session(_test))


def test_trend_analysis_service_upsert():
    async def _test(session: AsyncSession):
        mock_ai_result = get_mock_ai_result()
        raw_trend = RawTrend(
            title="PulsePop Service Test",
            url="https://example.com/service-test",
            published_at=datetime.now(timezone.utc),
            source="reddit",
            category="business",
        )
        session.add(raw_trend)
        await session.commit()
        await session.refresh(raw_trend)

        service = TrendAnalysisService(session)

        # 1. Insert on first save_analysis call
        rec1 = await service.save_analysis(raw_trend.id, mock_ai_result)
        assert rec1.id is not None
        assert rec1.status == AnalysisStatus.COMPLETED
        assert rec1.summary == "PulsePop launches AI analytics suite."

        # 2. Update (upsert) on second save_analysis call with same pipeline_version
        mock_ai_result.summary.summary = "Refreshed summary content."
        rec2 = await service.save_analysis(raw_trend.id, mock_ai_result)
        assert rec2.id == rec1.id
        assert rec2.summary == "Refreshed summary content."

        # 3. Get analysis by raw_trend_id
        list_rec = await service.get_analysis(raw_trend.id)
        assert len(list_rec) == 1
        assert list_rec[0].id == rec1.id

        # 4. Update analysis via service
        updated = await service.update_analysis(rec1.id, summary="Manually updated summary")
        assert updated is not None
        assert updated.summary == "Manually updated summary"

    asyncio.run(run_in_async_session(_test))


def test_trend_analysis_service_failed_status():
    async def _test(session: AsyncSession):
        raw_trend = RawTrend(
            title="Failed Analysis Test",
            url="https://example.com/failed-test",
            published_at=datetime.now(timezone.utc),
            source="youtube",
            category="entertainment",
        )
        session.add(raw_trend)
        await session.commit()
        await session.refresh(raw_trend)

        service = TrendAnalysisService(session)
        record = await service.save_analysis(
            raw_trend_id=raw_trend.id,
            analysis_result=None,
            error_message="Gemini API rate limit exceeded",
            status=AnalysisStatus.FAILED,
        )

        assert record.id is not None
        assert record.status == AnalysisStatus.FAILED
        assert record.error_message == "Gemini API rate limit exceeded"
        assert record.summary is None

    asyncio.run(run_in_async_session(_test))
