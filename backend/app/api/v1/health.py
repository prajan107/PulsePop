from fastapi import APIRouter, status

from app.schemas.health import HealthResponse
from app.services.health import HealthService


router = APIRouter()


@router.get(
    "",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health Check",
)
async def health_check() -> HealthResponse:
    return HealthService.get_health()


__all__ = ["router"]
