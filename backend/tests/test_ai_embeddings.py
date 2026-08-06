from datetime import datetime, timezone
from unittest.mock import MagicMock, patch
import pytest

from app.ai.base import BaseAIProvider
from app.ai.embeddings import EmbeddingGenerator
from app.ai.exceptions import AIProviderError, AIResponseError
from app.ai.models import AIResponse, EmbeddingResult
from app.ai.providers.gemini_provider import GeminiProvider


class MockEmbeddingProvider(BaseAIProvider):
    def generate_text(self, prompt: str) -> AIResponse:
        raise NotImplementedError()

    def generate_embedding(self, text: str) -> EmbeddingResult:
        return EmbeddingResult(
            vector=[0.1, 0.2, 0.3, 0.4],
            provider="mock",
            model="mock-embedding-model",
            dimensions=4,
        )

    def health_check(self) -> bool:
        return True

    @property
    def provider_name(self) -> str:
        return "mock"


def test_embedding_generator_success():
    generator = EmbeddingGenerator(provider=MockEmbeddingProvider())
    result = generator.generate("Text to embed")

    assert isinstance(result, EmbeddingResult)
    assert result.vector == [0.1, 0.2, 0.3, 0.4]
    assert result.dimensions == 4
    assert result.provider == "mock"
    assert result.model == "mock-embedding-model"
    assert isinstance(result.created_at, datetime)


@patch("google.generativeai.embed_content")
def test_gemini_provider_generate_embedding_success(mock_embed):
    mock_embed.return_value = {"embedding": [0.01, -0.05, 0.88, 0.12]}
    provider = GeminiProvider(api_key="test_key")

    result = provider.generate_embedding("Sample trend text")
    assert isinstance(result, EmbeddingResult)
    assert result.vector == [0.01, -0.05, 0.88, 0.12]
    assert result.dimensions == 4
    assert result.provider == "gemini"
    assert result.model == "models/text-embedding-004"


@patch("google.generativeai.embed_content")
def test_gemini_provider_zero_length_vector_raises_error(mock_embed):
    mock_embed.return_value = {"embedding": []}
    provider = GeminiProvider(api_key="test_key")

    with pytest.raises(AIResponseError, match="empty vector"):
        provider.generate_embedding("Sample text")


def test_gemini_provider_empty_text_embedding_raises_error():
    provider = GeminiProvider(api_key="test_key")

    with pytest.raises(AIProviderError, match="cannot be empty"):
        provider.generate_embedding("   ")
