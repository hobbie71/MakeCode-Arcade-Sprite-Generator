from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "MakeCode Arcade Sprite Generator"
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",  # React dev server
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173"
    ]
    
    # Database Settings
    DATABASE_URL: str = "sqlite:///./sprites.db"
    
    # AI Settings
    OPENAI_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""
    USE_LOCAL_AI: bool = True
    
    # File Upload Settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["png", "jpg", "jpeg", "gif", "bmp"]
    UPLOAD_DIR: str = "./uploads"
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
