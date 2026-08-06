from pydantic import ValidationError

from app.ai.base import BaseAIProvider
from app.ai.exceptions import AIParsingError
from app.ai.factory import AIProviderFactory
from app.ai.models import TopicLabel, TopicResult
from app.ai.prompts import TOPIC_CLASSIFICATION_PROMPT_V1
from app.ai.utils import parse_json_response, truncate_input, validate_score


class TopicClassifier:
    """Service for classifying topics using configured AI providers."""

    def __init__(self, provider: BaseAIProvider | None = None):
        self.provider = provider or AIProviderFactory.get_provider()

    def classify(self, text: str) -> TopicResult:
        if not text or not text.strip():
            raise AIParsingError("Input text for topic classification cannot be empty.")

        text_trunc = truncate_input(text)
        prompt = TOPIC_CLASSIFICATION_PROMPT_V1.format(text=text_trunc)
        ai_response = self.provider.generate_text(prompt)

        data = parse_json_response(ai_response.text)

        if not isinstance(data, dict) or "topics" not in data:
            raise AIParsingError("Invalid topic classification response; missing 'topics' field.")

        raw_topics = data.get("topics", [])
        if not isinstance(raw_topics, list):
            raise AIParsingError("'topics' field must be a list of strings.")

        confidence = validate_score(data.get("confidence"), "Topic confidence")

        validated_topics: list[TopicLabel] = []
        for item in raw_topics:
            try:
                validated_topics.append(TopicLabel(item))
            except ValueError as e:
                raise AIParsingError(f"Invalid topic label '{item}' returned by LLM: {e}") from e

        return TopicResult(
            topics=validated_topics,
            confidence=confidence,
            provider=ai_response.provider,
            model=ai_response.model,
        )
