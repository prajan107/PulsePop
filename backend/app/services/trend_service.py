import math
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trend import Trend
from app.repositories.trend_repository import TrendRepository
from app.schemas.trend import TrendCreate, TrendUpdate


class TrendService:
    def __init__(self, session: AsyncSession) -> None:
        self.repo = TrendRepository(session)

    async def create_trend(self, trend_data: TrendCreate) -> Trend:
        """Validate input and create a new Trend."""
        title = trend_data.title.strip() if trend_data.title else ""
        if not title:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title cannot be empty",
            )
        trend_data.title = title

        if trend_data.category_id is not None:
            if not await self.repo.category_exists(trend_data.category_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Category not found",
                )

        if trend_data.source_id is not None:
            if not await self.repo.source_exists(trend_data.source_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Source not found",
                )

        return await self.repo.create(trend_data)

    async def get_trend(self, trend_id: int) -> Trend:
        """Fetch a Trend by ID or raise 404 if not found."""
        trend = await self.repo.get_by_id(trend_id)
        if not trend:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trend not found",
            )
        return trend

    async def list_trends(
        self,
        search: str | None = None,
        category_id: int | None = None,
        source_id: int | None = None,
        minimum_trend_score: float | None = None,
        minimum_popularity_score: float | None = None,
        sort_by: str = "created_at",
        order: str = "desc",
        page: int = 1,
        page_size: int = 10,
    ) -> dict:
        """List, search, filter, and paginate trends."""
        page = max(1, page)
        page_size = max(1, min(100, page_size))
        skip = (page - 1) * page_size

        trends, total = await self.repo.search_and_filter(
            search=search,
            category_id=category_id,
            source_id=source_id,
            minimum_trend_score=minimum_trend_score,
            minimum_popularity_score=minimum_popularity_score,
            sort_by=sort_by,
            order=order,
            skip=skip,
            limit=page_size,
        )

        total_pages = math.ceil(total / page_size) if total > 0 else 0

        return {
            "items": trends,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
        }

    async def update_trend(
        self, trend_id: int, update_data: TrendUpdate
    ) -> Trend:
        """Validate and update an existing Trend."""
        existing_trend = await self.repo.get_by_id(trend_id)
        if not existing_trend:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trend not found",
            )

        if update_data.title is not None:
            title = update_data.title.strip()
            if not title:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Title cannot be empty",
                )
            update_data.title = title

        if update_data.category_id is not None:
            if not await self.repo.category_exists(update_data.category_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Category not found",
                )

        if update_data.source_id is not None:
            if not await self.repo.source_exists(update_data.source_id):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Source not found",
                )

        updated = await self.repo.update(trend_id, update_data)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trend not found",
            )
        return updated

    async def delete_trend(self, trend_id: int) -> None:
        """Delete a Trend by ID."""
        existing_trend = await self.repo.get_by_id(trend_id)
        if not existing_trend:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trend not found",
            )
        await self.repo.delete(trend_id)
