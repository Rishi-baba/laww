from fastapi import APIRouter
from app.schemas import HealthCheckResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthCheckResponse)
def get_health():
    """
    Diagnostic endpoint to confirm ML service health and API responsiveness.
    Used by Express backend, load balancers, or monitoring pipelines.
    """
    return HealthCheckResponse(status="ok")
