class AIProviderError(Exception):
    """Base exception for AI provider operations."""

    pass


class AIResponseError(AIProviderError):
    """Raised when an AI provider returns an empty or unexpected error response."""

    pass


class AIParsingError(AIProviderError):
    """Raised when parsing or validating an AI model response fails."""

    pass
