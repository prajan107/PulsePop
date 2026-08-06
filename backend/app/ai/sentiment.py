import json
import re
from pydantic import ValidationError

from app.ai.base import BaseAIProvider
from app.ai.exceptions import AIParsingError
from app.ai.factory import AIProviderFactory
from app.ai.models import SentimentResult
from app.ai.prompts import SENTIMENT_PROMPT


class SentimentAnalyzer:
    """Service for performing sentiment analysis using configured AI providers."""

    def __init__(self, provider: BaseAIProvider | None = None):
        self.provider = provider or AIProviderFactory.get_provider()

    def analyze(self, text: str) -> SentimentResult:
        if not text or not text.strip():
            raise AIParsingError("Input text for sentiment analysis cannot be empty.")

        prompt = SENTIMENT_PROMPT.format(text=text)
        ai_response = self.provider.generate_text(prompt)

        raw_text = ai_response.text.strip()
        data = None

        # Primary attempt: direct JSON parsing
        try:
            data = json.loads(raw_text)
        except json.JSONDecodeError:
            # Fallback attempt: strip markdown code blocks if present
            cleaned_text = re.sub(r"^```(?:json)?\s*", "", raw_text, flags=re.IGNORECASE).strip()
            cleaned_text = re.sub(r"\s*```$", "", cleaned_text, flags=re.IGNORECASE).strip()
            try:
                data = json.loads(cleaned_text)
            except json.JSONDecodeError as e:
                raise AIParsingError(f"Failed to parse LLM response as JSON: {raw_text}") from e

        try:
            return SentimentResult.model_validate(data)
        except ValidationError as e:
            raise AIParsingError(f"LLM response failed SentimentResult validation: {e}") from e
