from fastapi import FastAPI

from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend service for PulsePop AI Trend Intelligence Platform.",
)


@app.get("/")
def read_root():
    return {"message": "PulsePop Backend Running"}

