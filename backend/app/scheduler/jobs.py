from app.collectors.google_trends_collector import GoogleTrendsCollector
from app.collectors.news_collector import NewsCollector
from app.collectors.reddit_collector import RedditCollector
from app.collectors.youtube_collector import YouTubeCollector
from app.core.config import settings
from app.scheduler.scheduler import IngestionScheduler


def create_default_scheduler() -> IngestionScheduler:
    """Instantiate and configure IngestionScheduler with all default data source collectors."""
    scheduler = IngestionScheduler()
    scheduler.register_collector(
        RedditCollector(), settings.REDDIT_INGESTION_INTERVAL_MINUTES
    )
    scheduler.register_collector(
        NewsCollector(), settings.NEWS_INGESTION_INTERVAL_MINUTES
    )
    scheduler.register_collector(
        YouTubeCollector(), settings.YOUTUBE_INGESTION_INTERVAL_MINUTES
    )
    scheduler.register_collector(
        GoogleTrendsCollector(), settings.GOOGLE_TRENDS_INGESTION_INTERVAL_MINUTES
    )
    return scheduler


__all__ = ["create_default_scheduler"]
