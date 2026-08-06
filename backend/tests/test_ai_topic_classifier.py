from unittest.mock import MagicMock
import pytest

from app.ai.base import BaseAIProvider
from app.ai.exceptions import AIParsingError
from app.ai.models import AIResponse, EmbeddingResult, TopicLabel, TopicResult
from app.ai.topic_classifier import TopicClassifier


class MockTopicProvider(BaseAIProvider):
    def __init__(self, response_text: str):
        self.response_text = response_text

    def generate_text(self, prompt: str) -> AIResponse:
        return AIResponse(
            text=self.response_text,
            provider="mock",
            model="mock-topic-model",
            latency_ms=14.0,
        )

    def generate_embedding(self, text: str) -> EmbeddingResult:
        raise NotImplementedError()

    def health_check(self) -> bool:
        return True

    @property
    def provider_name(self) -> str:
        return "mock"


def test_topic_classifier_pure_json():
    json_str = '{"topics": ["TECHNOLOGY", "ARTIFICIAL_INTELLIGENCE"], "confidence": 0.96}'
    classifier = TopicClassifier(provider=MockTopicProvider(json_str))
    result = classifier.classify("Generative AI models revolutionize tech industry.")

    assert isinstance(result, TopicResult)
    assert len(result.topics) == 2
    assert TopicLabel.TECHNOLOGY in result.topics
    assert TopicLabel.ARTIFICIAL_INTELLIGENCE in result.topics
    assert result.confidence == 0.96
    assert result.provider == "mock"
    assert result.model == "mock-topic-model"


def test_topic_classifier_markdown_wrapped_json():
    markdown_json = '```json\n{"topics": ["GAMING"], "confidence": 0.88}\n```'
    classifier = TopicClassifier(provider=MockTopicProvider(markdown_json))
    result = classifier.classify("New AAA game breaks active player records.")

    assert isinstance(result, TopicResult)
    assert result.topics == [TopicLabel.GAMING]
    assert result.confidence == 0.88


def test_topic_classifier_invalid_enum_raises_parsing_error():
    json_str = '{"topics": ["INVALID_TOPIC_NAME"], "confidence": 0.90}'
    classifier = TopicClassifier(provider=MockTopicProvider(json_str))
    with pytest.raises(AIParsingError, match="Invalid topic label"):
        classifier.classify("Sample text")


def test_topic_classifier_invalid_confidence_raises_parsing_error():
    json_str = '{"topics": ["HEALTH"], "confidence": 1.5}'
    classifier = TopicClassifier(provider=MockTopicProvider(json_str))
    with pytest.raises(AIParsingError, match="must be between 0.0 and 1.0"):
        classifier.classify("Sample text")


def test_topic_classifier_empty_input_raises_parsing_error():
    classifier = TopicClassifier(provider=MockTopicProvider("{}"))
    with pytest.raises(AIParsingError, match="cannot be empty"):
        classifier.classify("   ")
