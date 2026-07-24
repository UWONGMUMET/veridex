from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    node_env: str = "development"
    database_url: str
    storage_root: str = "./storage"
    embedding_model: str = "intfloat/multilingual-e5-small"
    embedding_dimensions: int = 384
    chunk_size: int = 1000
    chunk_overlap: int = 150

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )

settings = Settings()
