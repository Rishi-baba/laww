import os

# ============================================================
# NyayVivek-ML — App Configuration
# ============================================================
# All values can be overridden via Railway environment variables.
# Local defaults are set so the app runs without any .env file in dev.

# Base directory of the project (parent of /app package)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- ML Asset File Paths ---
# Override on Railway if you mount assets from a volume or different path.
DATASET_PATH    = os.getenv("DATASET_PATH",    os.path.join(BASE_DIR, "temp1.xlsx"))
EMBEDDINGS_PATH = os.getenv("EMBEDDINGS_PATH", os.path.join(BASE_DIR, "case_embeddings.npy"))
FAISS_INDEX_PATH = os.getenv("FAISS_INDEX_PATH", os.path.join(BASE_DIR, "legal_cases.index"))

# --- Allowed CORS Origins ---
# Always include common local dev origins.
_DEFAULT_ORIGINS = [
    "http://localhost:5173",      # React Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:5000",      # Express MERN backend
    "http://127.0.0.1:5000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# ALLOWED_ORIGINS_EXTRA: comma-separated list of production URLs injected via Railway env var.
# Example Railway value: https://nyayvivek.up.railway.app,https://lawra.vercel.app
_extra = os.getenv("ALLOWED_ORIGINS_EXTRA", "")
_extra_origins = [origin.strip() for origin in _extra.split(",") if origin.strip()]

ALLOWED_ORIGINS = _DEFAULT_ORIGINS + _extra_origins
