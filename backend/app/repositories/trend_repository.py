from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.models.source import Source
from app.models.trend import Trend
from app.schemas.trend import TrendCreate, TrendUpdate


class TrendRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def category_exists(self, category_id: int) -> bool:
        """Check if a Category exists by ID."""
        result = await self.session.execute(
            select(Category.id).where(Category.id == category_id)
        )
        return result.scalar_one_or_none() is not None

    async def source_exists(self, source_id: int) -> bool:
        """Check if a Source exists by ID."""
        result = await self.session.execute(
            select(Source.id).where(Source.id == source_id)
        )
        return result.scalar_one_or_none() is not None

    async def create(self, trend_data: TrendCreate) -> Trend:
        """Create and persist a new Trend entity."""
        trend = Trend(
            title=trend_data.title,
            summary=trend_data.summary,
            category_id=trend_data.category_id,
            source_id=trend_data.source_id,
            sentiment_score=trend_data.sentiment_score,
            trend_score=trend_data.trend_score,
            popularity_score=trend_data.popularity_score,
        )
        self.session.add(trend)
        await self.session.commit()
        await self.session.refresh(trend)
        return trend

    async def get_by_id(self, trend_id: int) -> Trend | None:
        """Retrieve a Trend entity by primary key ID."""
        result = await self.session.execute(
            select(Trend).where(Trend.id == trend_id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Trend]:
        """Retrieve a list of Trend entities with pagination."""
        result = await self.session.execute(
            select(Trend).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def search_and_filter(
        self,
        search: str | None = None,
        category_id: int | None = None,
        source_id: int | None = None,
        minimum_trend_score: float | None = None,
        minimum_popularity_score: float | None = None,
        sort_by: str = "created_at",
        order: str = "desc",
        skip: int = 0,
        limit: int = 10,
    ) -> tuple[list[Trend], int]:
        """Search and filter trends with sorting and pagination."""
        query = select(Trend)

        if search and search.strip():
            search_pattern = f"%{search.strip()}%"
            query = query.where(
                (Trend.title.ilike(search_pattern))
                | (Trend.summary.ilike(search_pattern))
            )

        if category_id is not None:
            query = query.where(Trend.category_id == category_id)

        if source_id is not None:
            query = query.where(Trend.source_id == source_id)

        if minimum_trend_score is not None:
            query = query.where(Trend.trend_score >= minimum_trend_score)

        if minimum_popularity_score is not None:
            query = query.where(
                Trend.popularity_score >= minimum_popularity_score
            )

        # Count total matching rows
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.session.execute(count_query)
        total = total_result.scalar_one()

        # Dynamic sorting
        allowed_sort_fields = {
            "created_at": Trend.created_at,
            "updated_at": Trend.updated_at,
            "trend_score": Trend.trend_score,
            "popularity_score": Trend.popularity_score,
            "sentiment_score": Trend.sentiment_score,
            "title": Trend.title,
        }
        sort_col = allowed_sort_fields.get(sort_by, Trend.created_at)

        if order.lower() == "asc":
            query = query.order_by(sort_col.asc())
        else:
            query = query.order_by(sort_col.desc())

        # Pagination
        query = query.offset(skip).limit(limit)

        result = await self.session.execute(query)
        trends = list(result.scalars().all())
        return trends, total

    async def update(self, trend_id: int, update_data: TrendUpdate) -> Trend | None:
        """Update an existing Trend entity with non-None attributes."""
        trend = await self.get_by_id(trend_id)
        if not trend:
            return None

        update_dict = update_data.model_dump(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(trend, key, value)

        self.session.add(trend)
        await self.session.commit()
        await self.session.refresh(trend)
        return trend

    async def delete(self, trend_id: int) -> bool:
        """Delete a Trend entity by primary key ID."""
        trend = await self.get_by_id(trend_id)
        if not trend:
            return False

        await self.session.delete(trend)
        await self.session.commit()
        return True
