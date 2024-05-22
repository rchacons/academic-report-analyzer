import secrets
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
 
    DOMAIN: str = "localhost"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    @computed_field  # type: ignore[misc]
    @property
    def server_host(self) -> str:
        # Use HTTPS for anything other than local development
        if self.ENVIRONMENT == "local":
            return f"http://{self.DOMAIN}"
        return f"https://{self.DOMAIN}"
    
    BACKEND_CORS_ORIGINS: list[AnyUrl] = [
        "http://localhost:5000",  # TODO modifier -> Local frontend
        "http://production-frontend.com" # TODO modifier -> Production frontend
        ]  

settings = Settings()  # type: ignore