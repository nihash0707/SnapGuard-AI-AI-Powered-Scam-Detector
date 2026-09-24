import platform
import psutil
import os

def detect_hardware_capabilities() -> dict:
    """
    Detects hardware specifications without fabricating NPU/Snapdragon metrics.
    Accurately identifies ARM64 architecture, OS, RAM, and available AI runtimes.
    """
    os_name = platform.system()
    machine_arch = platform.machine()
    processor_name = platform.processor() or "Unknown Processor"
    
    # Try getting more detailed processor string on Windows
    if os_name == "Windows":
        try:
            import winreg
            key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"HARDWARE\DESCRIPTION\System\CentralProcessor\0")
            processor_name, _ = winreg.QueryValueEx(key, "ProcessorNameString")
        except Exception:
            pass

    # RAM in GB
    ram_gb = round(psutil.virtual_memory().total / (1024 ** 3), 2)
    
    # Detect Qualcomm Snapdragon platform
    snapdragon_keywords = ["snapdragon", "qualcomm", "snapdragon(tm)", "kryo", "sm8", "sm7", "sm6", "sc8", "x elite", "x plus"]
    proc_lower = processor_name.lower()
    is_snapdragon = any(k in proc_lower for k in snapdragon_keywords) or (machine_arch.lower() in ["arm64", "aarch64"] and "qualcomm" in proc_lower)

    # Check ONNX Runtime or QNN execution provider availability
    qnn_available = False
    ai_backend = "Local CPU Engine"
    
    try:
        import onnxruntime as ort
        available_providers = ort.get_available_providers()
        if 'QNNExecutionProvider' in available_providers:
            qnn_available = True
            ai_backend = "Qualcomm QNN NPU Engine"
        elif 'DirectMLExecutionProvider' in available_providers:
            ai_backend = "DirectML Acceleration"
        elif 'CUDAExecutionProvider' in available_providers:
            ai_backend = "NVIDIA CUDA Acceleration"
    except ImportError:
        pass

    # Environment overrides for testing/development
    if os.environ.get("FORCE_SNAPDRAGON") == "true":
        is_snapdragon = True

    status_str = "Snapdragon NPU Accelerated" if (is_snapdragon and qnn_available) else (
        "Local ARM64 AI Engine" if machine_arch.lower() in ["arm64", "aarch64"] else "Local AI Engine"
    )

    return {
        "os": os_name,
        "architecture": machine_arch,
        "processor": processor_name.strip(),
        "memory_gb": ram_gb,
        "snapdragon_detected": is_snapdragon,
        "ai_acceleration_available": qnn_available,
        "ai_acceleration_backend": ai_backend if qnn_available else None,
        "ai_runtime_status": status_str
    }
