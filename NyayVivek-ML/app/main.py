import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.config import ALLOWED_ORIGINS
from app.routes import health, analyze, extract
from app.services.model_manager import ModelManager

# Configure root logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manages FastAPI application startup and shutdown lifecycles.
    Loads and caches SentenceTransformers, FAISS index, and dataset registry ONCE.
    """
    logger.info("Initializing NyayVivek FastAPI services...")
    try:
        ModelManager().initialize()
        logger.info("Lifespan setup completed successfully.")
    except Exception as e:
        logger.critical(f"FATAL: Failed to load machine learning assets during startup! Error: {str(e)}", exc_info=True)
        # We let this propagate to stop the server from starting in a broken state
        raise e
    yield
    logger.info("Shutting down NyayVivek FastAPI services...")

# Initialize FastAPI App
app = FastAPI(
    title="NyayVivek Legal Intelligence ML API",
    description="High-performance legal document matching, predicted statutes mapping, and evidentiary auditing using SentenceTransformers & FAISS.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS Middleware
# Restricts access strictly to authorized React Frontend and Express Backend domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Global Request Validation Error Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Catches invalid request structures (e.g. missing query field) and logs warnings.
    """
    errors = exc.errors()
    logger.warning(f"Validation failure for request to {request.url.path}: {errors}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": "Invalid request payload schema. The 'query' field is required and must be a valid string.",
            "validation_errors": errors
        }
    )

# Global Unexpected Server Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Ensures any unhandled server failures are captured, logged, and return neat clean JSON.
    """
    logger.error(f"Unhandled server exception during {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected server error occurred during case analysis processing."
        }
    )

# Middleware for Request/Response Logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Diagnostic logger mapping all incoming HTTP routing flows.
    """
    logger.info(f"Incoming: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Outgoing: {request.method} {request.url.path} - Status {response.status_code}")
    return response

# Register Application Routers
app.include_router(health.router)
app.include_router(analyze.router)
app.include_router(extract.router)

# Default root route (Home)
@app.get("/")
def home():
    """
    Simple welcome/diagnostic endpoint.
    """
    return {
        "message": "NyayVivek Intelligence Suite ML Service Running",
        "health_check": "/health",
        "case_analysis": "/analyze_case"
    }
