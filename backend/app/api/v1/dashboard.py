from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_db
from app.schemas.dashboard import DashboardSummaryResponse
from app.services.dashboard_service import DashboardService

router = APIRouter()


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
    status_code=status.HTTP_200_OK,
)
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db),
) -> DashboardSummaryResponse:
    """Get dashboard aggregate summary statistics (Public)."""
    service = DashboardService(db)
    return await service.get_summary()
