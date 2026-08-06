import asyncio
from datetime import datetime
from unittest.mock import MagicMock
import pytest

from app.ai.embeddings import EmbeddingGenerator
from app.ai.entity_extractor import EntityExtractor
from app.ai.exceptions import AIResponseError
from app.ai.models import (
    AIAnalysisResult,
    EmbeddingResult,
    Entity,
    EntityExtractionResult,
    EntityType,
    SentimentLabel,
    SentimentResult,
    SummaryResult,
    TopicLabel,
    TopicResult,
)
from app.ai.pipeline import AIProcessingPipeline
from app.ai.sentiment import SentimentAnalyzer
from app.ai.summarizer import Summarizer
from app.ai.topic_classifier import TopicClassifier


def create_mock_pipeline():
    summarizer = MagicMock(spec=Summarizer)
    summarizer.summarize.return_value = SummaryResult(
        summary="PulsePop AI intelligence platform tracks emerging trends.",
        key_points=["Real-time tracking", "AI analysis"],
        confidence=0.95,
        provider="mock_provider",
        model="mock_model",
    )

    sentiment_analyzer = MagicMock(spec=SentimentAnalyzer)
    sentiment_analyzer.analyze.return_value = SentimentResult(
        label=SentimentLabel.POSITIVE,
        confidence=0.92,
        reason="Upbeat tone",
    )

    embedding_generator = MagicMock(spec=EmbeddingGenerator)
    embedding_generator.generate.return_value = EmbeddingResult(
        vector=[0.1, 0.2, 0.3, 0.4],
        provider="mock_provider",
        model="mock_embedding_model",
        dimensions=4,
    )

    entity_extractor = MagicMock(spec=EntityExtractor)
    entity_extractor.extract.return_value = EntityExtractionResult(
        entities=[Entity(name="PulsePop", type=EntityType.COMPANY, confidence=0.99)],
        provider="mock_provider",
        model="mock_model",
    )

    topic_classifier = MagicMock(spec=TopicClassifier)
    topic_classifier.classify.return_value = TopicResult(
        topics=[TopicLabel.TECHNOLOGY, TopicLabel.ARTIFICIAL_INTELLIGENCE],
        confidence=0.96,
        provider="mock_provider",
        model="mock_model",
    )

    pipeline = AIProcessingPipeline(
        summarizer=summarizer,
        sentiment_analyzer=sentiment_analyzer,
        embedding_generator=embedding_generator,
        entity_extractor=entity_extractor,
        topic_classifier=topic_classifier,
    )
    return pipeline


def test_pipeline_process_sync_success():
    pipeline = create_mock_pipeline()
    result = pipeline.process("PulsePop launches AI feature suite.")

    assert isinstance(result, AIAnalysisResult)
    assert result.summary.summary == "PulsePop AI intelligence platform tracks emerging trends."
    assert result.sentiment.label == SentimentLabel.POSITIVE
    assert result.embedding.dimensions == 4
    assert len(result.entities.entities) == 1
    assert TopicLabel.TECHNOLOGY in result.topics.topics
    assert result.processing_time_ms > 0
    assert isinstance(result.completed_at, datetime)
    assert result.pipeline_version == "1.0"
    assert result.provider == "mock_provider"
    assert result.model == "mock_model"


def test_pipeline_process_async_success():
    pipeline = create_mock_pipeline()
    result = asyncio.run(pipeline.process_async("PulsePop launches AI feature suite."))

    assert isinstance(result, AIAnalysisResult)
    assert result.summary.summary == "PulsePop AI intelligence platform tracks emerging trends."
    assert result.sentiment.label == SentimentLabel.POSITIVE
    assert result.embedding.dimensions == 4
    assert len(result.entities.entities) == 1
    assert TopicLabel.ARTIFICIAL_INTELLIGENCE in result.topics.topics
    assert result.pipeline_version == "1.0"


def test_pipeline_propagates_unhandled_exceptions():
    pipeline = create_mock_pipeline()
    pipeline.summarizer.summarize.side_effect = ValueError("Fatal API Error")

    with pytest.raises(ValueError, match="Fatal API Error"):
        pipeline.process("Text")
