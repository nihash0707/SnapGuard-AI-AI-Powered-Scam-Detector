import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"

DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    PROJECT_NAME: str = "SnapGuard AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database
    DB_PATH: Path = DATA_DIR / "snapguard.db"
    SQLALCHEMY_DATABASE_URL: str = f"sqlite:///{DB_PATH}"
    
    # Uploads
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: list[str] = ["image/jpeg", "image/png", "image/webp"]
    
    # Local AI Settings
    DEFAULT_PROVIDER: str = "auto"  # auto, local_llm, rule_based
    LOCAL_LLM_ENDPOINT: str = os.getenv("LOCAL_LLM_ENDPOINT", "http://localhost:11434/api/generate")
    LOCAL_LLM_MODEL: str = os.getenv("LOCAL_LLM_MODEL", "llama3:8b")
    
    # Privacy Default
    STORE_SCAN_CONTENT_DEFAULT: bool = False
    
settings = Settings()
