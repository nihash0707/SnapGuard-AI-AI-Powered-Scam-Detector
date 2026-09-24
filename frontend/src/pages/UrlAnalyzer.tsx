import React, { useState } from 'react';
import { Link as LinkIcon, Search, Globe, FileText } from 'lucide-react';
import { AnalysisResult } from '../types';
import { api } from '../services/api';
import { RiskScoreMeter } from '../components/RiskScoreMeter';
import { SignalCard } from '../components/SignalCard';
import { RecommendationList } from '../components/RecommendationList';
import { ExportReportModal } from '../components/ExportReportModal';

export const UrlAnalyzer: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleAnalyze = async (urlToTest?: string) => {
    const target = urlToTest || urlInput;
    if (!target.trim()) return;
    setLoading(true);
    try {
      const res = await api.analyzeUrl(target.trim());
      setResult(res);
    } catch (e: any) {
      alert(e.response?.data?.detail || 'URL analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const urlDetail = result?.urls_found?.[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
          <LinkIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Check URL / Domain Security</h1>
          <p className="text-xs text-slate-500 font-medium">Expose typosquatting, shorteners, punycode homographs, IP hosts, and brand impersonation.</p>
        </div>
      </div>

      {/* Preset URL Buttons */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2.5 shadow-sm">
        <span className="text-xs font-extrabold text-slate-700 block uppercase font-mono">Quick Test Phishing URLs:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setUrlInput("http://paypa1-security-check.com/login"); handleAnalyze("http://paypa1-security-check.com/login"); }}
            className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-800 border border-red-200 transition-all shadow-xs"
          >
            Brand Typosquatting (Paypa1)
          </button>
          <button
            onClick={() => { setUrlInput("http://192.168.1.45/bank-update"); handleAnalyze("http://192.168.1.45/bank-update"); }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-xs font-semibold text-amber-800 border border-amber-200 transition-all shadow-xs"
          >
            Raw IP Host
          </button>
          <button
            onClick={() => { setUrlInput("http://bit.ly/claim-lucky-50k"); handleAnalyze("http://bit.ly/claim-lucky-50k"); }}
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-blue-800 border border-blue-200 transition-all shadow-xs"
          >
            Shortened URL
          </button>
          <button
            onClick={() => { setUrlInput("https://www.qualcomm.com/snapdragon"); handleAnalyze("https://www.qualcomm.com/snapdragon"); }}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 border border-emerald-200 transition-all shadow-xs"
          >
            Official Safe URL
          </button>
        </div>
      </div>

      {/* URL Input Form */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Globe className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="Enter full URL (e.g. http://suspicious-domain.xyz/verify)..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all font-mono font-medium shadow-sm"
          />
        </div>

        <button
          onClick={() => handleAnalyze()}
          disabled={loading || !urlInput.trim()}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? 'Analyzing...' : 'Analyze URL'}</span>
        </button>
      </div>

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6 pt-4 border-t border-slate-200 animate-fadeIn">
          {/* Risk Meter */}
          <RiskScoreMeter
            score={result.risk_score}
            level={result.risk_level}
            confidence={result.confidence}
          />

          {/* Domain Breakdown Cards */}
          {urlDetail && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
                <Globe className="w-4 h-4 text-purple-600" />
                <span>Domain Heuristic Analysis</span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block">DOMAIN NAME</span>
                  <span className="font-bold text-purple-700 font-mono block truncate">{urlDetail.domain}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block">TLD / SCHEME</span>
                  <span className="font-bold text-slate-800 font-mono block">.{urlDetail.tld || 'com'} ({urlDetail.scheme})</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block">ENCRYPTION</span>
                  <span className={`font-bold font-mono block ${urlDetail.is_https ? 'text-emerald-700' : 'text-red-600'}`}>
                    {urlDetail.is_https ? 'HTTPS Encrypted' : 'Unencrypted HTTP'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block">SUBDOMAINS</span>
                  <span className="font-bold text-slate-800 font-mono block">{urlDetail.subdomain_count} Subdomain(s)</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {urlDetail.is_ip_address && (
                  <span className="text-[10px] font-mono font-bold bg-red-100 text-red-800 px-2.5 py-1 rounded-full border border-red-200">
                    RAW IP HOST DETECTED
                  </span>
                )}

                {urlDetail.is_shortener && (
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200">
                    URL SHORTENER
                  </span>
                )}

                {urlDetail.brand_spoofing_suspected && (
                  <span className="text-[10px] font-mono font-bold bg-red-100 text-red-800 px-2.5 py-1 rounded-full border border-red-200">
                    SUSPECTED BRAND SPOOF: {urlDetail.brand_spoofing_suspected.toUpperCase()}
                  </span>
                )}

                {urlDetail.has_punycode && (
                  <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full border border-purple-200">
                    PUNYCODE HOMOGRAPH ATTACK
                  </span>
                )}
              </div>
            </div>
          )}

          {/* AI Explanation */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
            <h3 className="text-sm font-black text-slate-900">Security Assessment</h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">{result.summary}</p>
          </div>

          {/* Signals */}
          <SignalCard signals={result.signals} />

          {/* Recommendations */}
          <RecommendationList recommendations={result.recommendations} />

          {/* Export */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white shadow-lg shadow-purple-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>
      )}

      {showExportModal && result && (
        <ExportReportModal
          analysis={result}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
