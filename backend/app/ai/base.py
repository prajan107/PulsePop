from abc import ABC, abstractmethod
from app.ai.models import AIResponse, EmbeddingResult


class BaseAIProvider(ABC):
    """Abstract base class for all AI providers."""

    @abstractmethod
    def generate_text(self, prompt: str) -> AIResponse:
        """Generate text from a prompt using the AI provider."""
        pass

    @abstractmethod
    def generate_embedding(self, text: str) -> EmbeddingResult:
        """Generate vector embedding for input text using the AI provider."""
        pass

    @abstractmethod
    def health_check(self) -> bool:
        """Perform a health check on the AI provider."""
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the name of the AI provider."""
        pass
