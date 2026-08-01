from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ingestion.models import NormalizedTrendData
from app.models.raw_trend import RawTrend


class RawTrendRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def exists_by_url(self, url: str) -> bool:
        """Check if a RawTrend record with given URL already exists."""
        result = await self.session.execute(
            select(RawTrend.id).where(RawTrend.url == url)
        )
        return result.scalar_one_or_none() is not None

    async def get_existing_urls(self, urls: list[str]) -> set[str]:
        """Return set of existing URLs from the provided list."""
        if not urls:
            return set()
        result = await self.session.execute(
            select(RawTrend.url).where(RawTrend.url.in_(urls))
        )
        return set(result.scalars().all())

    async def create(self, data: NormalizedTrendData) -> RawTrend:
        """Create and persist a single RawTrend record."""
        raw_trend = RawTrend(
            title=data.title,
            summary=data.summary,
            author=data.author,
            url=data.url,
            published_at=data.published_at,
            source=data.source_name,
            category=data.category_name,
            language=data.language,
            sentiment_score=data.sentiment_score,
            trend_score=data.trend_score,
            popularity_score=data.popularity_score,
            metadata_json=data.metadata,
        )
        self.session.add(raw_trend)
        await self.session.commit()
        await self.session.refresh(raw_trend)
        return raw_trend

    async def bulk_create(
        self, data_list: list[NormalizedTrendData]
    ) -> list[RawTrend]:
        """Bulk insert a list of NormalizedTrendData records."""
        if not data_list:
            return []

        raw_trends = [
            RawTrend(
                title=item.title,
                summary=item.summary,
                author=item.author,
                url=item.url,
                published_at=item.published_at,
                source=item.source_name,
                category=item.category_name,
                language=item.language,
                sentiment_score=item.sentiment_score,
                trend_score=item.trend_score,
                popularity_score=item.popularity_score,
                metadata_json=item.metadata,
            )
            for item in data_list
        ]
        self.session.add_all(raw_trends)
        await self.session.commit()
        for rt in raw_trends:
            await self.session.refresh(rt)
        return raw_trends


__all__ = ["RawTrendRepository"]
