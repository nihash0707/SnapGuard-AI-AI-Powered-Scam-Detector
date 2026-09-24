import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RecommendationListProps {
  recommendations: string[];
}

export const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-emerald-50/90 border border-emerald-200 space-y-4 shadow-sm">
      <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        <span>Recommended Defense Countermeasures</span>
      </h3>

      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="flex items-start space-x-3 text-xs text-slate-800 bg-white p-3 rounded-2xl border border-emerald-200/80 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-semibold">{rec}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
