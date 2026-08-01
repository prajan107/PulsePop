from pydantic import BaseModel

from app.schemas.trend import TrendResponse


class DashboardSummaryResponse(BaseModel):
    total_trends: int
    total_categories: int
    total_sources: int
    average_trend_score: float
    average_sentiment_score: float
    latest_trends: list[TrendResponse]
