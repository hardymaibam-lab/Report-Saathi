import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "ReportSaathi API"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # Gemini
    gemini_api_key: Optional[str] = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = "gemini-2.5-flash"
    
    # Tesseract OCR
    tesseract_cmd: str = os.getenv("TESSERACT_CMD", "tesseract")
    
    # Supabase (Optional)
    supabase_url: Optional[str] = os.getenv("SUPABASE_URL", "")
    supabase_key: Optional[str] = os.getenv("SUPABASE_KEY", "")
    
    # Telegram Bot (Optional)
    telegram_bot_token: Optional[str] = os.getenv("TELEGRAM_BOT_TOKEN", "")
    
    # Limits & Validation
    max_file_size_mb: int = 10
    allowed_extensions: List[str] = ["pdf", "jpg", "jpeg", "png"]
    
    # CORS
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
