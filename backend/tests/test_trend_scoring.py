import asyncio
from datetime import datetime, timezone
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.models.base import Base
from app.models.raw_trend import RawTrend
from app.models.trend_analysis import AnalysisStatus, TrendAnalysis
from app.models.trend_cluster import TrendCluster
from app.services.trend_scoring_service import TrendScoringService


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


def test_trend_scoring_service_computes_bounded_scores():
    async def _test(session: AsyncSession):
        raw1 = RawTrend(
            title="Tech Surge 2026",
            url="https://example.com/tech-surge",
            published_at=datetime.now(timezone.utc),
            source="news",
            category="technology",
            popularity_score=0.9,
        )
        raw2 = RawTrend(
            title="Tech Surge Reddit Discussion",
            url="https://example.com/reddit-tech-surge",
            published_at=datetime.now(timezone.utc),
            source="reddit",
            category="technology",
            popularity_score=0.8,
            metadata_json={"score": 1500, "num_comments": 250},
        )
        session.add_all([raw1, raw2])
        await session.commit()
        for r in [raw1, raw2]:
            await session.refresh(r)

        cluster = TrendCluster(
            canonical_title="Tech Surge 2026",
            canonical_summary="Widespread tech market rally.",
            cluster_key="tech-surge-2026",
            trend_count=2,
        )
        session.add(cluster)
        await session.commit()
        await session.refresh(cluster)

        analysis1 = TrendAnalysis(
            raw_trend_id=raw1.id,
            cluster_id=cluster.id,
            status=AnalysisStatus.COMPLETED,
            summary="Tech market rally expands.",
            sentiment_label="positive",
            sentiment_confidence=0.95,
            embedding=[0.5, 0.5],
            entities=[{"name": "Tech", "confidence": 0.95}],
            topics=["TECHNOLOGY"],
            provider="gemini",
            model="gemini-2.5-flash",
        )
        analysis2 = TrendAnalysis(
            raw_trend_id=raw2.id,
            cluster_id=cluster.id,
            status=AnalysisStatus.COMPLETED,
            summary="Reddit users react to tech rally.",
            sentiment_label="positive",
            sentiment_confidence=0.88,
            embedding=[0.52, 0.48],
            entities=[{"name": "Tech", "confidence": 0.90}],
            topics=["TECHNOLOGY"],
            provider="gemini",
            model="gemini-2.5-flash",
        )
        session.add_all([analysis1, analysis2])
        await session.commit()

        scoring_service = TrendScoringService(session)
        score = await scoring_service.calculate_score(cluster)

        assert 0.0 <= score <= 100.0
        assert cluster.trend_score == score
        assert cluster.popularity_score > 0.0
        assert cluster.freshness_score > 0.0
        assert cluster.source_diversity_score == pytest.approx(50.0)  # 2 sources (news, reddit) = 0.5 * 100
        assert cluster.last_calculated_at is not None

    asyncio.run(run_in_async_session(_test))
