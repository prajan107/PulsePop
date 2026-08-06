import asyncio
from datetime import datetime, timezone
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.models.base import Base
from app.models.raw_trend import RawTrend
from app.models.trend_analysis import AnalysisStatus, TrendAnalysis
from app.models.trend_cluster import TrendCluster
from app.repositories.trend_cluster_repository import TrendClusterRepository
from app.services.trend_correlation_service import (
    TrendCorrelationService,
    compute_cosine_similarity,
    compute_jaccard_similarity,
    generate_deterministic_cluster_key,
)


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


def test_similarity_and_slug_utilities():
    # Cosine similarity
    vec1 = [1.0, 0.0, 0.0]
    vec2 = [1.0, 0.0, 0.0]
    assert compute_cosine_similarity(vec1, vec2) == pytest.approx(1.0)

    vec3 = [0.0, 1.0, 0.0]
    assert compute_cosine_similarity(vec1, vec3) == pytest.approx(0.0)

    # Jaccard similarity
    set1 = {"AI", "TECH"}
    set2 = {"AI", "SCIENCE"}
    assert compute_jaccard_similarity(set1, set2) == pytest.approx(1.0 / 3.0)

    # Deterministic cluster key
    key = generate_deterministic_cluster_key("Apple MacBook AI", ["Apple", "MacBook"], ["TECHNOLOGY"])
    assert key == "apple-macbook-technology"


def test_trend_correlation_service_groups_similar_trends():
    async def _test(session: AsyncSession):
        raw1 = RawTrend(
            title="Apple Launches M4 MacBook Air with AI Features",
            url="https://example.com/macbook-m4",
            published_at=datetime.now(timezone.utc),
            source="news",
            category="technology",
        )
        raw2 = RawTrend(
            title="MacBook Air M4 Announced with Gemini AI Integration",
            url="https://example.com/macbook-gemini",
            published_at=datetime.now(timezone.utc),
            source="reddit",
            category="technology",
        )
        raw3 = RawTrend(
            title="Global Stock Markets Rally After Fed Rate Decision",
            url="https://example.com/fed-rates",
            published_at=datetime.now(timezone.utc),
            source="news",
            category="finance",
        )
        session.add_all([raw1, raw2, raw3])
        await session.commit()
        for r in [raw1, raw2, raw3]:
            await session.refresh(r)

        analysis1 = TrendAnalysis(
            raw_trend_id=raw1.id,
            status=AnalysisStatus.COMPLETED,
            summary="Apple unveiled the M4 MacBook Air packed with AI features.",
            sentiment_label="positive",
            sentiment_confidence=0.95,
            embedding=[0.8, 0.2, 0.1, 0.5],
            entities=[{"name": "Apple", "type": "COMPANY"}, {"name": "MacBook", "type": "PRODUCT"}],
            topics=["TECHNOLOGY", "ARTIFICIAL_INTELLIGENCE"],
            provider="gemini",
            model="gemini-2.5-flash",
        )
        analysis2 = TrendAnalysis(
            raw_trend_id=raw2.id,
            status=AnalysisStatus.COMPLETED,
            summary="MacBook Air M4 comes with Gemini AI capabilities.",
            sentiment_label="positive",
            sentiment_confidence=0.90,
            embedding=[0.82, 0.18, 0.12, 0.48],
            entities=[{"name": "Apple", "type": "COMPANY"}, {"name": "MacBook", "type": "PRODUCT"}],
            topics=["TECHNOLOGY", "ARTIFICIAL_INTELLIGENCE"],
            provider="gemini",
            model="gemini-2.5-flash",
        )
        analysis3 = TrendAnalysis(
            raw_trend_id=raw3.id,
            status=AnalysisStatus.COMPLETED,
            summary="Fed holds rates steady causing stock market surge.",
            sentiment_label="positive",
            sentiment_confidence=0.85,
            embedding=[-0.5, 0.9, -0.2, -0.1],
            entities=[{"name": "Federal Reserve", "type": "ORGANIZATION"}],
            topics=["FINANCE", "BUSINESS"],
            provider="gemini",
            model="gemini-2.5-flash",
        )
        session.add_all([analysis1, analysis2, analysis3])
        await session.commit()
        for a in [analysis1, analysis2, analysis3]:
            await session.refresh(a)

        correlation_service = TrendCorrelationService(session)

        c1 = await correlation_service.correlate_analysis(analysis1)
        assert c1.id is not None
        assert c1.trend_count == 1

        c2 = await correlation_service.correlate_analysis(analysis2)
        assert c2.id == c1.id  # Same cluster due to high similarity!
        assert c2.trend_count == 2

        c3 = await correlation_service.correlate_analysis(analysis3)
        assert c3.id != c1.id  # Separate cluster for finance trend!
        assert c3.trend_count == 1

    asyncio.run(run_in_async_session(_test))
