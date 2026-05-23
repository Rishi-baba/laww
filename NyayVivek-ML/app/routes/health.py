from fastapi import APIRouter
from app.schemas import HealthCheckResponse
from app.services.model_manager import ModelManager

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthCheckResponse)
def get_health():
    """
    Diagnostic endpoint to confirm ML service health and API responsiveness.
    Returns model_loaded=true once SentenceTransformer + FAISS are fully cached.
    Used by Railway health checks, Express backend, and monitoring pipelines.
    """
    manager = ModelManager()
    return HealthCheckResponse(
        status="ok" if manager._initialized else "loading"
    )
