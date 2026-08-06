from app.ai.base import BaseAIProvider
from app.ai.providers.gemini_provider import GeminiProvider
from app.core.config import settings

PROVIDERS: dict[str, type[BaseAIProvider]] = {
    "gemini": GeminiProvider,
}


class AIProviderFactory:
    """Factory for instantiating AI providers based on configuration or input."""

    @staticmethod
    def get_provider(provider_name: str | None = None) -> BaseAIProvider:
        target_provider = (provider_name or settings.AI_PROVIDER).lower()

        if target_provider not in PROVIDERS:
            raise ValueError(
                f"Unsupported AI provider: '{target_provider}'. "
                f"Supported providers: {list(PROVIDERS.keys())}"
            )

        provider_cls = PROVIDERS[target_provider]
        return provider_cls()
