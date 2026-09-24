import re
from urllib.parse import urlparse, parse_qs
from typing import Dict, List, Any

# Common URL shorteners
SHORTENERS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
    "buff.ly", "adf.ly", "bit.do", "cutt.ly", "rb.gy", "shorturl.at"
}

# Suspicious TLDs often abused in low-cost scam campaigns
SUSPICIOUS_TLDS = {
    "zip", "mov", "tk", "ml", "ga", "cf", "gq", "top", "xyz", "club",
    "work", "loan", "click", "download", "racing", "win", "online", "site"
}

# Popular targeted brand keywords for spoofing detection
TARGET_BRANDS = [
    "paypal", "google", "apple", "microsoft", "amazon", "netflix",
    "meta", "facebook", "instagram", "whatsapp", "telegram",
    "binance", "coinbase", "chase", "bankofamerica", "wellsfargo",
    "sbi", "hdfc", "icici", "axis", "kotak", "paytm", "phonepe", "gpay",
    "fedex", "dhl", "usps", "ubereats"
]

SUSPICIOUS_PATH_KEYWORDS = [
    "login", "signin", "verify", "verification", "secure", "account",
    "update", "banking", "wallet", "claim", "reward", "prize", "otp",
    "password", "confirm", "kyc", "suspended", "unusual-activity",
    "security-check", "authenticate", "billing", "restore"
]

def extract_urls_from_text(text: str) -> List[str]:
    """Finds all URLs in a string using regex."""
    url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
    urls = re.findall(url_pattern, text)
    # Clean trailing punctuation
    cleaned = []
    for u in urls:
        u_clean = u.rstrip('.,;!?:)"\'')
        cleaned.append(u_clean)
    return cleaned

def analyze_single_url(url_str: str) -> Dict[str, Any]:
    """
    Performs comprehensive static heuristic analysis on a URL.
    Returns structured metrics and detected risk indicators.
    """
    if not url_str.startswith("http://") and not url_str.startswith("https://"):
        url_str = "http://" + url_str

    try:
        parsed = urlparse(url_str)
    except Exception:
        return {
            "url": url_str,
            "scheme": "unknown",
            "domain": "invalid",
            "tld": "",
            "subdomain_count": 0,
            "is_ip_address": False,
            "is_shortener": False,
            "is_https": False,
            "has_punycode": False,
            "suspicious_keywords": [],
            "brand_spoofing_suspected": None,
            "risk_score": 50,
            "signals": [{
                "name": "Invalid URL Structure",
                "severity": "medium",
                "description": "URL could not be parsed correctly.",
                "evidence": url_str,
                "explanation": "Malformed URL format often indicates obfuscation or syntax errors."
            }]
        }

    scheme = parsed.scheme.lower()
    netloc = parsed.netloc.lower()
    # Strip port if present
    domain_part = netloc.split(":")[0]

    # Check IP address host
    ip_pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
    is_ip = bool(re.match(ip_pattern, domain_part))

    # Breakdown subdomains and TLD
    parts = domain_part.split(".")
    tld = parts[-1] if len(parts) > 1 else ""
    subdomain_count = max(0, len(parts) - 2)

    # Check URL Shortener
    is_shortener = domain_part in SHORTENERS or f"www.{domain_part}" in SHORTENERS

    # Check Punycode / Homograph attack
    has_punycode = "xn--" in domain_part

    # Check HTTPS
    is_https = scheme == "https"

    # Detect suspicious path/query keywords
    path_and_query = (parsed.path + "?" + parsed.query).lower()
    matched_keywords = [kw for kw in SUSPICIOUS_PATH_KEYWORDS if kw in path_and_query]

    # Detect Brand Spoofing / Typosquatting
    suspected_brand = None
    for brand in TARGET_BRANDS:
        # If brand name is in the domain but it's not the official main domain
        if brand in domain_part:
            official_domain = f"{brand}.com"
            if not domain_part.endswith(official_domain) and not domain_part.endswith(f".{brand}.com"):
                # Levenshtein / visual similarity check or subdomain spoof check
                suspected_brand = brand
                break
        else:
            # Check typosquatting like paypa1, g00gle, amaz0n
            typo_map = {'1': 'l', '0': 'o', '3': 'e', '5': 's', '@': 'a'}
            normalized_dom = domain_part
            for char, sub in typo_map.items():
                normalized_dom = normalized_dom.replace(char, sub)
            if brand in normalized_dom:
                suspected_brand = brand
                break

    # Calculate URL specific risk score & signals
    risk_score = 0
    signals = []

    if is_ip:
        risk_score += 45
        signals.append({
            "name": "IP Address Host",
            "severity": "high",
            "description": "URL uses a raw IP address instead of a domain name.",
            "evidence": domain_part,
            "explanation": "Legitimate organizations rarely use IP addresses directly in customer links."
        })

    if is_shortener:
        risk_score += 25
        signals.append({
            "name": "URL Shortener",
            "severity": "medium",
            "description": "URL shortener obfuscates the destination address.",
            "evidence": domain_part,
            "explanation": "Shorteners are frequently used to hide suspicious destination domains."
        })

    if has_punycode:
        risk_score += 40
        signals.append({
            "name": "Punycode Obfuscation",
            "severity": "high",
            "description": "URL contains internationalized domain characters (punycode).",
            "evidence": domain_part,
            "explanation": "Punycode can be used for homograph attacks to impersonate real brands visually."
        })

    if suspected_brand:
        risk_score += 50
        signals.append({
            "name": f"Suspected Brand Impersonation ({suspected_brand.capitalize()})",
            "severity": "critical",
            "description": f"Domain closely resembles official brand '{suspected_brand}' but is hosted on an unofficial domain.",
            "evidence": domain_part,
            "explanation": "Brand typosquatting is a key indicator of phishing pages intended to harvest credentials."
        })

    if tld in SUSPICIOUS_TLDS:
        risk_score += 20
        signals.append({
            "name": f"Suspicious TLD (.{tld})",
            "severity": "medium",
            "description": f"Domain uses Top Level Domain (.{tld}) frequently associated with low-cost spam campaigns.",
            "evidence": f".{tld}",
            "explanation": "Uncommon or cheap TLDs are statistically higher risk for transient scam sites."
        })

    if subdomain_count >= 3:
        risk_score += 20
        signals.append({
            "name": "Excessive Subdomains",
            "severity": "medium",
            "description": f"Domain contains {subdomain_count} nested subdomains.",
            "evidence": domain_part,
            "explanation": "Deep subdomain nesting is often used to craft misleading fake URLs."
        })

    if matched_keywords:
        risk_score += 15
        signals.append({
            "name": "Sensitive Path Keywords",
            "severity": "medium",
            "description": f"URL path contains high-risk security keywords: {', '.join(matched_keywords[:3])}.",
            "evidence": parsed.path,
            "explanation": "Keywords related to authentication or payment in unfamiliar links warrant extra caution."
        })

    if not is_https:
        risk_score += 15
        signals.append({
            "name": "Unencrypted HTTP Connection",
            "severity": "low",
            "description": "URL uses unencrypted HTTP instead of HTTPS.",
            "evidence": "http://",
            "explanation": "Lack of HTTPS means data sent over this connection can be intercepted."
        })

    final_score = min(100, risk_score)

    return {
        "url": url_str,
        "scheme": scheme,
        "domain": domain_part,
        "tld": tld,
        "subdomain_count": subdomain_count,
        "is_ip_address": is_ip,
        "is_shortener": is_shortener,
        "is_https": is_https,
        "has_punycode": has_punycode,
        "suspicious_keywords": matched_keywords,
        "brand_spoofing_suspected": suspected_brand,
        "risk_score": final_score,
        "signals": signals
    }
