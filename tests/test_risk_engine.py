import pytest
import asyncio
from app.services.risk_engine import evaluate_security_risk

@pytest.mark.asyncio
async def test_safe_message():
    res = await evaluate_security_risk(
        text_content="Hey Sarah, are we still meeting for lunch at 1 PM today?",
        scan_type="message"
    )
    assert res["risk_level"] == "LOW"
    assert res["risk_score"] < 30

@pytest.mark.asyncio
async def test_prize_reward_scam():
    res = await evaluate_security_risk(
        text_content="Congratulations! You have won ₹50,000 in the lucky draw. Click this link immediately to claim your reward!",
        scan_type="message"
    )
    assert res["risk_level"] in ["HIGH", "CRITICAL"]
    assert res["risk_score"] >= 60
    signal_names = [s["name"] for s in res["signals"]]
    assert any("Prize" in s or "Urgency" in s for s in signal_names)

@pytest.mark.asyncio
async def test_otp_credential_harvesting():
    res = await evaluate_security_risk(
        text_content="URGENT: Your bank account password has expired. Verify your OTP and card number now to prevent suspension.",
        scan_type="message"
    )
    assert res["risk_level"] in ["HIGH", "CRITICAL"]
    assert res["risk_score"] >= 75
    signal_names = [s["name"] for s in res["signals"]]
    assert any("Credential" in s or "OTP" in s for s in signal_names)

@pytest.mark.asyncio
async def test_employment_scam():
    res = await evaluate_security_risk(
        text_content="Part-time work from home job hiring now! Earn ₹5000 daily with no experience needed. Contact recruiter on Telegram.",
        scan_type="message"
    )
    assert res["risk_level"] in ["MEDIUM", "HIGH"]
    assert res["risk_score"] >= 30

@pytest.mark.asyncio
async def test_delivery_fee_scam():
    res = await evaluate_security_risk(
        text_content="USPS: Your parcel delivery failed due to unpaid customs fee. Update your card details at http://usps-pay.top",
        scan_type="message"
    )
    assert res["risk_level"] in ["HIGH", "CRITICAL"]
    assert res["risk_score"] >= 65

@pytest.mark.asyncio
async def test_crypto_investment_scam():
    res = await evaluate_security_risk(
        text_content="Guaranteed returns! Double your Bitcoin in 24 hours on our automated trading platform.",
        scan_type="message"
    )
    assert res["risk_level"] in ["MEDIUM", "HIGH", "CRITICAL"]

@pytest.mark.asyncio
async def test_tech_support_scam():
    res = await evaluate_security_risk(
        text_content="WARNING: Microsoft Support virus detected! Call security team immediately to clean your infected computer.",
        scan_type="message"
    )
    assert res["risk_level"] in ["HIGH", "CRITICAL"]

@pytest.mark.asyncio
async def test_all_caps_pressure():
    res = await evaluate_security_risk(
        text_content="ACT NOW IMMEDIATELY THIS IS YOUR FINAL WARNING ACCOUNT SUSPENSION TODAY ONLY",
        scan_type="message"
    )
    assert res["risk_score"] > 40

@pytest.mark.asyncio
async def test_url_with_ip_address():
    res = await evaluate_security_risk(
        url_input="http://192.168.1.100/login-verify",
        scan_type="url"
    )
    assert res["risk_score"] >= 50
    assert any("IP Address" in s["name"] for s in res["signals"])

@pytest.mark.asyncio
async def test_brand_spoofing_url():
    res = await evaluate_security_risk(
        url_input="http://paypa1-security-check.com/signin",
        scan_type="url"
    )
    assert res["risk_level"] in ["HIGH", "CRITICAL"]
    assert any("Spoofing" in s["name"] or "Impersonation" in s["name"] for s in res["signals"])
