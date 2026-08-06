from pydantic import ValidationError

from app.ai.base import BaseAIProvider
from app.ai.exceptions import AIParsingError, AIResponseError
from app.ai.factory import AIProviderFactory
from app.ai.models import SummaryResult
from app.ai.prompts import SUMMARY_PROMPT_V1
from app.ai.utils import parse_json_response, truncate_input


class Summarizer:
    """Service for generating summaries using configured AI providers."""

    def __init__(self, provider: BaseAIProvider | None = None):
        self.provider = provider or AIProviderFactory.get_provider()

    def summarize(self, text: str) -> SummaryResult:
        if not text or not text.strip():
            raise AIParsingError("Input text for summarization cannot be empty.")

        text = truncate_input(text)
        prompt = SUMMARY_PROMPT_V1.format(text=text)
        ai_response = self.provider.generate_text(prompt)

        data = parse_json_response(ai_response.text)

        try:
            summary_result = SummaryResult.model_validate(data)
        except ValidationError as e:
            raise AIParsingError(f"LLM response failed SummaryResult validation: {e}") from e

        if len(summary_result.summary.strip()) < 10:
            raise AIResponseError("Summary is too short or invalid.")

        summary_result.provider = ai_response.provider
        summary_result.model = ai_response.model

        return summary_result
