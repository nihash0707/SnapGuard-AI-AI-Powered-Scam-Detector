# SnapGuard AI - On-Device Model Directory

This directory stores local GGUF, ONNX, or PyTorch model weights for on-device inference on Snapdragon® / ARM64 hardware.

## Supported Local AI Models
1. **Llama 3 / Phi-3 / Qwen GGUF Models**:
   - Quantized GGUF models (e.g. `llama3-8b-instruct-q4_k_m.gguf` or `phi-3-mini-4k-instruct-q4.gguf`).
   - Run locally via Ollama / llama.cpp HTTP server on `http://localhost:11434`.

2. **Qualcomm QNN ONNX Runtime Models**:
   - Quantized ONNX models compiled for Qualcomm Hexagon NPU using Qualcomm Neural Processing SDK.

3. **Rule-Based Security Fallback Engine**:
   - Built into SnapGuard AI. Automatically active when GGUF/ONNX weights are unmounted.
