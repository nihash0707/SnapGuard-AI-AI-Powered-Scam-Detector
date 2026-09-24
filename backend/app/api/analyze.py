import json
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.schemas.analysis_schemas import (
    MessageAnalysisRequest, URLAnalysisRequest, AnalysisResponse
)
from app.services.risk_engine import evaluate_security_risk
from app.services.image_analyzer import process_image_analysis
from app.database.db import get_db, ScanRecord, SystemSetting

router = APIRouter(prefix="", tags=["Analyze"])

def should_store_content(db: Session) -> bool:
    setting = db.query(SystemSetting).filter(SystemSetting.key == "store_scan_content").first()
    return setting.value.lower() == "true" if setting else False

def save_scan_to_history(db: Session, result: dict, raw_content: Optional[str] = None):
    try:
        store_flag = should_store_content(db)
        record = ScanRecord(
            id=result["id"],
            scan_type=result["scan_type"],
            risk_level=result["risk_level"],
            risk_score=result["risk_score"],
            signal_count=len(result.get("signals", [])),
            summary=result["summary"],
            full_json=json.dumps(result),
            content=raw_content if store_flag else None
        )
        db.add(record)
        db.commit()
    except Exception:
        db.rollback()

@router.post("/analyze/message", response_model=AnalysisResponse)
async def analyze_message_endpoint(
    req: MessageAnalysisRequest,
    db: Session = Depends(get_db)
):
    if not req.content or len(req.content.strip()) == 0:
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")
    
    result = await evaluate_security_risk(
        text_content=req.content,
        scan_type="message"
    )
    save_scan_to_history(db, result, raw_content=req.content)
    return result

@router.post("/analyze/url", response_model=AnalysisResponse)
async def analyze_url_endpoint(
    req: URLAnalysisRequest,
    db: Session = Depends(get_db)
):
    if not req.url or len(req.url.strip()) == 0:
        raise HTTPException(status_code=400, detail="URL input cannot be empty.")
    
    result = await evaluate_security_risk(
        url_input=req.url.strip(),
        scan_type="url"
    )
    save_scan_to_history(db, result, raw_content=req.url)
    return result

@router.post("/analyze/image", response_model=AnalysisResponse)
async def analyze_image_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid PNG, JPG, or WEBP image.")
    
    try:
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds maximum 10MB limit.")
        
        parsed_img = process_image_analysis(contents, filename=file.filename)
        
        result = await evaluate_security_risk(
            image_ocr_text=parsed_img["extracted_text"],
            ocr_used=parsed_img["ocr_used"],
            scan_type="image"
        )
        result["extracted_text"] = parsed_img["extracted_text"]
        result["urls_found"] = parsed_img["urls_found"]
        
        save_scan_to_history(db, result, raw_content=f"[Image: {file.filename}] Text: {parsed_img['extracted_text']}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis error: {str(e)}")
