from loguru import logger

from app.collectors.news_collector import NewsCollector
from app.collectors.reddit_collector import RedditCollector
from app.core.database import AsyncSessionLocal
from app.services.ingestion_service import IngestionService


async def collect_reddit_job() -> None:
    """Scheduled job to collect trending posts from Reddit and persist via IngestionService."""
    logger.info("Executing scheduled job: collect_reddit_job")
    collector = RedditCollector()
    try:
        raw_items = await collector.collect()
        if not raw_items:
            logger.info("Reddit collector returned 0 items (mock or empty credentials)")
            return

        async with AsyncSessionLocal() as session:
            service = IngestionService(session)
            res = await service.ingest_raw_data(raw_items)
            logger.info("Reddit ingestion job completed: {}", res)
    except Exception as e:
        logger.error("Error executing collect_reddit_job: {}", e)


async def collect_news_job() -> None:
    """Scheduled job to collect top headlines from NewsAPI and persist via IngestionService."""
    logger.info("Executing scheduled job: collect_news_job")
    collector = NewsCollector()
    try:
        raw_items = await collector.collect()
        if not raw_items:
            logger.info("News collector returned 0 items (mock or empty credentials)")
            return

        async with AsyncSessionLocal() as session:
            service = IngestionService(session)
            res = await service.ingest_raw_data(raw_items)
            logger.info("News ingestion job completed: {}", res)
    except Exception as e:
        logger.error("Error executing collect_news_job: {}", e)


__all__ = ["collect_reddit_job", "collect_news_job"]
