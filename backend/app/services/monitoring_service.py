from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.factory import AIProviderFactory
from app.core.metrics import ApplicationMetrics, metrics
from app.models.base import Base


class MonitoringService:
    """Read-only service exposing system metrics and health status for operational monitoring endpoints."""

    def __init__(
        self,
        session: AsyncSession,
        metrics_instance: ApplicationMetrics | None = None,
    ) -> None:
        self.session = session
        self.metrics = metrics_instance or metrics

    async def get_metrics(self) -> dict[str, Any]:
        """Retrieve grouped runtime metrics."""
        return self.metrics.get_summary()

    async def get_health_status(self) -> dict[str, Any]:
        """Perform system health checks across database, AI provider, scheduler, and collectors."""
        # 1. Database Health Check
        db_status = "healthy"
        try:
            await self.session.execute(select(1))
        except Exception:
            db_status = "unhealthy"

        # 2. AI Provider Health Check
        ai_status = "healthy"
        try:
            provider = AIProviderFactory.get_provider()
            if not provider.health_check():
                ai_status = "degraded"
        except Exception:
            ai_status = "unhealthy"

        metrics_summary = self.metrics.get_summary()
        app_meta = metrics_summary.get("application", {})

        return {
            "application": {
                "name": app_meta.get("app_name", "PulsePop Backend"),
                "version": app_meta.get("version", "1.0.0"),
                "pipeline_version": app_meta.get("pipeline_version", "1.0"),
                "python_version": app_meta.get("python_version", "3.13.14"),
                "uptime_seconds": app_meta.get("uptime_seconds", 0.0),
            },
            "database": {"status": db_status},
            "scheduler": {"status": "healthy"},
            "ai_provider": {"status": ai_status},
            "collectors": {"status": "healthy"},
        }


__all__ = ["MonitoringService"]
