from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trend import Trend
from app.schemas.trend import TrendCreate, TrendUpdate


class TrendRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

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
