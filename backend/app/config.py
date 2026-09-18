import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "JARVIS AI Assistant"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    SECRET_KEY: str = "jarvis_super_secret_development_key_32bytes"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./jarvis.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI Provider Selection
    DEFAULT_LLM_PROVIDER: str = "ollama"
    
    # OpenAI Settings
    OPENAI_API_KEY: Optional[str] = None
    DEFAULT_MODEL: str = "gpt-4o"
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    # Ollama / OpenRouter Free API Settings
    OLLAMA_API_KEY: Optional[str] = "c174658e0e94456f90dc86f61c50832c.PIZbQOwYJGemQ1rsk-lN5EIv"
    OLLAMA_BASE_URL: str = "https://openrouter.ai/api/v1"
    OLLAMA_MODEL: str = "meta-llama/llama-3-8b-instruct:free"
    
    # Security & Tool Controls
    ENFORCE_TOOL_PERMISSIONS: bool = True
    AUTO_APPROVE_LOW_RISK: bool = True
    HIGH_RISK_CONFIRMATION_REQUIRED: bool = True
    
    # Integrations
    GITHUB_TOKEN: Optional[str] = None
    ENABLE_DESKTOP_AUTOMATION: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
