import React from 'react';
import {
  MessageSquareText, Image, Link, Lock, ArrowRight,
  ChevronRight, Zap, BookOpen, Sparkles
} from 'lucide-react';
import { SystemStatus, HistoryItem } from '../types';
import { HardwareCard } from '../components/HardwareCard';
import { PrivacyBadge } from '../components/PrivacyBadge';

interface DashboardProps {
  status: SystemStatus | null;
  history: HistoryItem[];
  onNavigate: (page: string) => void;
  onSelectHistoryItem: (id: string) => void;
  onOpenKnowledgeModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  status, history, onNavigate, onSelectHistoryItem, onOpenKnowledgeModal
}) => {
  const totalScans = history.length;
  const highRiskScans = history.filter(h => h.risk_level === 'HIGH' || h.risk_level === 'CRITICAL').length;
  const medRiskScans = history.filter(h => h.risk_level === 'MEDIUM').length;
  const lowRiskScans = history.filter(h => h.risk_level === 'LOW').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-blue-50/80 via-white to-cyan-50/80 border border-slate-200 shadow-sm">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>On-Device Qualcomm Snapdragon® Security</span>
            </div>

            <button
              onClick={onOpenKnowledgeModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-purple-100/80 border border-purple-200 text-purple-800 text-xs font-bold hover:bg-purple-200/80 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              <span>Learn How Scams Work</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Stay One Step Ahead of <span className="cyan-gradient-text">Digital Scams</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
            SnapGuard AI analyzes suspicious SMS, WhatsApp messages, payment screenshots, and URLs with 100% privacy-first local AI.
            Calculates threat risk scores, exposes phishing traps, and safeguards your financial credentials offline.
          </p>
        </div>

        {/* 3 Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <button
            onClick={() => onNavigate('analyze-message')}
            className="p-6 rounded-3xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 text-left transition-all duration-200 group space-y-3 shadow-sm hover:shadow-md"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors">Analyze Message</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Paste SMS, WhatsApp, Email, Job offer or lottery text</p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 space-x-1 pt-1">
              <span>Start Analysis</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('analyze-image')}
            className="p-6 rounded-3xl bg-white hover:bg-cyan-50/50 border border-slate-200 hover:border-cyan-300 text-left transition-all duration-200 group space-y-3 shadow-sm hover:shadow-md"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-cyan-700 transition-colors">Analyze Screenshot</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Upload screenshots for local OCR text & link extraction</p>
            </div>
            <div className="flex items-center text-xs font-bold text-cyan-600 space-x-1 pt-1">
              <span>Upload Screenshot</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('analyze-url')}
            className="p-6 rounded-3xl bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-300 text-left transition-all duration-200 group space-y-3 shadow-sm hover:shadow-md"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Link className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-purple-700 transition-colors">Check URL</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Expose domain typosquatting, shorteners & IP hosts</p>
            </div>
            <div className="flex items-center text-xs font-bold text-purple-600 space-x-1 pt-1">
              <span>Inspect Link</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Quick Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">TOTAL SCANS</span>
          <div className="text-2xl font-black text-slate-900">{totalScans}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-red-600 uppercase font-bold">HIGH / CRITICAL RISK</span>
          <div className="text-2xl font-black text-red-600">{highRiskScans}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-amber-600 uppercase font-bold">MEDIUM RISK</span>
          <div className="text-2xl font-black text-amber-600">{medRiskScans}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-emerald-600 uppercase font-bold">LOW RISK / SAFE</span>
          <div className="text-2xl font-black text-emerald-600">{lowRiskScans}</div>
        </div>
      </div>

      {/* Educational Banner Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-slate-900">How Does SnapGuard AI Predict Scams?</h3>
            <p className="text-xs text-slate-600 font-medium">
              Combines NLP urgency detection, brand typosquatting algorithms, URL shortener expansion, and on-device AI reasoning.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenKnowledgeModal}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white text-xs shadow-md shadow-purple-500/20 transition-all shrink-0"
        >
          Open Scam Knowledge Base
        </button>
      </div>

      {/* Middle Grid: Hardware & Privacy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HardwareCard hardware={status?.hardware || null} />

        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <Lock className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">🔒 Privacy First Guarantee</h3>
                <p className="text-xs text-slate-500 font-medium">Zero Cloud Dependency Architecture</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              SnapGuard AI is designed to minimize data leaving your device.
              All heuristic pattern parsing and AI model inference are performed on local hardware memory without secret cloud uploads.
            </p>
          </div>

          <PrivacyBadge />
        </div>
      </div>

      {/* Recent Scans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Security Scans</h2>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View Full History</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 space-y-2 shadow-sm font-medium">
            <p className="text-sm">No recent scans recorded yet. Try analyzing a suspicious message above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item.id)}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 cursor-pointer transition-all space-y-2 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500 uppercase font-bold">{item.scan_type}</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                    item.risk_level === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                    item.risk_level === 'HIGH' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                    item.risk_level === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {item.risk_level} ({item.risk_score}/100)
                  </span>
                </div>

                <p className="text-xs text-slate-800 line-clamp-2 leading-snug font-medium">{item.summary}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
                  <span>{item.timestamp}</span>
                  <span className="text-blue-600 font-sans font-bold group-hover:translate-x-0.5 transition-transform">View Report &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
