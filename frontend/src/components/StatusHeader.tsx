import React from 'react';
import { Shield, Cpu, Lock, Activity, BookOpen } from 'lucide-react';
import { SystemStatus } from '../types';
import { ThemeSelector, ThemeMode } from './ThemeSelector';

interface StatusHeaderProps {
  status: SystemStatus | null;
  demoMode: boolean;
  onToggleDemoMode: () => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenKnowledgeModal: () => void;
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({
  status, demoMode, onToggleDemoMode, currentTheme, onThemeChange, onOpenKnowledgeModal
}) => {
  const isSnapdragon = status?.hardware?.snapdragon_detected || false;
  const accelAvailable = status?.hardware?.ai_acceleration_available || false;

  return (
    <header className="bg-white/95 border-b border-slate-200 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      {/* Brand Title */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-400">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-extrabold text-xl tracking-tight text-slate-900">SNAPGUARD AI</h1>
            <span className="bg-blue-50 text-blue-700 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-200 font-bold">
              PRO
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Private On-Device AI Security Assistant</p>
        </div>
      </div>

      {/* Real-time Status & Theme Controls */}
      <div className="flex flex-wrap items-center space-x-2 sm:space-x-3">
        {/* Knowledge Base Button */}
        <button
          onClick={onOpenKnowledgeModal}
          className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-blue-700 transition-all shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden md:inline">Scam Guide</span>
        </button>

        {/* Theme Selector */}
        <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />

        {/* Local AI Status */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-700 shadow-sm font-medium">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>Local Engine Active</span>
        </div>

        {/* Privacy Status */}
        <div className="hidden md:flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-700 shadow-sm font-medium">
          <Lock className="w-3.5 h-3.5 text-blue-600" />
          <span>Zero Telemetry</span>
        </div>

        {/* Hardware / Snapdragon Status */}
        <div className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-sm ${
          isSnapdragon && accelAvailable
            ? 'bg-purple-50 border-purple-200 text-purple-700'
            : isSnapdragon
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <Cpu className={`w-3.5 h-3.5 ${isSnapdragon ? 'text-purple-600' : 'text-slate-500'}`} />
          <span>
            {isSnapdragon
              ? (accelAvailable ? 'Snapdragon QNN Active' : 'Snapdragon ARM64')
              : `${status?.hardware?.architecture || 'Local Hardware'}`}
          </span>
        </div>

        {/* Demo Mode Toggle */}
        <button
          onClick={onToggleDemoMode}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
            demoMode
              ? 'bg-amber-50 border border-amber-300 text-amber-800'
              : 'bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-600" />
          <span>{demoMode ? 'Demo ON' : 'Demo Mode'}</span>
        </button>
      </div>
    </header>
  );
};
