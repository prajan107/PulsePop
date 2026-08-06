from fastapi import APIRouter

from app.api.v1 import analytics, auth, dashboard, health, monitoring, trends

api_router = APIRouter()
api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"],
)
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Auth"],
)
api_router.include_router(
    trends.router,
    prefix="/trends",
    tags=["Trends"],
)
api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Dashboard"],
)
api_router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["Analytics"],
)
api_router.include_router(
    monitoring.router,
    prefix="/monitoring",
    tags=["Monitoring"],
)

__all__ = ["api_router"]
