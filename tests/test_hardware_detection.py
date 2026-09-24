import pytest
from app.services.hardware_detection import detect_hardware_capabilities

def test_hardware_detection_schema():
    hw = detect_hardware_capabilities()
    assert "os" in hw
    assert "architecture" in hw
    assert "processor" in hw
    assert "memory_gb" in hw
    assert "snapdragon_detected" in hw
    assert "ai_acceleration_available" in hw
    assert "ai_runtime_status" in hw
    assert isinstance(hw["snapdragon_detected"], bool)
    assert isinstance(hw["memory_gb"], (int, float))
