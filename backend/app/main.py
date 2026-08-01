from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI

from app.core.config import settings
from app.core.logging import setup_logging
from app.middleware.logging_middleware import LoggingMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    setup_logging()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend service for PulsePop AI Trend Intelligence Platform.",
    lifespan=lifespan,
)

app.add_middleware(LoggingMiddleware)


@app.get("/")
def read_root():
    return {"message": "PulsePop Backend Running"}
