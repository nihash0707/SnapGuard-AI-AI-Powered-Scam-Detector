import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { DemoExample } from '../types';

interface DemoPresetBarProps {
  examples: DemoExample[];
  onSelectExample: (ex: DemoExample) => void;
}

export const DemoPresetBar: React.FC<DemoPresetBarProps> = ({ examples, onSelectExample }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="uppercase tracking-wider">Demo Preset Examples (Live Quick-Test)</span>
        </div>
        <span className="text-[10px] text-amber-700 font-mono font-bold">Click to quick-load into analyzer</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.id}
            onClick={() => onSelectExample(ex)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/50 border border-amber-200 text-xs text-slate-800 transition-all font-semibold shadow-sm group"
          >
            <span>{ex.title}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
              ex.expected_risk === 'CRITICAL' ? 'bg-red-100 text-red-700 border border-red-200' :
              ex.expected_risk === 'HIGH' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}>
              {ex.expected_risk}
            </span>
            <ArrowRight className="w-3 h-3 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};
