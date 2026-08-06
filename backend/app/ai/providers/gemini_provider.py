import time
import google.generativeai as genai

from app.ai.base import BaseAIProvider
from app.ai.exceptions import AIProviderError, AIResponseError
from app.ai.models import AIResponse
from app.core.config import settings


class GeminiProvider(BaseAIProvider):
    """Gemini AI provider implementation."""

    def __init__(self, api_key: str | None = None, model_name: str | None = None):
        self.api_key = settings.GEMINI_API_KEY if api_key is None else api_key
        self.model_name = model_name or settings.GEMINI_MODEL
        if self.api_key:
            genai.configure(api_key=self.api_key)

    @property
    def provider_name(self) -> str:
        return "gemini"

    def generate_text(self, prompt: str) -> AIResponse:
        if not self.api_key:
            raise AIProviderError("Gemini API key is not configured.")

        try:
            model = genai.GenerativeModel(self.model_name)
            start_time = time.perf_counter()
            response = model.generate_content(prompt)
            latency_ms = (time.perf_counter() - start_time) * 1000.0

            if not response or not hasattr(response, "text") or not response.text:
                raise AIResponseError("Gemini provider returned an empty response.")

            finish_reason = None
            usage_metadata = {}
            if hasattr(response, "candidates") and response.candidates:
                candidate = response.candidates[0]
                if hasattr(candidate, "finish_reason"):
                    finish_reason = str(candidate.finish_reason)
            if hasattr(response, "usage_metadata") and response.usage_metadata:
                usage_metadata = {
                    "prompt_token_count": getattr(response.usage_metadata, "prompt_token_count", 0),
                    "candidates_token_count": getattr(response.usage_metadata, "candidates_token_count", 0),
                    "total_token_count": getattr(response.usage_metadata, "total_token_count", 0),
                }

            return AIResponse(
                text=response.text,
                provider=self.provider_name,
                model=self.model_name,
                latency_ms=round(latency_ms, 2),
                finish_reason=finish_reason,
                usage_metadata=usage_metadata,
            )
        except AIProviderError:
            raise
        except Exception as e:
            raise AIProviderError(f"Gemini API error: {str(e)}") from e

    def health_check(self) -> bool:
        if not self.api_key:
            return False
        try:
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content("Ping")
            return bool(response and hasattr(response, "text") and response.text)
        except Exception:
            return False
