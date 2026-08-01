from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "PulsePop Backend"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    DATABASE_HOST: str = "localhost"
    DATABASE_PORT: int = 5432
    DATABASE_NAME: str = "pulsepop"
    DATABASE_USER: str = "postgres"
    DATABASE_PASSWORD: str = "postgres"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]

        return value

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
