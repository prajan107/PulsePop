from pydantic import ValidationError

from app.ai.base import BaseAIProvider
from app.ai.exceptions import AIParsingError
from app.ai.factory import AIProviderFactory
from app.ai.models import Entity, EntityExtractionResult
from app.ai.prompts import ENTITY_EXTRACTION_PROMPT_V1
from app.ai.utils import parse_json_response, truncate_input, validate_score
from app.core.config import settings


class EntityExtractor:
    """Service for extracting named entities using configured AI providers."""

    def __init__(self, provider: BaseAIProvider | None = None):
        self.provider = provider or AIProviderFactory.get_provider()

    def extract(self, text: str) -> EntityExtractionResult:
        if not text or not text.strip():
            raise AIParsingError("Input text for entity extraction cannot be empty.")

        text_trunc = truncate_input(text)
        prompt = ENTITY_EXTRACTION_PROMPT_V1.format(text=text_trunc)
        ai_response = self.provider.generate_text(prompt)

        data = parse_json_response(ai_response.text)

        if not isinstance(data, dict) or "entities" not in data:
            raise AIParsingError("Invalid entity extraction output structure; missing 'entities' key.")

        raw_entities = data.get("entities", [])
        if not isinstance(raw_entities, list):
            raise AIParsingError("'entities' field in response must be a list.")

        validated_entities: list[Entity] = []
        for raw in raw_entities:
            try:
                conf = validate_score(raw.get("confidence"), "Entity confidence")
                if conf < settings.AI_ENTITY_MIN_CONFIDENCE:
                    continue
                entity = Entity.model_validate(raw)
                entity.confidence = conf
                validated_entities.append(entity)
            except ValidationError as e:
                raise AIParsingError(f"Entity failed validation: {e}") from e

        return EntityExtractionResult(
            entities=validated_entities,
            provider=ai_response.provider,
            model=ai_response.model,
        )
