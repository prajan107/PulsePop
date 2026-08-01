from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from loguru import logger

from app.core.config import settings
from app.scheduler.jobs import collect_news_job, collect_reddit_job


class IngestionScheduler:
    """Manager for scheduling and orchestrating ingestion background jobs using APScheduler."""

    def __init__(self) -> None:
        self._scheduler = AsyncIOScheduler()
        self._is_running = False

    @property
    def is_running(self) -> bool:
        return self._is_running

    def start(self) -> None:
        """Register scheduled ingestion jobs and start the AsyncIOScheduler."""
        if self._is_running:
            return

        logger.info("Initializing IngestionScheduler background jobs...")

        self._scheduler.add_job(
            collect_reddit_job,
            trigger=IntervalTrigger(
                minutes=settings.REDDIT_INGESTION_INTERVAL_MINUTES
            ),
            id="reddit_ingestion_job",
            replace_existing=True,
        )

        self._scheduler.add_job(
            collect_news_job,
            trigger=IntervalTrigger(
                minutes=settings.NEWS_INGESTION_INTERVAL_MINUTES
            ),
            id="news_ingestion_job",
            replace_existing=True,
        )

        self._scheduler.start()
        self._is_running = True
        logger.info("IngestionScheduler started successfully.")

    def shutdown(self) -> None:
        """Gracefully shut down the AsyncIOScheduler."""
        if self._is_running and self._scheduler.running:
            logger.info("Shutting down IngestionScheduler...")
            self._scheduler.shutdown(wait=False)
            self._is_running = False
            logger.info("IngestionScheduler shut down complete.")


__all__ = ["IngestionScheduler"]
