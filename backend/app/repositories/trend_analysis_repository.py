from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trend_analysis import TrendAnalysis


class TrendAnalysisRepository:
    """Repository for managing persistence operations on TrendAnalysis entities."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, analysis: TrendAnalysis) -> TrendAnalysis:
        """Create and persist a new TrendAnalysis record."""
        self.session.add(analysis)
        await self.session.commit()
        await self.session.refresh(analysis)
        return analysis

    async def get_by_id(self, analysis_id: int) -> TrendAnalysis | None:
        """Fetch a TrendAnalysis record by primary key id."""
        result = await self.session.execute(
            select(TrendAnalysis).where(TrendAnalysis.id == analysis_id)
        )
        return result.scalar_one_or_none()

    async def get_by_raw_trend(self, raw_trend_id: int) -> list[TrendAnalysis]:
        """Fetch all TrendAnalysis records associated with a raw_trend_id."""
        result = await self.session.execute(
            select(TrendAnalysis)
            .where(TrendAnalysis.raw_trend_id == raw_trend_id)
            .order_by(TrendAnalysis.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_by_raw_trend_and_version(
        self, raw_trend_id: int, pipeline_version: str = "1.0"
    ) -> TrendAnalysis | None:
        """Fetch a specific TrendAnalysis record by raw_trend_id and pipeline_version."""
        result = await self.session.execute(
            select(TrendAnalysis).where(
                TrendAnalysis.raw_trend_id == raw_trend_id,
                TrendAnalysis.pipeline_version == pipeline_version,
            )
        )
        return result.scalar_one_or_none()

    async def latest_analysis(self, raw_trend_id: int) -> TrendAnalysis | None:
        """Fetch the most recent TrendAnalysis record for a raw_trend_id."""
        result = await self.session.execute(
            select(TrendAnalysis)
            .where(TrendAnalysis.raw_trend_id == raw_trend_id)
            .order_by(TrendAnalysis.created_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def exists(
        self, raw_trend_id: int, pipeline_version: str = "1.0"
    ) -> bool:
        """Check whether a TrendAnalysis record exists for a raw_trend_id and pipeline_version."""
        result = await self.session.execute(
            select(TrendAnalysis.id).where(
                TrendAnalysis.raw_trend_id == raw_trend_id,
                TrendAnalysis.pipeline_version == pipeline_version,
            )
        )
        return result.scalar_one_or_none() is not None

    async def update(self, analysis: TrendAnalysis) -> TrendAnalysis:
        """Persist updates to an existing TrendAnalysis record."""
        await self.session.commit()
        await self.session.refresh(analysis)
        return analysis

    async def delete(self, analysis_id: int) -> bool:
        """Delete a TrendAnalysis record by id."""
        record = await self.get_by_id(analysis_id)
        if not record:
            return False
        await self.session.delete(record)
        await self.session.commit()
        return True


__all__ = ["TrendAnalysisRepository"]
