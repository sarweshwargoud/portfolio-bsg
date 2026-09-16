import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

# Backend root directory
BACKEND_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Supabase Settings
    supabase_url: str = Field(..., alias="SUPABASE_URL")
    supabase_service_role_key: str = Field(..., alias="SUPABASE_SERVICE_ROLE_KEY")

    # Gemini Settings
    gemini_api_key: str = Field(..., alias="GEMINI_API_KEY")
    embedding_model: str = Field(default="models/gemini-embedding-001", alias="EMBEDDING_MODEL")
    embedding_dimension: int = Field(default=768, alias="EMBEDDING_DIMENSION")
    llm_model: str = Field(default="gemini-2.5-flash", alias="LLM_MODEL")

    # Server Settings
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    cors_origins: str = Field(
        default="http://localhost:8080,http://localhost:5173,http://127.0.0.1:8080,https://portfolio-bsg.onrender.com",
        alias="CORS_ORIGINS"
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

settings = Settings()
