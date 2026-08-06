import asyncio
from unittest.mock import AsyncMock, MagicMock
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.metrics import ApplicationMetrics
from app.main import app
from app.models.base import Base
from app.services.monitoring_service import MonitoringService


async def setup_test_db():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session_factory = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session_factory() as session:
        yield session

    await engine.dispose()


def test_application_metrics_tracking():
    metrics_tracker = ApplicationMetrics()
    metrics_tracker.record_raw_trends(5)
    metrics_tracker.record_analysis(150.0, success=True)
    metrics_tracker.record_analysis(0.0, success=False)
    metrics_tracker.record_cluster(2)
    metrics_tracker.record_collector(success=True)
    metrics_tracker.record_collector(success=False)

    summary = metrics_tracker.get_summary()
    assert "application" in summary
    assert "collectors" in summary
    assert "ai" in summary
    assert "clusters" in summary

    assert summary["collectors"]["requests"] == 2
    assert summary["collectors"]["failures"] == 1
    assert summary["ai"]["raw_trends_processed"] == 5
    assert summary["ai"]["completed_analyses"] == 1
    assert summary["ai"]["failed_analyses"] == 1
    assert summary["ai"]["average_processing_time_ms"] == pytest.approx(150.0)
    assert summary["clusters"]["clusters"] == 2


def test_monitoring_service_and_api():
    async def _test():
        async for session in setup_test_db():
            from app.dependencies.db import get_db

            app.dependency_overrides[get_db] = lambda: session

            async with AsyncClient(
                transport=ASGITransport(app=app), base_url="http://test"
            ) as client:
                res_metrics = await client.get("/api/v1/monitoring/metrics")
                assert res_metrics.status_code == 200
                metrics_data = res_metrics.json()
                assert "application" in metrics_data
                assert "ai" in metrics_data

                res_health = await client.get("/api/v1/monitoring/health")
                assert res_health.status_code == 200
                health_data = res_health.json()
                assert health_data["database"]["status"] == "healthy"
                assert health_data["scheduler"]["status"] == "healthy"
                assert "application" in health_data

            app.dependency_overrides.clear()

    asyncio.run(_test())
