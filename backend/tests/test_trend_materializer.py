import asyncio
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock
import pytest
from sqlalchemy import select
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
from app.models.trend import Trend
from app.models.trend_analysis import AnalysisStatus, TrendAnalysis
from app.models.trend_cluster import TrendCluster
from app.services.dashboard_service import DashboardService
from app.services.ingestion_pipeline_service import IngestionPipelineService
from app.services.ingestion_service import IngestionService
from app.services.trend_materializer_service import TrendMaterializerService
from app.services.trend_service import TrendService


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


def get_mock_ai_result(
    title="Artificial Intelligence Shift",
    embedding=None,
    topics=None,
):
    emb_vector = embedding if embedding is not None else [0.1, 0.2, 0.3, 0.4]
    topic_list = topics if topics is not None else [TopicLabel.TECHNOLOGY, TopicLabel.ARTIFICIAL_INTELLIGENCE]

    return AIAnalysisResult(
        summary=SummaryResult(
            summary=f"Analysis of {title} with real-time vector signals.",
            key_points=["Key signal 1", "Key signal 2"],
            confidence=0.95,
            provider="gemini",
            model="gemini-2.5-flash",
        ),
        sentiment=SentimentResult(
            label=SentimentLabel.POSITIVE,
            confidence=0.91,
            reason="Positive momentum",
        ),
        embedding=EmbeddingResult(
            vector=emb_vector,
            provider="gemini",
            model="models/text-embedding-004",
            dimensions=len(emb_vector),
        ),
        entities=EntityExtractionResult(
            entities=[Entity(name="PulsePopAI", type=EntityType.TECHNOLOGY, confidence=0.98)],
            provider="gemini",
            model="gemini-2.5-flash",
        ),
        topics=TopicResult(
            topics=topic_list,
            confidence=0.96,
            provider="gemini",
            model="gemini-2.5-flash",
        ),
        processing_time_ms=120.0,
        completed_at=datetime.now(timezone.utc),
        pipeline_version="1.0",
        provider="gemini",
        model="gemini-2.5-flash",
    )


def test_full_pipeline_materializes_trend_records():
    """Verify Collector -> RawTrend -> AI Analysis -> Cluster -> Materializer -> Trend -> Dashboard/TrendService."""
    async def _test(session: AsyncSession):
        async def _mock_ai(text: str):
            if "Quantum" in text:
                return get_mock_ai_result(
                    title="Quantum Computing Breakout",
                    embedding=[0.9, -0.1, -0.2, 0.8],
                    topics=[TopicLabel.SCIENCE],
                )
            return get_mock_ai_result(title="Artificial Intelligence Shift")

        mock_pipeline = MagicMock(spec=AIProcessingPipeline)
        mock_pipeline.process_async = AsyncMock(side_effect=_mock_ai)

        pipeline_service = IngestionPipelineService(
            session=session,
            pipeline=mock_pipeline,
        )

        ingestion_service = IngestionService(
            session=session, pipeline_service=pipeline_service
        )

        # 2. Ingest raw collector items
        raw_items = [
            RawTrendData(
                title="Artificial Intelligence Shift",
                summary="AI agents and transformer architectures accelerating",
                url="https://example.com/ai-shift-1",
                published_at=datetime.now(timezone.utc),
                source="google_trends",
            ),
            RawTrendData(
                title="Quantum Computing Breakout",
                summary="Quantum chips demonstration with zero error threshold",
                url="https://example.com/quantum-1",
                published_at=datetime.now(timezone.utc),
                source="google_trends",
            ),
        ]

        stats = await ingestion_service.ingest_raw_data(raw_items)
        assert stats["inserted"] == 2
        assert stats["analyzed"] == 2

        # 3. Verify Trend records were materialized into the database
        result = await session.execute(select(Trend))
        materialized_trends = list(result.scalars().all())
        assert len(materialized_trends) == 2

        titles = [t.title for t in materialized_trends]
        assert "Artificial Intelligence Shift" in titles
        assert "Quantum Computing Breakout" in titles

        # Verify normalized popularity score scale (0.0 to 1.0)
        for trend in materialized_trends:
            assert 0.0 <= trend.popularity_score <= 1.0
            assert 0.0 <= trend.trend_score <= 100.0

        # 4. Verify TrendService list_trends returns materialized trends
        trend_service = TrendService(session)
        listed = await trend_service.list_trends(page=1, page_size=10)
        assert listed["total"] == 2
        assert len(listed["items"]) == 2

        # 5. Verify DashboardService get_summary computes stats from materialized trends
        dashboard_service = DashboardService(session)
        summary = await dashboard_service.get_summary()
        assert summary["total_trends"] == 2
        assert summary["average_trend_score"] > 0
        assert len(summary["latest_trends"]) == 2

    asyncio.run(run_in_async_session(_test))


def test_trend_materializer_service_upserts_idempotently():
    """Verify TrendMaterializerService updates existing Trend records without duplicate primary key collisions."""
    async def _test(session: AsyncSession):
        materializer = TrendMaterializerService(session)

        cluster = TrendCluster(
            canonical_title="Autonomous Agents Framework",
            canonical_summary="Initial summary for autonomous agents",
            cluster_key="autonomous-agents-framework",
            trend_count=1,
            trend_score=75.0,
            popularity_score=0.65,
            sentiment_score=0.80,
        )
        session.add(cluster)
        await session.commit()
        await session.refresh(cluster)

        # First materialization -> Insert
        trend_1 = await materializer.materialize_cluster(cluster)
        assert trend_1.id is not None
        assert trend_1.title == "Autonomous Agents Framework"
        assert trend_1.trend_score == 75.0

        # Update cluster metrics
        cluster.trend_score = 92.5
        cluster.popularity_score = 0.88
        await session.commit()

        # Second materialization -> Update
        trend_2 = await materializer.materialize_cluster(cluster)
        assert trend_2.id == trend_1.id
        assert trend_2.trend_score == 92.5
        assert trend_2.popularity_score == 0.88

        # Database should still have only 1 Trend record
        result = await session.execute(select(Trend))
        all_trends = list(result.scalars().all())
        assert len(all_trends) == 1

    asyncio.run(run_in_async_session(_test))
