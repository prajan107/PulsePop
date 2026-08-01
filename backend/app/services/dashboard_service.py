from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.models.source import Source
from app.models.trend import Trend


class DashboardService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_summary(self) -> dict:
        """Calculate and return dashboard summary aggregates."""
        total_trends = (
            await self.session.execute(select(func.count(Trend.id)))
        ).scalar_one()

        total_categories = (
            await self.session.execute(select(func.count(Category.id)))
        ).scalar_one()

        total_sources = (
            await self.session.execute(select(func.count(Source.id)))
        ).scalar_one()

        avg_trend_res = (
            await self.session.execute(
                select(func.coalesce(func.avg(Trend.trend_score), 0.0))
            )
        ).scalar_one()

        avg_sentiment_res = (
            await self.session.execute(
                select(func.coalesce(func.avg(Trend.sentiment_score), 0.0))
            )
        ).scalar_one()

        latest_query = (
            select(Trend).order_by(Trend.created_at.desc()).limit(5)
        )
        latest_result = await self.session.execute(latest_query)
        latest_trends = list(latest_result.scalars().all())

        return {
            "total_trends": total_trends,
            "total_categories": total_categories,
            "total_sources": total_sources,
            "average_trend_score": round(float(avg_trend_res), 2),
            "average_sentiment_score": round(float(avg_sentiment_res), 2),
            "latest_trends": latest_trends,
        }
