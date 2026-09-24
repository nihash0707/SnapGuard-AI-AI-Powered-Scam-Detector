from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime

class RiskSignal(BaseModel):
    name: str = Field(..., description="Signal name e.g. Urgency, Financial Request")
    severity: str = Field(..., description="Severity level: low, medium, high, critical")
    description: str = Field(..., description="Description of the risk indicator")
    evidence: str = Field(..., description="Snippet of content triggering this signal")
    explanation: Optional[str] = Field(None, description="Detailed reasoning for this signal")

class URLDetail(BaseModel):
    url: str
    scheme: str
    domain: str
    tld: str
    subdomain_count: int
    is_ip_address: bool
    is_shortener: bool
    is_https: bool
    has_punycode: bool
    suspicious_keywords: List[str] = []
    brand_spoofing_suspected: Optional[str] = None
    risk_score: int

class MessageAnalysisRequest(BaseModel):
    content: str = Field(..., min_length=1, description="Message text to analyze")
    source: Optional[str] = Field("manual", description="SMS, WhatsApp, Email, Web, etc.")

class URLAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=3, description="URL to analyze")

class AnalysisResponse(BaseModel):
    id: str
    timestamp: str
    scan_type: str  # message, image, url, combined
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    risk_score: int  # 0 - 100
    confidence: int  # 0 - 100
    summary: str
    signals: List[RiskSignal]
    explanations: List[str]
    recommendations: List[str]
    extracted_text: Optional[str] = None
    urls_found: List[URLDetail] = []
    ocr_used: bool = False
    ai_provider_used: str  # "Local AI (LLM)", "Rule-based Fallback", etc.
    hardware_acceleration: str

class HardwareStatusResponse(BaseModel):
    os: str
    architecture: str
    processor: str
    memory_gb: float
    snapdragon_detected: bool
    ai_acceleration_available: bool
    ai_acceleration_backend: Optional[str]
    ai_runtime_status: str

class SystemStatusResponse(BaseModel):
    status: str
    version: str
    hardware: HardwareStatusResponse
    privacy_mode: str
    ai_provider: str
    local_storage_enabled: bool

class HistoryItemResponse(BaseModel):
    id: str
    timestamp: str
    scan_type: str
    risk_level: str
    risk_score: int
    signal_count: int
    summary: str
    content_preview: Optional[str] = None

class HistoryDetailResponse(AnalysisResponse):
    pass

class ExportReportRequest(BaseModel):
    analysis_id: str
    format: str = Field("json", description="json or pdf")
    include_evidence: bool = True
