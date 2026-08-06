from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.db import get_db
from app.schemas.analytics import (
    AnalyticsOverviewResponse,
    SentimentDistributionResponse,
    SourceDistributionResponse,
    TopTrendResponse,
    TrendingEntityResponse,
    TrendingTopicResponse,
)
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get(
    "/overview",
    response_model=AnalyticsOverviewResponse,
    status_code=status.HTTP_200_OK,
)
async def get_overview(
    days: int | None = Query(None, ge=1, description="Optional time window in days"),
    db: AsyncSession = Depends(get_db),
) -> AnalyticsOverviewResponse:
    """Get high-level overview analytics statistics."""
    service = AnalyticsService(db)
    return await service.get_overview(days=days)


@router.get(
    "/top-trends",
    response_model=list[TopTrendResponse],
    status_code=status.HTTP_200_OK,
)
async def get_top_trends(
    days: int | None = Query(None, ge=1, description="Optional time window in days"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of top trends to return"),
    db: AsyncSession = Depends(get_db),
) -> list[TopTrendResponse]:
    """Get top-scoring trend clusters."""
    service = AnalyticsService(db)
    return await service.get_top_trends(days=days, limit=limit)


@router.get(
    "/topics",
    response_model=list[TrendingTopicResponse],
    status_code=status.HTTP_200_OK,
)
async def get_trending_topics(
    days: int | None = Query(None, ge=1, description="Optional time window in days"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of topics to return"),
    db: AsyncSession = Depends(get_db),
) -> list[TrendingTopicResponse]:
    """Get top trending topics across analyzed trends."""
    service = AnalyticsService(db)
    return await service.get_trending_topics(days=days, limit=limit)


@router.get(
    "/entities",
    response_model=list[TrendingEntityResponse],
    status_code=status.HTTP_200_OK,
)
async def get_trending_entities(
    days: int | None = Query(None, ge=1, description="Optional time window in days"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of entities to return"),
    db: AsyncSession = Depends(get_db),
) -> list[TrendingEntityResponse]:
    """Get top extracted entities across analyzed trends."""
    service = AnalyticsService(db)
    return await service.get_trending_entities(days=days, limit=limit)


@router.get(
    "/sentiment",
    response_model=SentimentDistributionResponse,
    status_code=status.HTTP_200_OK,
)
async def get_sentiment_distribution(
    days: int | None = Query(None, ge=1, description="Optional time window in days"),
    db: AsyncSession = Depends(get_db),
) -> SentimentDistributionResponse:
    """Get overall sentiment distribution statistics."""
    service = AnalyticsService(db)
    return await service.get_sentiment_distribution(days=days)


@router.get(
    "/sources",
    response_model=list[SourceDistributionResponse],
    status_code=status.HTTP_200_OK,
)
async def get_source_distribution(
    days: int | None = Query(None, ge=1, description="Optional time window in days"),
    db: AsyncSession = Depends(get_db),
) -> list[SourceDistributionResponse]:
    """Get distribution of trends per data source platform."""
    service = AnalyticsService(db)
    return await service.get_source_distribution(days=days)
