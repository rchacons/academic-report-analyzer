from typing import Literal

from pydantic import (
    AnyUrl,
    computed_field,
)
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    A class to store the settings for the core module.
    """
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )
    PROJECT_NAME: str = "SI-REL2 API"
    API_V1_STR: str = "/api/v1"
    API_VERSION: str = "0.1.0"

    BACKEND_CORS_ORIGINS: list[AnyUrl] = [
        "http://localhost",
        "http://localhost:8080",
        "http://localhost:5173",
        "http://127.0.0.1:8000",
        "https://localhost"
        ]

settings = Settings()  # type: ignore