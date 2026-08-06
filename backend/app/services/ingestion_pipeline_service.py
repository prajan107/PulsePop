import asyncio
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.pipeline import AIProcessingPipeline
from app.core.metrics import metrics
from app.models.raw_trend import RawTrend
from app.models.trend_analysis import AnalysisStatus, TrendAnalysis
from app.services.trend_analysis_service import TrendAnalysisService
from app.services.trend_correlation_service import TrendCorrelationService
from app.services.trend_materializer_service import TrendMaterializerService
from app.services.trend_scoring_service import TrendScoringService


class IngestionPipelineService:
    """Service orchestrating AI analysis, correlation, scoring, and materialization for RawTrend records."""

    def __init__(
        self,
        session: AsyncSession,
        pipeline: AIProcessingPipeline | None = None,
        analysis_service: TrendAnalysisService | None = None,
        correlation_service: TrendCorrelationService | None = None,
        scoring_service: TrendScoringService | None = None,
        materializer_service: TrendMaterializerService | None = None,
    ) -> None:
        self.session = session
        self.pipeline = pipeline or AIProcessingPipeline()
        self.analysis_service = analysis_service or TrendAnalysisService(session)
        self.correlation_service = correlation_service or TrendCorrelationService(session)
        self.scoring_service = scoring_service or TrendScoringService(session)
        self.materializer_service = materializer_service or TrendMaterializerService(session)

    async def process_raw_trend(self, raw_trend: RawTrend) -> TrendAnalysis:
        """Process a single RawTrend through AIProcessingPipeline and persist the result."""
        started_at = datetime.now(timezone.utc)
        input_text = f"{raw_trend.title}\n{raw_trend.summary or ''}".strip()
        metrics.record_raw_trends(1)

        try:
            ai_result = await self.pipeline.process_async(input_text)
            analysis = await self.analysis_service.save_analysis(
                raw_trend_id=raw_trend.id,
                analysis_result=ai_result,
                status=AnalysisStatus.COMPLETED,
                started_at=started_at,
            )
            metrics.record_analysis(ai_result.processing_time_ms, success=True)

            # Correlate, score, and materialize
            cluster = await self.correlation_service.correlate_analysis(analysis)
            await self.scoring_service.calculate_score(cluster)
            await self.materializer_service.materialize_cluster(cluster)
            return analysis
        except Exception as e:
            metrics.record_analysis(success=False)
            return await self.analysis_service.save_analysis(
                raw_trend_id=raw_trend.id,
                analysis_result=None,
                error_message=str(e),
                status=AnalysisStatus.FAILED,
                started_at=started_at,
            )

    async def process_batch(
        self, raw_trends: list[RawTrend], concurrent: bool = True
    ) -> list[TrendAnalysis]:
        """Process a batch of RawTrends safely, continuing execution even if individual trends fail."""
        if not raw_trends:
            return []

        metrics.record_raw_trends(len(raw_trends))

        if concurrent:
            async def _run_ai(trend: RawTrend):
                input_text = f"{trend.title}\n{trend.summary or ''}".strip()
                started_at = datetime.now(timezone.utc)
                try:
                    res = await self.pipeline.process_async(input_text)
                    return (trend.id, res, None, started_at)
                except Exception as e:
                    return (trend.id, None, str(e), started_at)

            ai_results = await asyncio.gather(
                *[_run_ai(t) for t in raw_trends], return_exceptions=True
            )

            analyses: list[TrendAnalysis] = []
            for item in ai_results:
                if isinstance(item, tuple):
                    trend_id, ai_res, err, started_at = item
                    if err:
                        metrics.record_analysis(success=False)
                        analysis = await self.analysis_service.save_analysis(
                            raw_trend_id=trend_id,
                            analysis_result=None,
                            error_message=err,
                            status=AnalysisStatus.FAILED,
                            started_at=started_at,
                        )
                    else:
                        metrics.record_analysis(ai_res.processing_time_ms, success=True)
                        analysis = await self.analysis_service.save_analysis(
                            raw_trend_id=trend_id,
                            analysis_result=ai_res,
                            status=AnalysisStatus.COMPLETED,
                            started_at=started_at,
                        )
                    analyses.append(analysis)
                elif isinstance(item, Exception):
                    metrics.record_analysis(success=False)

            # Correlate, Score & Materialize completed analyses
            completed_analyses = [
                a for a in analyses if a.status == AnalysisStatus.COMPLETED
            ]
            if completed_analyses:
                clusters = await self.correlation_service.correlate_batch(completed_analyses)
                await self.scoring_service.calculate_batch(clusters)
                await self.materializer_service.materialize_batch(clusters)

            return analyses
        else:
            analyses = []
            for trend in raw_trends:
                analysis = await self.process_raw_trend(trend)
                analyses.append(analysis)
            return analyses


__all__ = ["IngestionPipelineService"]
