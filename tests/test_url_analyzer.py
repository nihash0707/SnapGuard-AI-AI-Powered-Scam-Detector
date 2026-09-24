import pytest
from app.services.url_analyzer import analyze_single_url, extract_urls_from_text

def test_extract_urls():
    text = "Check this prize link http://bit.ly/prize50k and also www.google.com for info."
    urls = extract_urls_from_text(text)
    assert len(urls) == 2
    assert "http://bit.ly/prize50k" in urls

def test_ip_address_url():
    analysis = analyze_single_url("http://192.168.1.1/login")
    assert analysis["is_ip_address"] is True
    assert analysis["risk_score"] >= 45

def test_url_shortener():
    analysis = analyze_single_url("http://bit.ly/xyz123")
    assert analysis["is_shortener"] is True
    assert analysis["risk_score"] >= 25

def test_suspicious_tld():
    analysis = analyze_single_url("http://secure-bank-login.xyz")
    assert analysis["tld"] == "xyz"
    assert any("Suspicious TLD" in s["name"] for s in analysis["signals"])

def test_brand_spoofing():
    analysis = analyze_single_url("http://paypa1-account-verification.com/login")
    assert analysis["brand_spoofing_suspected"] == "paypal"
    assert analysis["risk_score"] >= 50

def test_safe_url():
    analysis = analyze_single_url("https://www.qualcomm.com/snapdragon")
    assert analysis["risk_score"] == 0
    assert len(analysis["signals"]) == 0
