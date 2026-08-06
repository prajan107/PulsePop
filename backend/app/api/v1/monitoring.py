from typing import Any
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_db
from app.services.monitoring_service import MonitoringService

router = APIRouter()


@router.get(
    "/metrics",
    status_code=status.HTTP_200_OK,
)
async def get_metrics(
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Get operational runtime metrics."""
    service = MonitoringService(db)
    return await service.get_metrics()


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
)
async def get_health(
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Get detailed health status across system components."""
    service = MonitoringService(db)
    return await service.get_health_status()
