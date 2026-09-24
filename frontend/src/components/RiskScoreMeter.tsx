import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface RiskScoreMeterProps {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence?: number;
}

export const RiskScoreMeter: React.FC<RiskScoreMeterProps> = ({ score, level, confidence = 92 }) => {
  const getConfig = () => {
    switch (level) {
      case 'CRITICAL':
        return {
          bgColor: 'bg-red-50/90',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          ringColor: '#DC2626',
          badgeBg: 'bg-red-100 text-red-800 border-red-300',
          icon: AlertOctagon,
          title: 'CRITICAL PHISHING RISK DETECTED',
          desc: 'Urgent action required! High-severity credential harvesting or brand spoofing indicators confirmed.'
        };
      case 'HIGH':
        return {
          bgColor: 'bg-orange-50/90',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-700',
          ringColor: '#EA580C',
          badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: ShieldAlert,
          title: 'HIGH SCAM LIKELIHOOD',
          desc: 'Multiple malicious patterns identified. High probability of fraudulent solicitation or unsafe link.'
        };
      case 'MEDIUM':
        return {
          bgColor: 'bg-amber-50/90',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-700',
          ringColor: '#D97706',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          title: 'SUSPICIOUS SECURITY INDICATORS',
          desc: 'Message or link contains potential risk factors. Verify sender authenticity before interacting.'
        };
      default:
        return {
          bgColor: 'bg-emerald-50/90',
          borderColor: 'border-emerald-200',
          textColor: 'text-emerald-700',
          ringColor: '#059669',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: ShieldCheck,
          title: 'LOW RISK LEVEL / VERIFIED SAFE',
          desc: 'No major threat signals or spoofed domains identified. Maintain standard cyber hygiene.'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl border ${config.bgColor} ${config.borderColor} shadow-sm transition-all duration-300 relative overflow-hidden`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* SVG Radial Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#E2E8F0"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={config.ringColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black tracking-tight text-slate-900">{score}</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">/ 100 SCORE</span>
          </div>
        </div>

        {/* Details & Confidence */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className={`inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full border text-xs font-black uppercase tracking-wider ${config.badgeBg}`}>
              <Icon className="w-4 h-4" />
              <span>{level} RISK LEVEL</span>
            </span>

            <span className="inline-flex items-center space-x-1 text-xs text-slate-800 font-mono bg-white px-3 py-1 rounded-full border border-slate-300 shadow-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Confidence: {confidence}%</span>
            </span>
          </div>

          <h3 className={`text-2xl font-black tracking-tight ${config.textColor}`}>{config.title}</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl font-medium">{config.desc}</p>
        </div>

      </div>
    </div>
  );
};
