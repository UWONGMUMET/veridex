import os

def required_env(name: str) -> str:
    value = os.getenv(name)
    if not value or not value.strip():
        raise RuntimeError(
            f"Missing required environment variable: {name}"
        )
    return value.strip()

ENVIRONMENT = os.getenv("ENVIRONMENT")
DATABASE_URL = required_env("DATABASE_URL")