import json
import re
from pydantic import ValidationError

from app.ai.base import BaseAIProvider
from app.ai.exceptions import AIParsingError, AIResponseError
from app.ai.factory import AIProviderFactory
from app.ai.models import SummaryResult
from app.ai.prompts import SUMMARY_PROMPT_V1
from app.core.config import settings


class Summarizer:
    """Service for generating summaries using configured AI providers."""

    def __init__(self, provider: BaseAIProvider | None = None):
        self.provider = provider or AIProviderFactory.get_provider()

    def summarize(self, text: str) -> SummaryResult:
        if not text or not text.strip():
            raise AIParsingError("Input text for summarization cannot be empty.")

        text = text[: settings.AI_MAX_INPUT_CHARS]
        prompt = SUMMARY_PROMPT_V1.format(text=text)
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
                raise AIParsingError(f"Failed to parse LLM summary response as JSON: {raw_text}") from e

        try:
            summary_result = SummaryResult.model_validate(data)
        except ValidationError as e:
            raise AIParsingError(f"LLM response failed SummaryResult validation: {e}") from e

        if len(summary_result.summary.strip()) < 10:
            raise AIResponseError("Summary is too short or invalid.")

        summary_result.provider = ai_response.provider
        summary_result.model = ai_response.model

        return summary_result
