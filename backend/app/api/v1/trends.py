from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_active_user
from app.dependencies.db import get_db
from app.models.user import User
from app.schemas.trend import (
    TrendCreate,
    TrendListResponse,
    TrendResponse,
    TrendUpdate,
)
from app.services.trend_service import TrendService

router = APIRouter()


@router.post(
    "",
    response_model=TrendResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_trend(
    request: TrendCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> TrendResponse:
    """Create a new Trend (Protected)."""
    service = TrendService(db)
    return await service.create_trend(request)


@router.get(
    "",
    response_model=TrendListResponse,
    status_code=status.HTTP_200_OK,
)
async def list_trends(
    search: str | None = Query(None, description="Search term for title or summary"),
    category_id: int | None = Query(None, description="Filter by category ID"),
    source_id: int | None = Query(None, description="Filter by source ID"),
    minimum_trend_score: float | None = Query(None, description="Minimum trend score filter"),
    minimum_popularity_score: float | None = Query(None, description="Minimum popularity score filter"),
    sort_by: str = Query("created_at", description="Sort field (created_at, trend_score, etc.)"),
    order: str = Query("desc", description="Sort order (asc or desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> TrendListResponse:
    """List, search, filter, and paginate trends (Public)."""
    service = TrendService(db)
    return await service.list_trends(
        search=search,
        category_id=category_id,
        source_id=source_id,
        minimum_trend_score=minimum_trend_score,
        minimum_popularity_score=minimum_popularity_score,
        sort_by=sort_by,
        order=order,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{trend_id}",
    response_model=TrendResponse,
    status_code=status.HTTP_200_OK,
)
async def get_trend(
    trend_id: int,
    db: AsyncSession = Depends(get_db),
) -> TrendResponse:
    """Get a single Trend by ID (Public)."""
    service = TrendService(db)
    return await service.get_trend(trend_id)


@router.put(
    "/{trend_id}",
    response_model=TrendResponse,
    status_code=status.HTTP_200_OK,
)
async def update_trend(
    trend_id: int,
    request: TrendUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> TrendResponse:
    """Update a Trend by ID (Protected)."""
    service = TrendService(db)
    return await service.update_trend(trend_id, request)


@router.delete(
    "/{trend_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_trend(
    trend_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> None:
    """Delete a Trend by ID (Protected)."""
    service = TrendService(db)
    await service.delete_trend(trend_id)
