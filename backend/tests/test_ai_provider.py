from unittest.mock import MagicMock, patch
import pytest

from app.ai.exceptions import AIProviderError, AIResponseError
from app.ai.providers.gemini_provider import GeminiProvider


def test_gemini_provider_initialization():
    provider = GeminiProvider(api_key="test_key", model_name="gemini-2.5-flash")
    assert provider.provider_name == "gemini"
    assert provider.api_key == "test_key"
    assert provider.model_name == "gemini-2.5-flash"


def test_gemini_provider_unconfigured_api_key():
    provider = GeminiProvider(api_key="", model_name="gemini-2.5-flash")
    assert provider.health_check() is False
    with pytest.raises(AIProviderError, match="Gemini API key is not configured"):
        provider.generate_text("Test prompt")


@patch("google.generativeai.GenerativeModel")
def test_gemini_provider_generate_text_success(mock_model_cls):
    mock_model_instance = MagicMock()
    mock_response = MagicMock()
    mock_response.text = '{"label": "positive", "confidence": 0.95, "reason": "Great service"}'
    mock_response.candidates = [MagicMock(finish_reason="STOP")]
    mock_response.usage_metadata = MagicMock(prompt_token_count=10, candidates_token_count=20, total_token_count=30)
    mock_model_instance.generate_content.return_value = mock_response
    mock_model_cls.return_value = mock_model_instance

    provider = GeminiProvider(api_key="test_key")
    result = provider.generate_text("Analyze this")

    assert result.text == '{"label": "positive", "confidence": 0.95, "reason": "Great service"}'
    assert result.provider == "gemini"
    assert result.model == "gemini-2.5-flash"
    assert result.finish_reason == "STOP"
    assert result.usage_metadata["total_token_count"] == 30
    assert result.latency_ms is not None


@patch("google.generativeai.GenerativeModel")
def test_gemini_provider_empty_response_raises_error(mock_model_cls):
    mock_model_instance = MagicMock()
    mock_response = MagicMock()
    mock_response.text = ""
    mock_model_instance.generate_content.return_value = mock_response
    mock_model_cls.return_value = mock_model_instance

    provider = GeminiProvider(api_key="test_key")
    with pytest.raises(AIResponseError, match="empty response"):
        provider.generate_text("Prompt")
