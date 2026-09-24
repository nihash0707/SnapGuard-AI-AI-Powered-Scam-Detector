from typing import Dict, Any
from app.services.ocr_service import extract_text_from_image_bytes
from app.services.url_analyzer import extract_urls_from_text, analyze_single_url

def process_image_analysis(image_bytes: bytes, filename: str = "image.png") -> Dict[str, Any]:
    """
    Processes image upload through OCR, extracts text and URLs, and prepares analysis payload.
    """
    extracted_text, ocr_success, ocr_engine = extract_text_from_image_bytes(image_bytes)

    urls = extract_urls_from_text(extracted_text)
    url_details = [analyze_single_url(u) for u in urls]

    return {
        "extracted_text": extracted_text,
        "ocr_used": ocr_success,
        "ocr_engine": ocr_engine,
        "urls_found": url_details,
        "filename": filename
    }
