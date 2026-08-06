from pydantic import ValidationError

from app.ai.base import BaseAIProvider
from app.ai.exceptions import AIParsingError
from app.ai.factory import AIProviderFactory
from app.ai.models import DuplicateResult
from app.ai.prompts import DUPLICATE_PROMPT_V1
from app.ai.utils import parse_json_response, truncate_input, validate_score


class DuplicateDetector:
    """Service for detecting semantic duplicate trends/events using configured AI providers."""

    def __init__(self, provider: BaseAIProvider | None = None):
        self.provider = provider or AIProviderFactory.get_provider()

    def compare(self, text_a: str, text_b: str) -> DuplicateResult:
        if not text_a or not text_a.strip() or not text_b or not text_b.strip():
            raise AIParsingError("Input texts for duplicate detection cannot be empty.")

        text_a_trunc = truncate_input(text_a)
        text_b_trunc = truncate_input(text_b)

        prompt = DUPLICATE_PROMPT_V1.format(text_a=text_a_trunc, text_b=text_b_trunc)
        ai_response = self.provider.generate_text(prompt)

        data = parse_json_response(ai_response.text)

        try:
            result = DuplicateResult(
                is_duplicate=data.get("is_duplicate", False),
                similarity_score=validate_score(data.get("similarity_score"), "similarity_score"),
                reason=data.get("reason", ""),
                provider=ai_response.provider,
                model=ai_response.model,
            )
            return result
        except ValidationError as e:
            raise AIParsingError(f"LLM response failed DuplicateResult validation: {e}") from e
