export interface RiskSignal {
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string;
  explanation?: string;
}

export interface URLDetail {
  url: string;
  scheme: string;
  domain: string;
  tld: string;
  subdomain_count: number;
  is_ip_address: boolean;
  is_shortener: boolean;
  is_https: boolean;
  has_punycode: boolean;
  suspicious_keywords: string[];
  brand_spoofing_suspected?: string;
  risk_score: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  scan_type: 'message' | 'image' | 'url' | 'combined';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  confidence: number;
  summary: string;
  signals: RiskSignal[];
  explanations: string[];
  recommendations: string[];
  extracted_text?: string;
  urls_found: URLDetail[];
  ocr_used: boolean;
  ai_provider_used: string;
  hardware_acceleration: string;
}

export interface HardwareStatus {
  os: string;
  architecture: string;
  processor: string;
  memory_gb: number;
  snapdragon_detected: boolean;
  ai_acceleration_available: boolean;
  ai_acceleration_backend?: string;
  ai_runtime_status: string;
}

export interface SystemStatus {
  status: string;
  version: string;
  hardware: HardwareStatus;
  privacy_mode: string;
  ai_provider: string;
  local_storage_enabled: boolean;
}

export interface PrivacyStatus {
  local_processing: string;
  cloud_ai: string;
  data_storage: string;
  content_retention: string;
  telemetry: string;
  store_content_enabled: boolean;
  assurance_notice: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  scan_type: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  signal_count: number;
  summary: string;
  content_preview?: string;
}

export interface DemoExample {
  id: string;
  title: string;
  category: string;
  type: 'message' | 'url' | 'image';
  content: string;
  expected_risk: string;
}
