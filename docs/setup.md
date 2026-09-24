# SnapGuard AI - Setup & Installation Guide

Follow these exact steps to run SnapGuard AI locally on Windows (x64 or Snapdragon ARM64).

## Prerequisites
- Python 3.10+ installed
- Node.js v18+ and npm installed

## 1. Backend Setup
```bash
# Open terminal in project root
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python run.py
```
Backend will start on `http://127.0.0.1:8000`.

## 2. Frontend Setup
```bash
# Open a second terminal in project root
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend will be accessible at `http://localhost:3000`.

## 3. Running Unit Tests
```bash
# From project root directory with .venv activated:
pytest tests/
```
