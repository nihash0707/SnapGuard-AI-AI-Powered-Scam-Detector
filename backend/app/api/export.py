import json
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database.db import get_db, ScanRecord
from app.schemas.analysis_schemas import ExportReportRequest
from app.services.pdf_exporter import generate_pdf_report

router = APIRouter(prefix="", tags=["Export"])

@router.post("/export/pdf")
def export_pdf_endpoint(req: ExportReportRequest, db: Session = Depends(get_db)):
    record = db.query(ScanRecord).filter(ScanRecord.id == req.analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    
    analysis_data = json.loads(record.full_json)
    pdf_bytes = generate_pdf_report(analysis_data)
    
    filename = f"SnapGuard_Report_{req.analysis_id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
