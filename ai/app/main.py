from fastapi import FastAPI
from app.config import ENVIRONMENT

app = FastAPI(
    title="Veridex AI",
    version="0.1.0",
)

@app.get("/health")
async def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "veridex-ai",
        "environment": ENVIRONMENT,
    }