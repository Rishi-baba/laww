import io
import logging
import asyncio
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pydantic import BaseModel
import fitz  # PyMuPDF
from PIL import Image
import pytesseract

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Extraction"])

class ExtractionResponse(BaseModel):
    merged_text: str
    file_names: List[str]

def run_ocr_on_image(image: Image.Image) -> str:
    """
    Synchronous CPU-bound wrapper to invoke pytesseract OCR in a worker thread.
    Catches environment configuration issues gracefully.
    """
    try:
        return pytesseract.image_to_string(image, lang="eng")
    except pytesseract.TesseractNotFoundError:
        logger.critical("Tesseract-OCR binary not detected on system PATH. OCR fallback aborted.")
        raise RuntimeError(
            "Tesseract-OCR engine is not installed or configured on the host system. "
            "Please install Tesseract-OCR and ensure the binary is registered in the system environment PATH."
        )
    except Exception as e:
        logger.error(f"Pytesseract character extraction error: {str(e)}")
        raise RuntimeError(f"OCR Extraction engine failure: {str(e)}")

async def process_pdf_page_ocr(page, page_num: int) -> str:
    """
    Asynchronously processes a single PDF page for OCR.
    Converts page to 200% resolution image and invokes Tesseract via a non-blocking thread pool.
    """
    logger.info(f"Rendering scanned page {page_num + 1} to high-resolution image...")
    # matrix=fitz.Matrix(2, 2) increases resolution by 200% for high-accuracy OCR results
    matrix = fitz.Matrix(2, 2)
    pix = page.get_pixmap(matrix=matrix)
    img_data = pix.tobytes("png")
    
    # Process image in-memory
    img = Image.open(io.BytesIO(img_data))
    
    # Run OCR in a separate thread to keep the FastAPI ASGI event loop completely non-blocking
    page_text = await asyncio.to_thread(run_ocr_on_image, img)
    return page_text

@router.post("/extract_text", response_model=ExtractionResponse)
async def extract_text_from_pdfs(files: List[UploadFile] = File(...)):
    """
    Step 1: PDF Ingestion & Extraction with Hybrid OCR Fallback.
    Accepts multiple uploaded PDF files, processes each in memory,
    detects scanned vs digital content, runs PyMuPDF text parsing or PIL/pytesseract OCR,
    and merges them into a unified, clean text stream while preserving file boundaries and page references.
    """
    logger.info(f"Received {len(files)} files for Hybrid PDF text extraction.")
    
    merged_text_parts = []
    file_names_processed = []
    MAX_FILE_SIZE = 45 * 1024 * 1024  # 45 MB single file limit

    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            logger.warning(f"Skipping non-PDF file: {file.filename}")
            continue

        try:
            logger.info(f"Parsing PDF: {file.filename}")
            
            # Read contents in chunks/memory streams
            contents = await file.read()
            
            # Check oversized PDF restriction
            if len(contents) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"PDF file '{file.filename}' exceeds the maximum allowed size of 45MB."
                )

            # Open PDF from bytes in memory
            try:
                doc = fitz.open(stream=contents, filetype="pdf")
            except Exception as pdf_err:
                logger.error(f"Failed to open PDF '{file.filename}'. File may be corrupted. Error: {str(pdf_err)}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"PDF file '{file.filename}' is corrupted or formatted incorrectly."
                )

            # Check if PDF is encrypted or password locked
            if doc.is_encrypted:
                doc.close()
                logger.warning(f"Skipping encrypted PDF file: {file.filename}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"PDF file '{file.filename}' is encrypted/password-protected and cannot be parsed."
                )

            num_pages = len(doc)
            if num_pages == 0:
                doc.close()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"PDF file '{file.filename}' contains no pages."
                )

            # Heuristic Digital-vs-Scanned Text Presence Detection
            total_chars = 0
            digital_pages_text = []
            
            for page_num in range(num_pages):
                page = doc.load_page(page_num)
                page_text = page.get_text() or ""
                digital_pages_text.append(page_text)
                total_chars += len(page_text.strip())

            # Heuristic: if character count is less than 50 or average characters per page is less than 5,
            # we classify the document as a scanned image-only PDF requiring OCR.
            is_scanned = total_chars < 50 or (total_chars / num_pages) < 5
            
            file_text_parts = [f"--- START FILE: {file.filename} ---"]

            if not is_scanned:
                # Flow A: Digital Text PDF Flow
                logger.info(f"Digital PDF detected for '{file.filename}' ({total_chars} selectable chars found).")
                for page_num in range(num_pages):
                    page_text = digital_pages_text[page_num]
                    file_text_parts.append(f"[Page {page_num + 1}]\n{page_text}")
            else:
                # Flow B: Scanned PDF OCR Fallback Flow
                logger.info(f"Scanned PDF detected for '{file.filename}' (minimal selectable text). Launching OCR pipeline...")
                
                for page_num in range(num_pages):
                    page = doc.load_page(page_num)
                    try:
                        # Extract page characters utilizing OCR in thread pool
                        page_text = await process_pdf_page_ocr(page, page_num)
                        
                        # Handle completely empty/unrecognized page scans
                        if not page_text.strip():
                            logger.warning(f"OCR returned no text for page {page_num + 1} of '{file.filename}'.")
                            page_text = "[Empty or non-selectable image page]"
                            
                        file_text_parts.append(f"[Page {page_num + 1} (OCR)]\n{page_text}")
                    except RuntimeError as r_err:
                        doc.close()
                        raise HTTPException(
                            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=str(r_err)
                        )
                    except Exception as ocr_err:
                        doc.close()
                        logger.error(f"OCR failed for page {page_num + 1} of '{file.filename}': {str(ocr_err)}")
                        raise HTTPException(
                            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"OCR failure processing page {page_num + 1} of '{file.filename}'. Error: {str(ocr_err)}"
                        )

            file_text_parts.append(f"--- END FILE: {file.filename} ---\n")
            merged_text_parts.append("\n".join(file_text_parts))
            file_names_processed.append(file.filename)
            doc.close()

        except HTTPException:
            # Re-raise HTTPExceptions directly to return correct statuses
            raise
        except Exception as e:
            logger.error(f"Unexpected error parsing PDF file {file.filename}: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An unexpected error occurred parsing PDF file '{file.filename}'. Error: {str(e)}"
            )

    if not file_names_processed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid PDF documents were successfully processed."
        )

    merged_text = "\n".join(merged_text_parts)
    logger.info(f"Hybrid PDF processing complete. Merged {len(file_names_processed)} files ({len(merged_text)} total chars).")
    
    return ExtractionResponse(
        merged_text=merged_text,
        file_names=file_names_processed
    )
