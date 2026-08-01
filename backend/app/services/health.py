from app.core.config import settings
from app.schemas.health import HealthResponse


class HealthService:
    @staticmethod
    def get_health() -> HealthResponse:
        return HealthResponse(
            status="healthy",
            service=settings.APP_NAME,
            version=settings.APP_VERSION,
        )


__all__ = ["HealthService"]
