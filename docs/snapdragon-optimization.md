# SnapGuard AI - Qualcomm Snapdragon® Optimization Guide

This document outlines how SnapGuard AI leverages Qualcomm Snapdragon® hardware and ARM64 architecture for high-efficiency on-device AI inference.

## Snapdragon Hardware Integration Architecture

```
Frontend (React)
    ↓
FastAPI REST API
    ↓
LocalAIProvider Interface
    ↓
Model Execution Layer (ONNX Runtime / Ollama)
    ↓
Qualcomm QNN Execution Provider (QNNExecutionProvider)
    ↓
Snapdragon Hexagon NPU / Adreno GPU / Kryo CPU
```

## Optimization Principles
1. **Zero x86 Dependencies**: All Python packages (`pillow`, `pydantic`, `fastapi`, `sqlalchemy`, `httpx`) and Node.js components execute natively on Windows ARM64.
2. **QNN Acceleration Probe**: The `hardware_detection.py` service checks for ONNX Runtime with `QNNExecutionProvider`. When present on Snapdragon PCs, inference ops offload to Hexagon NPU cores.
3. **Graceful Fallback**: If NPU runtime DLLs are unmounted, SnapGuard AI routes to ARM64 NEON vectorized CPU execution or the local rule-based security engine without throwing runtime errors.
4. **Thermal & Battery Efficiency**: On-device quantized GGUF/ONNX models minimize memory bandwidth consumption and maximize battery endurance during continuous background message scanning.
