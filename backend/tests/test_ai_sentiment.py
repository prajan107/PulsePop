from unittest.mock import MagicMock
import pytest

from app.ai.base import BaseAIProvider
from app.ai.exceptions import AIParsingError
from app.ai.models import AIResponse, SentimentLabel, SentimentResult
from app.ai.sentiment import SentimentAnalyzer


class MockProvider(BaseAIProvider):
    def __init__(self, response_text: str):
        self.response_text = response_text

    def generate_text(self, prompt: str) -> AIResponse:
        return AIResponse(
            text=self.response_text,
            provider="mock",
            model="mock-model",
            latency_ms=12.5,
        )

    def generate_embedding(self, text: str):
        raise NotImplementedError()

    def health_check(self) -> bool:
        return True

    @property
    def provider_name(self) -> str:
        return "mock"


def test_sentiment_analysis_pure_json():
    json_str = '{"label": "positive", "confidence": 0.98, "reason": "Extremely enthusiastic tone"}'
    analyzer = SentimentAnalyzer(provider=MockProvider(json_str))
    result = analyzer.analyze("I love this product!")

    assert isinstance(result, SentimentResult)
    assert result.label == SentimentLabel.POSITIVE
    assert result.confidence == 0.98
    assert result.reason == "Extremely enthusiastic tone"


def test_sentiment_analysis_markdown_wrapped_json():
    markdown_json = '```json\n{"label": "negative", "confidence": 0.85, "reason": "App crash reported"}\n```'
    analyzer = SentimentAnalyzer(provider=MockProvider(markdown_json))
    result = analyzer.analyze("The app keeps crashing endlessly.")

    assert isinstance(result, SentimentResult)
    assert result.label == SentimentLabel.NEGATIVE
    assert result.confidence == 0.85
    assert result.reason == "App crash reported"


def test_sentiment_analysis_invalid_json_raises_parsing_error():
    analyzer = SentimentAnalyzer(provider=MockProvider("This is not valid JSON"))
    with pytest.raises(AIParsingError, match="Failed to parse LLM response as JSON"):
        analyzer.analyze("Random text")


def test_sentiment_analysis_invalid_schema_raises_parsing_error():
    json_str = '{"label": "super_happy", "confidence": 0.98, "reason": "Invalid enum label"}'
    analyzer = SentimentAnalyzer(provider=MockProvider(json_str))
    with pytest.raises(AIParsingError, match="SentimentResult validation"):
        analyzer.analyze("Text")


def test_sentiment_analysis_empty_text_raises_parsing_error():
    analyzer = SentimentAnalyzer(provider=MockProvider("{}"))
    with pytest.raises(AIParsingError, match="cannot be empty"):
        analyzer.analyze("   ")
