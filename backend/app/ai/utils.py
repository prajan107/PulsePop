import json
import re
from typing import Any

from app.ai.exceptions import AIParsingError
from app.core.config import settings


def truncate_input(text: str, max_chars: int | None = None) -> str:
    """Truncate input text to maximum allowed character length."""
    limit = max_chars if max_chars is not None else settings.AI_MAX_INPUT_CHARS
    return text[:limit] if text else ""


def parse_json_response(raw_text: str) -> Any:
    """Parse raw LLM response text into a JSON object (dict or list).

    Attempts direct JSON parsing first, falling back to stripping markdown code fences.
    Raises AIParsingError if parsing fails.
    """
    if not raw_text or not raw_text.strip():
        raise AIParsingError("Cannot parse empty response text as JSON.")

    cleaned_raw = raw_text.strip()
    try:
        return json.loads(cleaned_raw)
    except json.JSONDecodeError:
        # Fallback attempt: strip markdown code blocks if present
        cleaned_text = re.sub(r"^```(?:json)?\s*", "", cleaned_raw, flags=re.IGNORECASE).strip()
        cleaned_text = re.sub(r"\s*```$", "", cleaned_text, flags=re.IGNORECASE).strip()
        try:
            return json.loads(cleaned_text)
        except json.JSONDecodeError as e:
            raise AIParsingError(f"Failed to parse LLM response as JSON: {raw_text}") from e


def validate_score(
    score: float,
    name: str = "Score",
    min_val: float = 0.0,
    max_val: float = 1.0,
) -> float:
    """Validate that a score or probability falls within expected bounds [min_val, max_val]."""
    if not isinstance(score, (int, float)):
        raise AIParsingError(f"{name} must be a number, got {type(score).__name__}.")
    if not (min_val <= score <= max_val):
        raise AIParsingError(f"{name} must be between {min_val} and {max_val}, got {score}.")
    return float(score)
