import json
import httpx
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from app.config import settings

class LocalAIProvider(ABC):
    """
    Abstract interface for Local AI Model Providers.
    Supports local GGUF models via llama.cpp/Ollama or local fallback engines.
    """
    @abstractmethod
    async def generate_explanation(
        self,
        content: str,
        risk_score: int,
        risk_level: str,
        detected_signals: List[Dict[str, Any]],
        urls_found: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass


class LocalLLMProvider(LocalAIProvider):
    """
    Interactions with local Ollama / llama.cpp HTTP server.
    """
    def __init__(self, endpoint: str = settings.LOCAL_LLM_ENDPOINT, model: str = settings.LOCAL_LLM_MODEL):
        self.endpoint = endpoint
        self.model = model

    @property
    def provider_name(self) -> str:
        return f"Local LLM ({self.model})"

    async def generate_explanation(
        self,
        content: str,
        risk_score: int,
        risk_level: str,
        detected_signals: List[Dict[str, Any]],
        urls_found: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        prompt = f"""You are SnapGuard AI, an expert privacy-first security analyst.
Analyze the following text/URL security context:
Content: "{content}"
Calculated Risk Level: {risk_level} (Score: {risk_score}/100)
Detected Signals: {[s['name'] for s in detected_signals]}

Respond STRICTLY in JSON format with key fields:
{{
  "summary": "Brief 1-2 sentence risk assessment",
  "explanation": ["Reasoning bullet 1", "Reasoning bullet 2"],
  "recommendations": ["Action item 1", "Action item 2", "Action item 3"],
  "confidence": 85
}}
Do NOT invent non-existent facts or sender identities.
"""
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                resp = await client.post(
                    self.endpoint,
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "format": "json"
                    }
                )
                if resp.status_code == 200:
                    data = resp.json()
                    response_text = data.get("response", "{}")
                    parsed = json.loads(response_text)
                    return {
                        "summary": parsed.get("summary", "Automated AI risk breakdown."),
                        "explanation": parsed.get("explanation", []),
                        "recommendations": parsed.get("recommendations", []),
                        "confidence": parsed.get("confidence", 85),
                        "provider_used": self.provider_name
                    }
        except Exception:
            # Fall back seamlessly if endpoint is unreachable
            pass

        fallback = RuleBasedAIProvider()
        return await fallback.generate_explanation(content, risk_score, risk_level, detected_signals, urls_found)


class RuleBasedAIProvider(LocalAIProvider):
    """
    Deterministic rule-based reasoning engine fallback.
    Guarantees reliable, offline, high-speed security explanations without external LLMs.
    """
    @property
    def provider_name(self) -> str:
        return "Local Rule-Based Security Engine"

    async def generate_explanation(
        self,
        content: str,
        risk_score: int,
        risk_level: str,
        detected_signals: List[Dict[str, Any]],
        urls_found: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        signal_names = [s["name"] for s in detected_signals]

        # Generate evidence-backed summary
        if risk_level in ["CRITICAL", "HIGH"]:
            summary = f"This communication exhibits {len(detected_signals)} high-risk scam indicator(s) including {', '.join(signal_names[:2])}."
        elif risk_level == "MEDIUM":
            summary = f"This content contains potential security concerns ({', '.join(signal_names[:2]) if signal_names else 'unverified links'}). Exercise caution."
        else:
            summary = "No major high-risk threat indicators were identified. Always exercise standard vigilance."

        # Explanations
        explanations = []
        for s in detected_signals:
            explanations.append(f"• {s['name']}: {s.get('explanation', s['description'])}")

        if urls_found:
            for u in urls_found:
                if u.get("risk_score", 0) > 30:
                    explanations.append(f"• Suspicious Domain Analysis: Domain '{u['domain']}' flagged due to {', '.join(u.get('suspicious_keywords', []) or ['unverified structure'])}.")

        if not explanations:
            explanations.append("Message structure matches standard conversational tone with no suspicious keyword flags.")

        # Recommendations based on risk
        recs = []
        if risk_level in ["CRITICAL", "HIGH"]:
            recs.append("Do NOT click any embedded links or open attachments.")
            recs.append("Do NOT share One-Time Passwords (OTPs), PINs, or financial account details.")
            recs.append("Verify the sender independently using an official telephone number or website.")
            recs.append("Report the message to your service provider or cyber crime authority.")
        elif risk_level == "MEDIUM":
            recs.append("Avoid interacting with unverified links or downloading files.")
            recs.append("Double-check domain names in your browser address bar before signing in.")
            recs.append("Contact the sender through an official published channel to verify authenticity.")
        else:
            recs.append("Maintain standard digital safety awareness.")
            recs.append("Verify unknown links before entering personal information.")

        confidence = 90 if detected_signals else 80

        return {
            "summary": summary,
            "explanation": explanations,
            "recommendations": recs,
            "confidence": confidence,
            "provider_used": self.provider_name
        }


def get_ai_provider(provider_type: str = "auto") -> LocalAIProvider:
    if provider_type == "local_llm":
        return LocalLLMProvider()
    elif provider_type == "rule_based":
        return RuleBasedAIProvider()
    else:
        # Default auto mode: Attempt LLM, fallback seamlessly to Rule-Based
        return LocalLLMProvider()
