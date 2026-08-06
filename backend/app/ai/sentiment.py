from pydantic import ValidationError

from app.ai.base import BaseAIProvider
from app.ai.exceptions import AIParsingError
from app.ai.factory import AIProviderFactory
from app.ai.models import SentimentResult
from app.ai.prompts import SENTIMENT_PROMPT_V1
from app.ai.utils import parse_json_response, truncate_input


class SentimentAnalyzer:
    """Service for performing sentiment analysis using configured AI providers."""

    def __init__(self, provider: BaseAIProvider | None = None):
        self.provider = provider or AIProviderFactory.get_provider()

    def analyze(self, text: str) -> SentimentResult:
        if not text or not text.strip():
            raise AIParsingError("Input text for sentiment analysis cannot be empty.")

        text = truncate_input(text)
        prompt = SENTIMENT_PROMPT_V1.format(text=text)
        ai_response = self.provider.generate_text(prompt)

        data = parse_json_response(ai_response.text)

        try:
            return SentimentResult.model_validate(data)
        except ValidationError as e:
            raise AIParsingError(f"LLM response failed SentimentResult validation: {e}") from e
