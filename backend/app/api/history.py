import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db, ScanRecord
from app.schemas.analysis_schemas import HistoryItemResponse, AnalysisResponse

router = APIRouter(prefix="", tags=["History"])

@router.get("/history", response_model=List[HistoryItemResponse])
def get_scan_history(limit: int = 50, db: Session = Depends(get_db)):
    records = db.query(ScanRecord).order_by(ScanRecord.timestamp.desc()).limit(limit).all()
    history = []
    for r in records:
        content_snippet = None
        if r.content:
            content_snippet = r.content[:80] + "..." if len(r.content) > 80 else r.content
            
        history.append({
            "id": r.id,
            "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "scan_type": r.scan_type,
            "risk_level": r.risk_level,
            "risk_score": r.risk_score,
            "signal_count": r.signal_count,
            "summary": r.summary,
            "content_preview": content_snippet
        })
    return history

@router.get("/history/{scan_id}", response_model=AnalysisResponse)
def get_scan_detail(scan_id: str, db: Session = Depends(get_db)):
    record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Scan record not found.")
    
    data = json.loads(record.full_json)
    return data

@router.delete("/history/{scan_id}")
def delete_scan_record(scan_id: str, db: Session = Depends(get_db)):
    record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Scan record not found.")
    db.delete(record)
    db.commit()
    return {"status": "success", "deleted_id": scan_id}

@router.delete("/history")
def clear_all_history(db: Session = Depends(get_db)):
    count = db.query(ScanRecord).delete()
    db.commit()
    return {"status": "success", "cleared_count": count}
