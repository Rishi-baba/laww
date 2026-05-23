import os

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Model files configuration
DATASET_PATH = os.path.join(BASE_DIR, "temp1.xlsx")
EMBEDDINGS_PATH = os.path.join(BASE_DIR, "case_embeddings.npy")
FAISS_INDEX_PATH = os.path.join(BASE_DIR, "legal_cases.index")

# Allowed CORS Origins
ALLOWED_ORIGINS = [
    "http://localhost:5173",      # React Vite Frontend
    "http://127.0.0.1:5173",
    "http://localhost:5000",      # Express MERN Backend
    "http://127.0.0.1:5000",
    "http://localhost:3000",      # Alternate React/Express dev ports
    "http://127.0.0.1:3000",
]
