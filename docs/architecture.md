# SnapGuard AI - System Architecture

SnapGuard AI is built around a privacy-first, zero-cloud-dependency security analysis pipeline.

```mermaid
graph TD
    User([User / System]) --> UI[React + Vite Frontend]
    UI -->|REST API| API[FastAPI Backend /api]
    
    subgraph Security Analysis Core
        API --> RE[Risk Engine]
        RE --> TA[Text Security Analyzer]
        RE --> UA[URL & Domain Analyzer]
        RE --> OCR[OCR & Screenshot Service]
        RE --> AI[LocalAIProvider Abstraction]
    end
    
    subgraph AI Provider Layer
        AI -->|Option 1| LLM[Local GGUF / Ollama LLM]
        AI -->|Option 2| RULE[Deterministic Security Engine]
    end
    
    subgraph Hardware Backend
        LLM --> HW[Snapdragon ARM64 NPU / CPU]
        RULE --> HW
    end
    
    subgraph Storage & Audit
        API --> DB[(Local SQLite Database)]
    end
```

## Modular Components
1. **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide icons.
2. **Backend**: FastAPI, Pydantic, Uvicorn, SQLite database.
3. **Risk Scoring Engine**: Calibrated 0–100 threat engine combining regex security indicators, typosquatting domain analysis, punycode detection, and AI explanations.
4. **Local AI Provider Abstraction**: Interfaces with local GGUF models or high-speed rule engines.
5. **Hardware Probing**: Real-time detection of Windows ARM64 platform, RAM, CPU model, and Qualcomm ONNX QNN execution providers.
