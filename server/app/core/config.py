from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path
from dotenv import load_dotenv

# Get the project root directory (parent of server directory)
PROJECT_ROOT = Path(__file__).parent.parent.parent
print("PROJECT_ROOT: ", PROJECT_ROOT)
load_dotenv(str(PROJECT_ROOT / ".env"))

class Settings(BaseSettings):
  # API Keys
  PIXELLAB_API_KEY: str = ""
  OPENAI_API_KEY: str = ""
  CORS_ORIGINS: list[str] = []

  # App Settings
  DEBUG: bool = False
  ENVIRONMENT: str = "development"
  
  # Server Settings
  HOST: str = "0.0.0.0"
  PORT: int = 8000

  model_config = SettingsConfigDict(
      case_sensitive=True
  )

  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    # Handle CORS_ORIGINS environment variable if it's a string
    cors_env = os.getenv("CORS_ORIGINS")
    if cors_env:
      try:
        # Try to parse as JSON-like string
        import json
        if cors_env.startswith('[') and cors_env.endswith(']'):
          # Replace single quotes with double quotes for valid JSON
          json_str = cors_env.replace("'", '"')
          self.CORS_ORIGINS = json.loads(json_str)
        else:
          # Split by comma if it's a comma-separated string
          self.CORS_ORIGINS = [origin.strip() for origin in cors_env.split(',')]
      except Exception as e:
        # Fallback to default if parsing fails
        print(f"Warning: Failed to parse CORS_ORIGINS: {e}")
        pass

settings = Settings()
