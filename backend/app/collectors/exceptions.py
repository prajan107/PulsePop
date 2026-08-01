from typing import Any


class CollectorException(Exception):
    """Base exception for all data collector errors."""

    def __init__(self, message: str, details: Any | None = None) -> None:
        self.message = message
        self.details = details
        super().__init__(message)


class CollectorConnectionError(CollectorException):
    """Raised when connecting to a remote data source fails."""

    pass


class CollectorRateLimitError(CollectorException):
    """Raised when rate limit is exceeded for a data source."""

    pass


class CollectorParsingError(CollectorException):
    """Raised when parsing or deserializing raw data fails."""

    pass


__all__ = [
    "CollectorException",
    "CollectorConnectionError",
    "CollectorRateLimitError",
    "CollectorParsingError",
]
