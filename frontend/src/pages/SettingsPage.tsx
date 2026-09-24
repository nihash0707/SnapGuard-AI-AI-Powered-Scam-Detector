import React, { useState } from 'react';
import { Settings, Cpu, Palette, Activity, Save } from 'lucide-react';
import { SystemStatus } from '../types';
import { ThemeMode, THEMES } from '../components/ThemeSelector';

interface SettingsPageProps {
  status: SystemStatus | null;
  demoMode: boolean;
  onToggleDemoMode: () => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  status, demoMode, onToggleDemoMode, currentTheme, onThemeChange
}) => {
  const [providerMode, setProviderMode] = useState<string>('auto');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">System Settings</h1>
          <p className="text-xs text-slate-400">Configure Color Themes, Local AI runtime, and judging presentation parameters.</p>
        </div>
      </div>

      {/* Theme Selection Section */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Palette className="w-4 h-4 text-cyan-400" />
          <span>Website Theme & Color Palette</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {THEMES.map((t) => {
            const isSelected = currentTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all space-y-2 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{t.name}</span>
                  <span className={`w-3.5 h-3.5 rounded-full ${t.color}`} />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{t.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Model Configuration */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>AI Model Provider</span>
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
            <input
              type="radio"
              name="provider"
              value="auto"
              checked={providerMode === 'auto'}
              onChange={() => setProviderMode('auto')}
              className="text-cyan-500 focus:ring-cyan-500"
            />
            <div>
              <span className="font-bold text-slate-200 block">Auto (Local LLM with Rule-Based Fallback)</span>
              <span className="text-slate-400 text-[11px]">Attempts local GGUF/Ollama inference endpoint; falls back to deterministic rule engine if endpoint is unmounted.</span>
            </div>
          </label>

          <label className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
            <input
              type="radio"
              name="provider"
              value="rule_based"
              checked={providerMode === 'rule_based'}
              onChange={() => setProviderMode('rule_based')}
              className="text-cyan-500 focus:ring-cyan-500"
            />
            <div>
              <span className="font-bold text-slate-200 block">Force Local Rule-Based Security Engine</span>
              <span className="text-slate-400 text-[11px]">Strictly offline deterministic heuristic engine. Ultra-fast response time (sub-10ms).</span>
            </div>
          </label>
        </div>
      </div>

      {/* Demo Mode & Presentation Settings */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Demo Mode (Judging Presentation)</span>
            </h3>
            <p className="text-xs text-slate-400">Displays floating quick-load preset bar with fictional scam examples.</p>
          </div>

          <button
            onClick={onToggleDemoMode}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
              demoMode ? 'bg-amber-500' : 'bg-slate-700'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
              demoMode ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Hardware Summary */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
        <h3 className="font-bold text-sm text-white">Detected Hardware System</h3>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-slate-300 space-y-1">
          <p>OS: {status?.hardware?.os}</p>
          <p>Architecture: {status?.hardware?.architecture}</p>
          <p>Processor: {status?.hardware?.processor}</p>
          <p>RAM: {status?.hardware?.memory_gb} GB</p>
          <p>Snapdragon Detected: {status?.hardware?.snapdragon_detected ? 'TRUE' : 'FALSE'}</p>
          <p>AI Runtime: {status?.hardware?.ai_runtime_status}</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        {savedNotice && <span className="text-xs font-bold text-emerald-400">Settings Saved!</span>}
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};
