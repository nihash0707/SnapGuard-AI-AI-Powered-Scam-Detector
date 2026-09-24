import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { RiskSignal } from '../types';

interface SignalCardProps {
  signals: RiskSignal[];
}

export const SignalCard: React.FC<SignalCardProps> = ({ signals }) => {
  if (!signals || signals.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center space-y-2 shadow-sm">
        <Info className="w-8 h-8 text-emerald-600 mx-auto" />
        <h4 className="font-extrabold text-slate-900 text-base">No Warning Signals Triggered</h4>
        <p className="text-xs text-slate-500 font-medium">Message content did not match known high-risk scam or phishing indicators.</p>
      </div>
    );
  }

  const getSeverityStyle = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return 'bg-red-50/90 border-red-200 text-red-900';
      case 'high':
        return 'bg-orange-50/90 border-orange-200 text-orange-900';
      case 'medium':
        return 'bg-amber-50/90 border-amber-200 text-amber-900';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-blue-600" />
          <span>Detected Threat Indicators ({signals.length})</span>
        </h3>
      </div>

      <div className="space-y-3">
        {signals.map((sig, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border ${getSeverityStyle(sig.severity)} shadow-sm space-y-2 transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>{sig.name}</span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-300 bg-white text-slate-800 shadow-xs">
                {sig.severity} SEVERITY
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">{sig.description}</p>

            {sig.evidence && (
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono text-blue-900 overflow-x-auto shadow-xs">
                <span className="text-[10px] text-slate-500 block font-sans font-bold uppercase">Matched Evidence:</span>
                "{sig.evidence}"
              </div>
            )}

            {sig.explanation && (
              <p className="text-xs text-slate-600 italic font-sans border-l-2 border-blue-400 pl-3 pt-0.5">
                {sig.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
