from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.config import settings
from app.services.hardware_detection import detect_hardware_capabilities
from app.database.db import get_db, SystemSetting
from app.schemas.analysis_schemas import SystemStatusResponse, HardwareStatusResponse

router = APIRouter(prefix="", tags=["System & Settings"])

@router.get("/health")
def health_check():
    return {"status": "ok", "app": settings.PROJECT_NAME, "version": settings.VERSION}

@router.get("/system/status", response_model=SystemStatusResponse)
def get_system_status(db: Session = Depends(get_db)):
    hw_info = detect_hardware_capabilities()
    
    store_setting = db.query(SystemSetting).filter(SystemSetting.key == "store_scan_content").first()
    store_enabled = store_setting.value.lower() == "true" if store_setting else False
    
    return {
        "status": "online",
        "version": settings.VERSION,
        "hardware": hw_info,
        "privacy_mode": "Maximum Privacy (Zero Telemetry)" if not store_enabled else "Custom Storage Mode",
        "ai_provider": "Local On-Device AI / Rule Engine",
        "local_storage_enabled": store_enabled
    }

@router.get("/privacy/status")
def get_privacy_status(db: Session = Depends(get_db)):
    store_setting = db.query(SystemSetting).filter(SystemSetting.key == "store_scan_content").first()
    store_enabled = store_setting.value.lower() == "true" if store_setting else False
    
    return {
        "local_processing": "ACTIVE",
        "cloud_ai": "DISABLED",
        "data_storage": "LOCAL SQLITE",
        "content_retention": "OPTIONAL (OFF by default)" if not store_enabled else "ENABLED BY USER",
        "telemetry": "OFF",
        "store_content_enabled": store_enabled,
        "assurance_notice": "SnapGuard AI is designed to minimize data leaving your device. All core heuristic and model inference run locally on Windows ARM64 / CPU runtime."
    }

@router.post("/privacy/toggle-storage")
def toggle_content_storage(enabled: bool, db: Session = Depends(get_db)):
    setting = db.query(SystemSetting).filter(SystemSetting.key == "store_scan_content").first()
    if not setting:
        setting = SystemSetting(key="store_scan_content", value=str(enabled).lower())
        db.add(setting)
    else:
        setting.value = str(enabled).lower()
    db.commit()
    return {"status": "success", "store_scan_content": enabled}

@router.get("/demo/examples")
def get_demo_examples():
    """
    Returns preloaded fictional examples for live judging presentations.
    """
    return [
        {
            "id": "demo-1",
            "title": "Fake Prize Winner SMS",
            "category": "Lottery Scam",
            "type": "message",
            "content": "Congratulations! You have won ₹50,000 in the National Lucky Draw. Click this link immediately to claim your prize: http://bit.ly/claim-lucky-50k",
            "expected_risk": "HIGH"
        },
        {
            "id": "demo-2",
            "title": "Fake Bank Account Alert",
            "category": "Banking Phishing",
            "type": "message",
            "content": "URGENT: Your SBI net banking account has been temporarily blocked due to unverified KYC. Verify your OTP and details now at http://sbi-kyc-verify-update.xyz/login",
            "expected_risk": "CRITICAL"
        },
        {
            "id": "demo-3",
            "title": "Fake Work-From-Home Job Offer",
            "category": "Employment Scam",
            "type": "message",
            "content": "Part-time job offer! Earn ₹5,000 to ₹10,000 per day by giving Google maps reviews. No experience needed. Contact recruiter on WhatsApp: +919876543210 or visit http://easy-job-payouts.top",
            "expected_risk": "HIGH"
        },
        {
            "id": "demo-4",
            "title": "Fake Package Delivery Fee",
            "category": "Delivery Scam",
            "type": "message",
            "content": "USPS: Your parcel delivery is held at the sorting hub due to unpaid customs fee of $2.99. Pay immediately to release your package: http://192.168.1.45/pay-delivery",
            "expected_risk": "CRITICAL"
        },
        {
            "id": "demo-5",
            "title": "Suspicious Phishing URL",
            "category": "URL Phishing",
            "type": "url",
            "content": "http://paypa1-security-check.account-login.top/verify-password?user=victim",
            "expected_risk": "CRITICAL"
        },
        {
            "id": "demo-6",
            "title": "Safe Meeting Invitation",
            "category": "Legitimate Message",
            "type": "message",
            "content": "Hi Alex, please find the project slides attached for our 3:00 PM team sync today. Let me know if you need to reschedule.",
            "expected_risk": "LOW"
        }
    ]
