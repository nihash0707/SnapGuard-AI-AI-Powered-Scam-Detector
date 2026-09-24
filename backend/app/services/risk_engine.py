import uuid
import datetime
from typing import Dict, Any, List
from app.services.text_analyzer import analyze_text_content
from app.services.url_analyzer import extract_urls_from_text, analyze_single_url
from app.services.ai_provider import get_ai_provider
from app.services.hardware_detection import detect_hardware_capabilities

async def evaluate_security_risk(
    text_content: str = "",
    url_input: str = "",
    image_ocr_text: str = "",
    ocr_used: bool = False,
    scan_type: str = "message",
    ai_provider_mode: str = "auto"
) -> Dict[str, Any]:
    """
    Unified Security Risk Evaluation Engine.
    Combines text heuristics, URL static analysis, OCR outputs, and AI reasoning.
    """
    combined_text = (text_content + " " + image_ocr_text).strip()
    if url_input:
        combined_text = (url_input + " " + combined_text).strip()

    # 1. Analyze text heuristics
    text_res = analyze_text_content(combined_text)
    text_signals = text_res["signals"]
    text_score = text_res["base_risk_score"]

    # 2. Extract and analyze URLs
    found_urls = extract_urls_from_text(combined_text)
    if url_input and url_input not in found_urls:
        found_urls.insert(0, url_input)

    url_details = []
    url_signals = []
    max_url_score = 0

    for u_str in found_urls:
        u_analysis = analyze_single_url(u_str)
        url_details.append(u_analysis)
        url_signals.extend(u_analysis.get("signals", []))
        if u_analysis["risk_score"] > max_url_score:
            max_url_score = u_analysis["risk_score"]

    # 3. Combine risk score with calibrated weights
    all_signals = text_signals + url_signals
    
    # Check for critical signals
    has_critical_signal = any(s.get("severity") == "critical" for s in all_signals)
    has_high_signal = any(s.get("severity") == "high" for s in all_signals)

    base_max = max(text_score, max_url_score)
    signal_count_penalty = min(30, max(0, len(all_signals) - 1) * 10)
    
    raw_total = base_max + signal_count_penalty
    
    # Ensure critical/high signals raise the score into HIGH/CRITICAL range
    if has_critical_signal:
        raw_total = max(82, raw_total)
    elif has_high_signal:
        raw_total = max(68, raw_total)

    final_score = min(100, max(0, raw_total))

    # 4. Map risk score to risk level
    if final_score >= 80:
        risk_level = "CRITICAL"
    elif final_score >= 60:
        risk_level = "HIGH"
    elif final_score >= 30:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # 5. Obtain AI Provider explanations
    ai_provider = get_ai_provider(ai_provider_mode)
    ai_result = await ai_provider.generate_explanation(
        content=combined_text,
        risk_score=final_score,
        risk_level=risk_level,
        detected_signals=all_signals,
        urls_found=url_details
    )

    # 6. Detect hardware runtime capabilities
    hw = detect_hardware_capabilities()
    hw_summary = f"{hw['os']} ({hw['architecture']}) - {hw['ai_runtime_status']}"

    scan_id = f"scan_{uuid.uuid4().hex[:10]}"
    timestamp_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        "id": scan_id,
        "timestamp": timestamp_str,
        "scan_type": scan_type,
        "risk_level": risk_level,
        "risk_score": final_score,
        "confidence": ai_result.get("confidence", 92),
        "summary": ai_result.get("summary", "Analysis completed."),
        "signals": all_signals,
        "explanations": ai_result.get("explanation", []),
        "recommendations": ai_result.get("recommendations", []),
        "extracted_text": image_ocr_text if ocr_used else (text_content or None),
        "urls_found": url_details,
        "ocr_used": ocr_used,
        "ai_provider_used": ai_result.get("provider_used", ai_provider.provider_name),
        "hardware_acceleration": hw_summary
    }
