from unittest.mock import MagicMock
import pytest

from app.ai.base import BaseAIProvider
from app.ai.exceptions import AIParsingError, AIResponseError
from app.ai.models import AIResponse, EmbeddingResult, SummaryResult
from app.ai.summarizer import Summarizer


class MockSummaryProvider(BaseAIProvider):
    def __init__(self, response_text: str):
        self.response_text = response_text

    def generate_text(self, prompt: str) -> AIResponse:
        return AIResponse(
            text=self.response_text,
            provider="mock",
            model="mock-summary-model",
            latency_ms=15.0,
        )

    def generate_embedding(self, text: str) -> EmbeddingResult:
        raise NotImplementedError()

    def health_check(self) -> bool:
        return True

    @property
    def provider_name(self) -> str:
        return "mock"


def test_summarizer_pure_json():
    json_str = '{"summary": "PulsePop tracks trending topics in real-time.", "key_points": ["Real-time intelligence", "Multi-source aggregation"], "confidence": 0.96}'
    summarizer = Summarizer(provider=MockSummaryProvider(json_str))
    result = summarizer.summarize("PulsePop aggregates trend data from Reddit, News, and YouTube.")

    assert isinstance(result, SummaryResult)
    assert result.summary == "PulsePop tracks trending topics in real-time."
    assert len(result.key_points) == 2
    assert result.confidence == 0.96
    assert result.provider == "mock"
    assert result.model == "mock-summary-model"


def test_summarizer_markdown_wrapped_json():
    markdown_json = '```json\n{"summary": "A comprehensive overview of AI market trends.", "key_points": ["AI growth", "Investment spike"], "confidence": 0.90}\n```'
    summarizer = Summarizer(provider=MockSummaryProvider(markdown_json))
    result = summarizer.summarize("AI sector experiences rapid investment growth.")

    assert isinstance(result, SummaryResult)
    assert result.summary == "A comprehensive overview of AI market trends."
    assert result.confidence == 0.90


def test_summarizer_short_summary_raises_response_error():
    json_str = '{"summary": "Short", "key_points": ["Too short"], "confidence": 0.99}'
    summarizer = Summarizer(provider=MockSummaryProvider(json_str))
    with pytest.raises(AIResponseError, match="Summary is too short or invalid"):
        summarizer.summarize("Long sample input text that gets summarized into a bad short response.")


def test_summarizer_invalid_json_raises_parsing_error():
    summarizer = Summarizer(provider=MockSummaryProvider("Non-JSON model output"))
    with pytest.raises(AIParsingError, match="Failed to parse LLM response as JSON"):
        summarizer.summarize("Sample input text")


def test_summarizer_empty_input_raises_parsing_error():
    summarizer = Summarizer(provider=MockSummaryProvider("{}"))
    with pytest.raises(AIParsingError, match="cannot be empty"):
        summarizer.summarize("   ")
