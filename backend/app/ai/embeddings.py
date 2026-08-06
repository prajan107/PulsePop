from app.ai.base import BaseAIProvider
from app.ai.factory import AIProviderFactory
from app.ai.models import EmbeddingResult


class EmbeddingGenerator:
    """Service for generating vector embeddings using configured AI providers."""

    def __init__(self, provider: BaseAIProvider | None = None):
        self.provider = provider or AIProviderFactory.get_provider()

    def generate(self, text: str) -> EmbeddingResult:
        """Generate embedding vector for input text."""
        return self.provider.generate_embedding(text)
