from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from app.core.config import settings


database_url = (
    "postgresql+asyncpg://"
    f"{settings.DATABASE_USER}:{settings.DATABASE_PASSWORD}"
    f"@{settings.DATABASE_HOST}:{settings.DATABASE_PORT}"
    f"/{settings.DATABASE_NAME}"
)

engine: AsyncEngine = create_async_engine(
    database_url,
    echo=settings.DEBUG,
    future=True,
)

__all__ = ["engine"]
