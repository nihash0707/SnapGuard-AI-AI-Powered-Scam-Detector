# SnapGuard AI - Presentation Demo Flow

This document details the step-by-step presentation demonstration for judges during the Qualcomm Snapdragon® AI Lab Challenge.

## STEP 1: Launch Application & Overview
- Open `http://localhost:3000`.
- Point out the top header:
  - **SNAPGUARD AI** logo & title
  - **Local AI** status pill
  - **Privacy Mode** (Zero Telemetry)
  - **Hardware Status** (ARM64 / Snapdragon platform detection)

## STEP 2: Message Analysis Demo
- Click **Analyze Message**.
- Click the **"Sample Scam"** preset button (or paste: `"Congratulations! You have won ₹50,000. Click this link immediately to claim your prize: http://bit.ly/claim-lucky-50k"`).
- Click **Analyze Message**.
- Show the results:
  - **Risk Score**: `92/100` (CRITICAL/HIGH)
  - **Detected Signals**: Urgency, Prize claim, URL Shortener, Financial request.
  - **AI Explanation**: Clear reasoning on why unsolicited prize links are dangerous.
  - **Action Items**: "Do not click link", "Never share OTP", "Verify independently".

## STEP 3: Screenshot OCR Demo
- Click **Analyze Screenshot**.
- Upload a sample scam SMS screenshot.
- Observe: Local OCR extraction -> Text display -> Risk Score calculation -> PDF Report generation.

## STEP 4: URL Phishing Inspection
- Click **Check URL**.
- Click **"Brand Typosquatting (Paypa1)"** button.
- Inspect domain breakdown: `paypa1-security-check.com` flagged for suspected brand impersonation of PayPal.

## STEP 5: Privacy Center & Hardware Inspection
- Navigate to **Privacy Center**: Demonstrate zero external telemetry guarantees and local SQLite persistence toggle.
- Navigate to **Hardware & AI**: Explain ARM64 native support and Qualcomm QNN execution provider readiness.
