import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"

def test_system_status_endpoint():
    resp = client.get("/api/system/status")
    assert resp.status_code == 200
    data = resp.json()
    assert "hardware" in data
    assert "privacy_mode" in data

def test_privacy_status_endpoint():
    resp = client.get("/api/privacy/status")
    assert resp.status_code == 200
    assert resp.json()["local_processing"] == "ACTIVE"

def test_analyze_message_endpoint():
    resp = client.post("/api/analyze/message", json={"content": "Congratulations! You won ₹50,000 lottery!"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["risk_score"] >= 40
    assert data["risk_level"] in ["MEDIUM", "HIGH", "CRITICAL"]

def test_analyze_url_endpoint():
    resp = client.post("/api/analyze/url", json={"url": "http://bit.ly/claim-prize-today"})
    assert resp.status_code == 200
    data = resp.json()
    assert "risk_score" in data

def test_demo_examples_endpoint():
    resp = client.get("/api/demo/examples")
    assert resp.status_code == 200
    examples = resp.json()
    assert len(examples) >= 5
