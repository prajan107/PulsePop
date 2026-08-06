from unittest.mock import MagicMock
import pytest

from app.ai.base import BaseAIProvider
from app.ai.entity_extractor import EntityExtractor
from app.ai.exceptions import AIParsingError
from app.ai.models import AIResponse, EmbeddingResult, EntityExtractionResult, EntityType


class MockEntityProvider(BaseAIProvider):
    def __init__(self, response_text: str):
        self.response_text = response_text

    def generate_text(self, prompt: str) -> AIResponse:
        return AIResponse(
            text=self.response_text,
            provider="mock",
            model="mock-entity-model",
            latency_ms=22.0,
        )

    def generate_embedding(self, text: str) -> EmbeddingResult:
        raise NotImplementedError()

    def health_check(self) -> bool:
        return True

    @property
    def provider_name(self) -> str:
        return "mock"


def test_entity_extractor_pure_json():
    json_str = '{"entities": [{"name": "Google", "type": "COMPANY", "confidence": 0.98}, {"name": "Sundar Pichai", "type": "PERSON", "confidence": 0.95}]}'
    extractor = EntityExtractor(provider=MockEntityProvider(json_str))
    result = extractor.extract("Google CEO Sundar Pichai announced new Gemini features.")

    assert isinstance(result, EntityExtractionResult)
    assert len(result.entities) == 2
    assert result.entities[0].name == "Google"
    assert result.entities[0].type == EntityType.COMPANY
    assert result.entities[1].name == "Sundar Pichai"
    assert result.entities[1].type == EntityType.PERSON
    assert result.provider == "mock"
    assert result.model == "mock-entity-model"


def test_entity_extractor_markdown_wrapped_json():
    markdown_json = '```json\n{"entities": [{"name": "Python", "type": "TECHNOLOGY", "confidence": 0.90}]}\n```'
    extractor = EntityExtractor(provider=MockEntityProvider(markdown_json))
    result = extractor.extract("Python 3.13 was released.")

    assert isinstance(result, EntityExtractionResult)
    assert len(result.entities) == 1
    assert result.entities[0].name == "Python"
    assert result.entities[0].type == EntityType.TECHNOLOGY


def test_entity_extractor_filters_low_confidence_entities():
    json_str = '{"entities": [{"name": "Apple", "type": "COMPANY", "confidence": 0.95}, {"name": "RandomWord", "type": "PRODUCT", "confidence": 0.10}]}'
    extractor = EntityExtractor(provider=MockEntityProvider(json_str))
    result = extractor.extract("Apple launched a product.")

    assert len(result.entities) == 1
    assert result.entities[0].name == "Apple"


def test_entity_extractor_invalid_confidence_raises_parsing_error():
    json_str = '{"entities": [{"name": "BadConfidence", "type": "COMPANY", "confidence": 2.5}]}'
    extractor = EntityExtractor(provider=MockEntityProvider(json_str))
    with pytest.raises(AIParsingError, match="must be between 0.0 and 1.0"):
        extractor.extract("Text")


def test_entity_extractor_empty_input_raises_parsing_error():
    extractor = EntityExtractor(provider=MockEntityProvider("{}"))
    with pytest.raises(AIParsingError, match="cannot be empty"):
        extractor.extract("   ")
