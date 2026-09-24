# SnapGuard AI - Judging Presentation Brief

**Project Title**: SNAPGUARD AI  
**Subtitle**: Private On-Device AI Scam & Phishing Detector  
**Event**: Qualcomm Snapdragon® AI Lab Build & Present Challenge  

---

## 1. Problem Statement
Digital scams, phishing SMS, fake job offers, parcel delivery fraud, and typosquatted banking links cause millions of dollars in financial losses daily. Users often paste sensitive personal messages into cloud AI chatbots, unintentionally exposing private financial details and OTPs to remote servers.

## 2. Solution: SnapGuard AI
SnapGuard AI is a privacy-first security assistant engineered specifically for Snapdragon-powered Windows PCs. It evaluates suspicious text messages, screenshots, and URLs completely on-device, returning:
- Threat Risk Level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- Calibrated Risk Score (`0–100`)
- Detected Warning Indicators with evidence snippets
- Actionable step-by-step security recommendations
- Exportable PDF security reports

## 3. Core Differentiator
- **Zero Cloud API Reliance**: Core heuristic scoring and AI reasoning run locally on Windows ARM64 hardware.
- **Transparent Hardware Detection**: Accurately reports Snapdragon platform detection and NPU acceleration status without fabricating hardware claims.
- **Multimodal Security Analysis**: Seamless text + screenshot OCR + URL domain breakdown pipeline.

## 4. Architecture Summary
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React icons, Recharts.
- **Backend**: FastAPI, Pydantic, Uvicorn, SQLite database.
- **Local AI Engine**: `LocalAIProvider` interface supporting GGUF/Ollama models and deterministic offline rule engines.

## 5. Privacy Commitment
All communications remain strictly on the user's device. No telemetry or payload tracking is transmitted to cloud servers.
