import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export const PrivacyBadge: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between gap-3">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-200">On-Device Local Processing</h4>
          <p className="text-[11px] text-slate-400">All message text, images, and URL features stay on your device.</p>
        </div>
      </div>
      <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 shrink-0">
        ZERO TELEMETRY
      </span>
    </div>
  );
};
