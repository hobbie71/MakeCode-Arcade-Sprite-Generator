from pydantic_settings import BaseSettings

class Settings(BaseSettings):
  # API Keys
  PIXELLAB_API_TOKEN: str = ""
  OPENAI_API_TOKEN: str = ""

  # CORS
  CORS_ORIGINS: list[str] = ["http://localhost:3000"]

  # App Settings
  DEBUG: bool = False
  
  # Server Settings
  HOST: str = "0.0.0.0"
  PORT: int = 8000

  class Config:
    env_file = ".env"
    case_sensitive = True

settings = Settings()
