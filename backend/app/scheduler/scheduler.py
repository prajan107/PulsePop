from collections.abc import Callable, Coroutine
from dataclasses import dataclass
from typing import Any

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from loguru import logger

from app.collectors.base import BaseCollector
from app.core.database import AsyncSessionLocal
from app.services.ingestion_service import IngestionService


@dataclass
class CollectorRegistration:
    collector: BaseCollector
    interval_minutes: int


class IngestionScheduler:
    """Collector-agnostic manager for scheduling data ingestion jobs."""

    def __init__(self) -> None:
        self._scheduler = AsyncIOScheduler()
        self._is_running = False
        self._registrations: list[CollectorRegistration] = []

    @property
    def is_running(self) -> bool:
        return self._is_running

    def register_collector(
        self, collector: BaseCollector, interval_minutes: int
    ) -> None:
        """Register any BaseCollector implementation with a specific ingestion interval."""
        self._registrations.append(
            CollectorRegistration(
                collector=collector, interval_minutes=interval_minutes
            )
        )

    def _create_job_handler(
        self, collector: BaseCollector
    ) -> Callable[[], Coroutine[Any, Any, None]]:
        """Create a generic, isolated job execution closure for a BaseCollector."""

        async def _job() -> None:
            logger.info(
                "Executing scheduled ingestion job for '{}'",
                collector.source_name,
            )
            try:
                raw_items = await collector.collect()
                if not raw_items:
                    logger.info(
                        "Collector '{}' returned 0 items (mock or empty credentials)",
                        collector.source_name,
                    )
                    return

                async with AsyncSessionLocal() as session:
                    service = IngestionService(session)
                    res = await service.ingest_raw_data(raw_items)
                    logger.info(
                        "Collector '{}' ingestion completed: {}",
                        collector.source_name,
                        res,
                    )
            except Exception as e:
                logger.error(
                    "Error executing scheduled job for '{}': {}",
                    collector.source_name,
                    e,
                )

        _job.__name__ = f"collect_{collector.source_name}_job"
        return _job

    def start(self) -> None:
        """Schedule all registered collectors and start the AsyncIOScheduler."""
        if self._is_running:
            return

        logger.info("Initializing IngestionScheduler background jobs...")

        for reg in self._registrations:
            job_fn = self._create_job_handler(reg.collector)
            job_id = f"{reg.collector.source_name}_ingestion_job"
            self._scheduler.add_job(
                job_fn,
                trigger=IntervalTrigger(minutes=reg.interval_minutes),
                id=job_id,
                replace_existing=True,
            )
            logger.info(
                "Registered job '{}' every {} minutes",
                job_id,
                reg.interval_minutes,
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


__all__ = ["IngestionScheduler", "CollectorRegistration"]
