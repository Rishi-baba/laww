import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas import CaseInput, AnalyzeCaseResponse
from app.services.model_manager import ModelManager

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Analysis"])

@router.post("/analyze_case", response_model=AnalyzeCaseResponse)
def analyze(data: CaseInput):
    """
    Main case analysis route.
    Receives case query text, encodes it using SentenceTransformers,
    and returns predicted statutes, similar cases, evidence linkage,
    missing evidence warnings, and judgment analytics.
    """
    # 1. Validation for empty query
    query_text = data.query.strip()
    if not query_text:
        logger.warning("Empty case query text received in POST /analyze_case.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query string cannot be empty. Please provide case details for analysis."
        )

    logger.info(f"Received case query analysis request (length: {len(query_text)} chars).")

    # 2. Trigger Inference Pipeline via Singleton ModelManager
    try:
        manager = ModelManager()
        results = manager.analyze_case(query_text)
        
        # Checking if zero matches returned due to confidence threshold filter
        if not results["similar_cases"] and not results["predicted_sections"]:
            logger.info("Semantic FAISS search finished with no matches above the 0.45 similarity threshold.")
            
        logger.info("Successfully completed multi-dimensional case analysis.")
        return results

    except Exception as e:
        logger.error(f"Failed to perform semantic inference on query: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal ML Engine Error: Failed to complete case search. Details: {str(e)}"
        )
