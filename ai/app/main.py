from fastapi import FastAPI
from app.api.documents import router as document_router
from app.configs.config import settings

app = FastAPI(
    title="Veridex AI",
    version="0.2.0",
)

app.include_router(document_router)

@app.get("/health")
async def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "veridex-ai",
        "environment": settings.environment,
    }
