import pytest
from app.ai.factory import AIProviderFactory
from app.ai.providers.gemini_provider import GeminiProvider


def test_factory_returns_gemini_provider():
    provider = AIProviderFactory.get_provider("gemini")
    assert isinstance(provider, GeminiProvider)
    assert provider.provider_name == "gemini"


def test_factory_default_provider():
    provider = AIProviderFactory.get_provider()
    assert isinstance(provider, GeminiProvider)


def test_factory_raises_value_error_for_unsupported_provider():
    with pytest.raises(ValueError, match="Unsupported AI provider"):
        AIProviderFactory.get_provider("invalid_provider_name")
