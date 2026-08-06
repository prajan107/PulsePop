import asyncio
from datetime import datetime, timezone
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.models.base import Base
from app.models.raw_trend import RawTrend
from app.models.trend_analysis import AnalysisStatus, TrendAnalysis
from app.models.trend_cluster import TrendCluster
from app.services.analytics_service import AnalyticsService


async def setup_test_db():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session_factory = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session_factory() as session:
        # Populate test data
        raw1 = RawTrend(
            title="AI Revolution 2026",
            url="https://example.com/ai-rev",
            published_at=datetime.now(timezone.utc),
            source="news",
            category="technology",
        )
        raw2 = RawTrend(
            title="AI Revolution Discussion",
            url="https://example.com/ai-rev-reddit",
            published_at=datetime.now(timezone.utc),
            source="reddit",
            category="technology",
        )
        session.add_all([raw1, raw2])
        await session.commit()
        for r in [raw1, raw2]:
            await session.refresh(r)

        cluster = TrendCluster(
            canonical_title="AI Revolution 2026",
            canonical_summary="Deep dive into AI advancements.",
            cluster_key="ai-revolution-2026",
            trend_score=92.5,
            trend_count=2,
        )
        session.add(cluster)
        await session.commit()
        await session.refresh(cluster)

        an1 = TrendAnalysis(
            raw_trend_id=raw1.id,
            cluster_id=cluster.id,
            status=AnalysisStatus.COMPLETED,
            summary="AI advancements accelerate.",
            sentiment_label="positive",
            sentiment_confidence=0.95,
            embedding=[0.1, 0.2],
            entities=[{"name": "OpenAI", "type": "COMPANY", "confidence": 0.98}],
            topics=["ARTIFICIAL_INTELLIGENCE", "TECHNOLOGY"],
            provider="gemini",
            model="gemini-2.5-flash",
            processing_time_ms=120.0,
        )
        an2 = TrendAnalysis(
            raw_trend_id=raw2.id,
            cluster_id=cluster.id,
            status=AnalysisStatus.COMPLETED,
            summary="Reddit reacts to AI surge.",
            sentiment_label="positive",
            sentiment_confidence=0.90,
            embedding=[0.12, 0.18],
            entities=[{"name": "OpenAI", "type": "COMPANY", "confidence": 0.92}],
            topics=["ARTIFICIAL_INTELLIGENCE"],
            provider="gemini",
            model="gemini-2.5-flash",
            processing_time_ms=110.0,
        )
        session.add_all([an1, an2])
        await session.commit()

        yield session

    await engine.dispose()


def test_analytics_service_methods():
    async def _test():
        async for session in setup_test_db():
            service = AnalyticsService(session)

            overview = await service.get_overview(days=7)
            assert overview.total_raw_trends == 2
            assert overview.total_clusters == 1
            assert overview.average_trend_score == pytest.approx(92.5)

            top_trends = await service.get_top_trends(limit=5)
            assert len(top_trends) == 1
            assert top_trends[0].cluster_key == "ai-revolution-2026"

            topics = await service.get_trending_topics(limit=5)
            assert len(topics) >= 1
            assert topics[0].topic == "ARTIFICIAL_INTELLIGENCE"

            entities = await service.get_trending_entities(limit=5)
            assert len(entities) == 1
            assert entities[0].entity_name == "OpenAI"

            sent = await service.get_sentiment_distribution()
            assert sent.positive == 2
            assert sent.positive_percentage == 100.0

            sources = await service.get_source_distribution()
            assert len(sources) == 2

    asyncio.run(_test())


def test_analytics_api_endpoints():
    async def _test():
        async for session in setup_test_db():
            from app.dependencies.db import get_db

            app.dependency_overrides[get_db] = lambda: session

            async with AsyncClient(
                transport=ASGITransport(app=app), base_url="http://test"
            ) as client:
                res_overview = await client.get("/api/v1/analytics/overview?days=7")
                assert res_overview.status_code == 200
                data_ov = res_overview.json()
                assert data_ov["total_raw_trends"] == 2

                res_top = await client.get("/api/v1/analytics/top-trends?limit=5")
                assert res_top.status_code == 200
                assert len(res_top.json()) == 1

                res_topics = await client.get("/api/v1/analytics/topics")
                assert res_topics.status_code == 200

                res_entities = await client.get("/api/v1/analytics/entities")
                assert res_entities.status_code == 200

                res_sent = await client.get("/api/v1/analytics/sentiment")
                assert res_sent.status_code == 200

                res_sources = await client.get("/api/v1/analytics/sources")
                assert res_sources.status_code == 200

            app.dependency_overrides.clear()

    asyncio.run(_test())
