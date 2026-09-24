import re
from typing import Dict, List, Any

# Pattern Category Definitions with weighted threat scores
PATTERNS = {
    "urgency": {
        "regex": r"(?i)(act now|immediately|urgent|within \d+ (hours?|mins?|minutes?)|limited time|expiry|expire|account (will be|has been) (suspended|locked|blocked|terminated)|today only|final notice|immediate action)",
        "name": "Urgency & Fear Pressure",
        "severity": "high",
        "explanation": "Scammers manufacture artificial time pressure to panic victims into acting without verifying authenticity."
    },
    "prize_reward": {
        "regex": r"(?i)(congratulations|congrats|won|winner|lottery|lucky winner|reward|claim (your|the) (prize|reward|cash|bonus)|[₹\$]\s?[\d,]+|50,?000|100,?000|jackpot|selected for a prize|gift card)",
        "name": "Unsolicited Prize / Reward Bait",
        "severity": "high",
        "explanation": "Unsolicited prize or lottery announcements are classic traps designed to lure victims into paying fake release taxes or revealing credentials."
    },
    "credential_harvesting": {
        "regex": r"(?i)(otp|one time password|verify your account|confirm your password|login details|pin|security code|bank details|card number|cvv|account verification|update your credentials|verify now|passcode)",
        "name": "Credential & OTP Harvest Attempt",
        "severity": "critical",
        "explanation": "Requesting OTPs, passwords, or PINs via message is the primary mechanism for financial account takeover and identity theft."
    },
    "bank_threat": {
        "regex": r"(?i)(bank account|sbi|hdfc|icici|chase|wells fargo|kyc|kyc update|unusual (activity|transaction)|deactivated|unauthorized transaction|card blocked|net banking)",
        "name": "Financial Institution Impersonation",
        "severity": "critical",
        "explanation": "Impersonating banks with threats of account blocking aims to trick users into revealing sensitive banking credentials."
    },
    "employment_scam": {
        "regex": r"(?i)(work from home|part-time job|earn [₹\$]?\s?\d+ per day|daily payout|no experience|hiring now|telegram for job|whatsapp recruiter|easy money|online job|review jobs)",
        "name": "Recruitment & Work-From-Home Scam",
        "severity": "medium",
        "explanation": "Promises of high daily income for minimal effort are fraudulent recruitment schemes designed to extract advance payments or personal data."
    },
    "delivery_scam": {
        "regex": r"(?i)(parcel|package|shipment|delivery failed|customs fee|address incomplete|usps|fedex|dhl|post|track package|delivery fee|held at hub)",
        "name": "Fake Delivery Fee Fraud",
        "severity": "high",
        "explanation": "Fake package delivery alerts trick victims into clicking phishing links and submitting credit card details for non-existent fees."
    },
    "crypto_investment": {
        "regex": r"(?i)(bitcoin|crypto|guaranteed returns|double your money|investment platform|passive income|trading bot|forex profit|crypto bonus)",
        "name": "Cryptocurrency Investment Trap",
        "severity": "high",
        "explanation": "Guaranteed financial returns and cryptocurrency double-your-money claims are hallmark indicators of Ponzi schemes."
    },
    "tech_support": {
        "regex": r"(?i)(microsoft support|apple support|virus detected|computer infected|call support immediately|security team|helpdesk|trojan warning)",
        "name": "Tech Support Impersonation",
        "severity": "high",
        "explanation": "Fake computer virus warnings panic victims into calling fraudulent call centers or installing remote access malware."
    },
    "tax_refund": {
        "regex": r"(?i)(tax refund|income tax|it department|irs refund|claim tax return|refund approved|refund status)",
        "name": "Fake Tax Refund Fraud",
        "severity": "high",
        "explanation": "Scammers impersonate government tax agencies to trick victims into sharing banking details for fictitious refunds."
    },
    "qr_code_scam": {
        "regex": r"(?i)(scan qr|scan this qr|scan code to receive|pay via qr|scan to collect|receive payment qr)",
        "name": "Reverse QR Code Payment Scam",
        "severity": "high",
        "explanation": "Scanning a QR code DEBITS your account instead of depositing money. Legitimate incoming transfers never require QR authorization."
    },
    "utility_scam": {
        "regex": r"(?i)(electricity (bill|power|supply)|power cut|disconnection tonight|utility bill|pay electric bill|power officer)",
        "name": "Emergency Utility Disconnection Trap",
        "severity": "high",
        "explanation": "Threats of immediate power or water cutoff trick victims into making panic payments to fraud accounts."
    }
}

def analyze_text_content(text: str) -> Dict[str, Any]:
    """
    Analyzes message text against security threat patterns and heuristics.
    Returns detected signals, severity ratings, matched evidence, and weighted risk score.
    """
    if not text or len(text.strip()) == 0:
        return {"signals": [], "base_risk_score": 0, "matched_categories": []}

    signals = []
    base_score = 0
    matched_cats = []

    for cat_key, pdata in PATTERNS.items():
        matches = list(re.finditer(pdata["regex"], text))
        if matches:
            matched_cats.append(cat_key)
            evidence_snippets = list(set([m.group(0).strip() for m in matches[:3]]))
            evidence_str = f"Found indicator(s): '{', '.join(evidence_snippets)}'"

            severity = pdata["severity"]
            weight = 45 if severity == "critical" else (35 if severity == "high" else 20)
            base_score += weight

            signals.append({
                "name": pdata["name"],
                "severity": severity,
                "description": f"Message exhibits '{pdata['name']}' indicators.",
                "evidence": evidence_str,
                "explanation": pdata["explanation"]
            })

    # Heuristics: ALL-CAPS ratio
    text_clean = text.strip()
    alpha_chars = [c for c in text_clean if c.isalpha()]
    if len(alpha_chars) > 15:
        caps_ratio = sum(1 for c in alpha_chars if c.isupper()) / len(alpha_chars)
        if caps_ratio > 0.50:
            base_score += 15
            signals.append({
                "name": "Aggressive Capitalization (ALL CAPS)",
                "severity": "low",
                "description": f"{int(caps_ratio*100)}% of characters are capitalized.",
                "evidence": text_clean[:50] + "...",
                "explanation": "Aggressive ALL-CAPS formatting is used to artificially heighten emotional urgency."
            })

    # Heuristics: Punctuation frequency
    exclamation_count = text_clean.count("!") + text_clean.count("$") + text_clean.count("₹")
    if exclamation_count >= 3:
        base_score += 15
        signals.append({
            "name": "Excessive Exclamation & Currency Symbols",
            "severity": "low",
            "description": f"Contains {exclamation_count} exclamation/currency characters.",
            "evidence": f"Symbol count: {exclamation_count}",
            "explanation": "High frequency of currency symbols and exclamations is common in spam clickbait."
        })

    return {
        "signals": signals,
        "base_risk_score": min(100, base_score),
        "matched_categories": matched_cats
    }
