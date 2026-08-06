import asyncio
import time
from app.ai.base import BaseAIProvider
from app.ai.embeddings import EmbeddingGenerator
from app.ai.entity_extractor import EntityExtractor
from app.ai.exceptions import AIResponseError
from app.ai.models import AIAnalysisResult
from app.ai.sentiment import SentimentAnalyzer
from app.ai.summarizer import Summarizer
from app.ai.topic_classifier import TopicClassifier
from app.core.config import settings


class AIProcessingPipeline:
    """Orchestrator pipeline that executes all AI services for trend intelligence analysis.

    Architectural Note:
        This pipeline acts strictly as an orchestrator across independent AI modules.
        It is designed to support future batch processing (e.g. process_batch(list[str]))
        and parallel execution without altering individual component contracts.
    """

    def __init__(
        self,
        summarizer: Summarizer | None = None,
        sentiment_analyzer: SentimentAnalyzer | None = None,
        embedding_generator: EmbeddingGenerator | None = None,
        entity_extractor: EntityExtractor | None = None,
        topic_classifier: TopicClassifier | None = None,
        provider: BaseAIProvider | None = None,
    ):
        self.summarizer = summarizer or Summarizer(provider=provider)
        self.sentiment_analyzer = sentiment_analyzer or SentimentAnalyzer(provider=provider)
        self.embedding_generator = embedding_generator or EmbeddingGenerator(provider=provider)
        self.entity_extractor = entity_extractor or EntityExtractor(provider=provider)
        self.topic_classifier = topic_classifier or TopicClassifier(provider=provider)

    def process(self, text: str) -> AIAnalysisResult:
        """Run full AI analysis pipeline sequentially on the given text."""
        start_time = time.perf_counter()
        timeout_ms = settings.AI_PIPELINE_TIMEOUT_SECONDS * 1000.0

        summary = self.summarizer.summarize(text)
        sentiment = self.sentiment_analyzer.analyze(text)
        embedding = self.embedding_generator.generate(text)
        entities = self.entity_extractor.extract(text)
        topics = self.topic_classifier.classify(text)

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        if elapsed_ms > timeout_ms:
            raise AIResponseError(f"AI processing pipeline timed out after {elapsed_ms:.1f}ms.")

        return AIAnalysisResult(
            summary=summary,
            sentiment=sentiment,
            embedding=embedding,
            entities=entities,
            topics=topics,
            processing_time_ms=round(elapsed_ms, 2),
            provider=summary.provider or sentiment.label.value,
            model=summary.model or "default",
        )

    async def process_async(self, text: str) -> AIAnalysisResult:
        """Run full AI analysis pipeline concurrently on the given text using asyncio.gather."""
        start_time = time.perf_counter()
        timeout_sec = float(settings.AI_PIPELINE_TIMEOUT_SECONDS)

        try:
            summary, sentiment, embedding, entities, topics = await asyncio.wait_for(
                asyncio.gather(
                    asyncio.to_thread(self.summarizer.summarize, text),
                    asyncio.to_thread(self.sentiment_analyzer.analyze, text),
                    asyncio.to_thread(self.embedding_generator.generate, text),
                    asyncio.to_thread(self.entity_extractor.extract, text),
                    asyncio.to_thread(self.topic_classifier.classify, text),
                ),
                timeout=timeout_sec,
            )
        except asyncio.TimeoutError as e:
            raise AIResponseError(
                f"AI processing pipeline timed out after {settings.AI_PIPELINE_TIMEOUT_SECONDS}s."
            ) from e

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0

        return AIAnalysisResult(
            summary=summary,
            sentiment=sentiment,
            embedding=embedding,
            entities=entities,
            topics=topics,
            processing_time_ms=round(elapsed_ms, 2),
            provider=summary.provider or "gemini",
            model=summary.model or "gemini-2.5-flash",
        )
