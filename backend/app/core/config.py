from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "PulsePop Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    SECRET_KEY: str = "dev_secret_key_change_in_production_1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    DATABASE_USER: str = "postgres"
    DATABASE_PASSWORD: str = "postgres"
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str = "pulsepop"

    CORS_ORIGINS: list[str] = ["*"]

    REDDIT_CLIENT_ID: str = ""
    REDDIT_CLIENT_SECRET: str = ""
    REDDIT_USER_AGENT: str = "PulsePop/1.0.0"

    NEWS_API_KEY: str = ""
    YOUTUBE_API_KEY: str = ""

    REDDIT_INGESTION_INTERVAL_MINUTES: int = 15
    NEWS_INGESTION_INTERVAL_MINUTES: int = 30
    YOUTUBE_INGESTION_INTERVAL_MINUTES: int = 60
    GOOGLE_TRENDS_INGESTION_INTERVAL_MINUTES: int = 120

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GEMINI_EMBEDDING_MODEL: str = "models/text-embedding-004"
    AI_PROVIDER: str = "gemini"
    AI_MAX_INPUT_CHARS: int = 12000
    AI_DUPLICATE_THRESHOLD: float = 0.85
    AI_ENTITY_MIN_CONFIDENCE: float = 0.25
    AI_PIPELINE_TIMEOUT_SECONDS: int = 60

    TREND_CORRELATION_THRESHOLD: float = 0.80
    TREND_SCORE_POPULARITY_WEIGHT: float = 0.30
    TREND_SCORE_FRESHNESS_WEIGHT: float = 0.20
    TREND_SCORE_SOURCE_DIVERSITY_WEIGHT: float = 0.20
    TREND_SCORE_SENTIMENT_WEIGHT: float = 0.15
    TREND_SCORE_AI_CONFIDENCE_WEIGHT: float = 0.15

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
