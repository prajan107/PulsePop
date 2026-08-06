from unittest.mock import MagicMock
import pytest

from app.ai.base import BaseAIProvider
from app.ai.duplicates import DuplicateDetector
from app.ai.exceptions import AIParsingError
from app.ai.models import AIResponse, DuplicateResult, EmbeddingResult


class MockDuplicateProvider(BaseAIProvider):
    def __init__(self, response_text: str):
        self.response_text = response_text

    def generate_text(self, prompt: str) -> AIResponse:
        return AIResponse(
            text=self.response_text,
            provider="mock",
            model="mock-duplicate-model",
            latency_ms=18.0,
        )

    def generate_embedding(self, text: str) -> EmbeddingResult:
        raise NotImplementedError()

    def health_check(self) -> bool:
        return True

    @property
    def provider_name(self) -> str:
        return "mock"


def test_duplicate_detector_pure_json():
    json_str = '{"is_duplicate": true, "similarity_score": 0.95, "reason": "Both articles discuss the SpaceX launch delay."}'
    detector = DuplicateDetector(provider=MockDuplicateProvider(json_str))
    result = detector.compare("SpaceX postpones Falcon 9 launch.", "Falcon 9 rocket launch delayed by SpaceX.")

    assert isinstance(result, DuplicateResult)
    assert result.is_duplicate is True
    assert result.similarity_score == 0.95
    assert result.reason == "Both articles discuss the SpaceX launch delay."
    assert result.provider == "mock"
    assert result.model == "mock-duplicate-model"


def test_duplicate_detector_markdown_wrapped_json():
    markdown_json = '```json\n{"is_duplicate": false, "similarity_score": 0.15, "reason": "Unrelated topics."}\n```'
    detector = DuplicateDetector(provider=MockDuplicateProvider(markdown_json))
    result = detector.compare("Nvidia unveils new GPU architecture.", "Local cat wins national pet competition.")

    assert isinstance(result, DuplicateResult)
    assert result.is_duplicate is False
    assert result.similarity_score == 0.15


def test_duplicate_detector_out_of_bounds_similarity_raises_parsing_error():
    json_str = '{"is_duplicate": true, "similarity_score": 1.5, "reason": "Invalid score"}'
    detector = DuplicateDetector(provider=MockDuplicateProvider(json_str))
    with pytest.raises(AIParsingError, match="must be between 0.0 and 1.0"):
        detector.compare("Text A", "Text B")


def test_duplicate_detector_empty_text_raises_parsing_error():
    detector = DuplicateDetector(provider=MockDuplicateProvider("{}"))
    with pytest.raises(AIParsingError, match="cannot be empty"):
        detector.compare("  ", "Text B")
