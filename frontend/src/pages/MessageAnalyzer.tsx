import React, { useState, useEffect } from 'react';
import { MessageSquareText, ShieldAlert, RotateCcw, Send, Copy, FileText, Check } from 'lucide-react';
import { AnalysisResult, DemoExample } from '../types';
import { api } from '../services/api';
import { RiskScoreMeter } from '../components/RiskScoreMeter';
import { SignalCard } from '../components/SignalCard';
import { RecommendationList } from '../components/RecommendationList';
import { ExportReportModal } from '../components/ExportReportModal';

interface MessageAnalyzerProps {
  demoMode: boolean;
  demoExamples: DemoExample[];
  presetContent?: string;
}

export const MessageAnalyzer: React.FC<MessageAnalyzerProps> = ({
  demoMode, demoExamples, presetContent
}) => {
  const [content, setContent] = useState(presetContent || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    if (presetContent) {
      setContent(presetContent);
    }
  }, [presetContent]);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await api.analyzeMessage(content);
      setResult(res);
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Message analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setResult(null);
  };

  const handleLoadSample = (sampleText: string) => {
    setContent(sampleText);
    setResult(null);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const textReport = `SNAPGUARD AI SECURITY REPORT
Risk Level: ${result.risk_level} (${result.risk_score}/100)
Summary: ${result.summary}
Signals: ${result.signals.map(s => s.name).join(', ')}
Recommendations: ${result.recommendations.join('; ')}`;
    navigator.clipboard.writeText(textReport);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* Title */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <MessageSquareText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Analyze Suspicious Message</h1>
          <p className="text-xs text-slate-500 font-medium">Paste SMS, WhatsApp, Email, Job offers, or payment demands for local AI analysis.</p>
        </div>
      </div>

      {/* Preset Sample Buttons */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2.5 shadow-sm">
        <span className="text-xs font-extrabold text-slate-700 block uppercase font-mono">Quick Test Samples:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleLoadSample("Congratulations! You have won ₹50,000. Click this link immediately to claim your prize: http://bit.ly/claim-prize-50k")}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-xs font-semibold text-amber-800 border border-amber-200 transition-all shadow-xs"
          >
            Sample Scam
          </button>
          <button
            onClick={() => handleLoadSample("URGENT: Your bank account will be suspended today. Verify your KYC and OTP immediately at http://sbi-kyc-verify-update.xyz/login")}
            className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-800 border border-red-200 transition-all shadow-xs"
          >
            Sample Phishing
          </button>
          <button
            onClick={() => handleLoadSample("Part-time job offer! Earn ₹5,000 to ₹10,000 daily by reviewing Google maps locations. Contact recruiter on Telegram.")}
            className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-blue-800 border border-blue-200 transition-all shadow-xs"
          >
            Sample Job Scam
          </button>
          <button
            onClick={() => handleLoadSample("Hi Alex, please find the project slides attached for our 3:00 PM team sync today. Let me know if you need to reschedule.")}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 border border-emerald-200 transition-all shadow-xs"
          >
            Sample Safe Message
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste suspicious SMS, email text, WhatsApp message, lottery notification, job offer, or payment demand here..."
          className="w-full p-4 rounded-3xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-y font-sans shadow-sm font-medium"
        ></textarea>

        <div className="flex items-center justify-between">
          <button
            onClick={handleClear}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={loading || !content.trim()}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Analyzing On-Device...' : 'Analyze Message'}</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm animate-pulse">
          <div className="w-10 h-10 rounded-full bg-blue-50 mx-auto flex items-center justify-center text-blue-600 animate-spin">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-900">Evaluating Message Threat Signals...</p>
          <p className="text-xs text-slate-500 font-medium">Processing pattern matching & on-device AI reasoning</p>
        </div>
      )}

      {/* Results Screen */}
      {result && !loading && (
        <div className="space-y-6 pt-4 border-t border-slate-200 animate-fadeIn">
          {/* Risk Meter */}
          <RiskScoreMeter
            score={result.risk_score}
            level={result.risk_level}
            confidence={result.confidence}
          />

          {/* AI Explanation Banner */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>AI Threat Explanation</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">{result.summary}</p>
            {result.explanations.length > 0 && (
              <ul className="space-y-2 text-xs text-slate-700 border-l-2 border-blue-400 pl-3 pt-1">
                {result.explanations.map((exp, idx) => (
                  <li key={idx} className="font-medium">{exp}</li>
                ))}
              </ul>
            )}
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono font-bold">
              <span>Provider: {result.ai_provider_used}</span>
              <span>Runtime: {result.hardware_acceleration}</span>
            </div>
          </div>

          {/* Signals */}
          <SignalCard signals={result.signals} />

          {/* Actionable Recommendations */}
          <RecommendationList recommendations={result.recommendations} />

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setResult(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
            >
              Analyze Another Message
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyReport}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 border border-slate-200 shadow-sm"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedReport ? 'Report Copied!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/20"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF Report</span>
              </button>
            </div>
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
