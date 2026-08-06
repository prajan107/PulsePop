from sqlalchemy.ext.asyncio import AsyncSession

from app.collectors.models import RawTrendData
from app.ingestion.normalizer import TrendNormalizer
from app.models.trend_analysis import AnalysisStatus
from app.repositories.raw_trend_repository import RawTrendRepository
from app.services.ingestion_pipeline_service import IngestionPipelineService


class IngestionService:
    """Service orchestrating normalization, deduplication, persistence, and AI processing of raw collector data."""

    def __init__(
        self,
        session: AsyncSession,
        pipeline_service: IngestionPipelineService | None = None,
    ) -> None:
        self.repo = RawTrendRepository(session)
        self.pipeline_service = pipeline_service or IngestionPipelineService(session)

    async def ingest_raw_data(
        self, raw_items: list[RawTrendData]
    ) -> dict[str, int]:
        """Normalize raw collector items, deduplicate by URL, bulk insert into DB, and process newly inserted trends with AI."""
        if not raw_items:
            return {"inserted": 0, "skipped": 0, "analyzed": 0, "failed": 0}

        # 1. Normalize all incoming raw items
        normalized_items = [TrendNormalizer.normalize(raw) for raw in raw_items]

        # 2. Query existing URLs from DB
        urls = [item.url for item in normalized_items if item.url]
        existing_urls = await self.repo.get_existing_urls(urls)

        # 3. Filter out duplicate URLs (from DB and batch duplicates)
        to_insert = []
        skipped_count = 0
        seen_in_batch = set()

        for item in normalized_items:
            if not item.url or item.url in existing_urls or item.url in seen_in_batch:
                skipped_count += 1
            else:
                to_insert.append(item)
                seen_in_batch.add(item.url)

        # 4. Bulk insert non-duplicate records
        analyzed_count = 0
        failed_count = 0
        if to_insert:
            inserted_records = await self.repo.bulk_create(to_insert)
            inserted_count = len(inserted_records)

            # 5. Process newly inserted trends through AI Pipeline
            analyses = await self.pipeline_service.process_batch(
                inserted_records, concurrent=True
            )
            analyzed_count = sum(
                1 for a in analyses if a.status == AnalysisStatus.COMPLETED
            )
            failed_count = sum(
                1 for a in analyses if a.status == AnalysisStatus.FAILED
            )
        else:
            inserted_count = 0

        return {
            "inserted": inserted_count,
            "skipped": skipped_count,
            "analyzed": analyzed_count,
            "failed": failed_count,
        }


__all__ = ["IngestionService"]
