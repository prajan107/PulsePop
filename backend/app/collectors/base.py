from abc import ABC, abstractmethod

from app.collectors.models import RawTrendData


class BaseCollector(ABC):
    """Abstract base class that all data source collectors must implement."""

    @property
    @abstractmethod
    def source_name(self) -> str:
        """Return the unique identifier name of the data source."""
        pass

    @abstractmethod
    async def collect(self) -> list[RawTrendData]:
        """Asynchronously collect raw trend data from the source."""
        pass

    @abstractmethod
    async def health_check(self) -> bool:
        """Asynchronously verify connectivity and health of the data source."""
        pass


__all__ = ["BaseCollector"]
