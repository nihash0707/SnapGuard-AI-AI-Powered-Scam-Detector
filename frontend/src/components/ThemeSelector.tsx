import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

export type ThemeMode =
  | 'theme-cyber-neon'
  | 'theme-emerald-shield'
  | 'theme-obsidian-gold'
  | 'theme-quantum-violet'
  | 'theme-cyber-light';

export const THEMES: { id: ThemeMode; name: string; color: string; badge: string }[] = [
  { id: 'theme-cyber-neon', name: 'Cyber Neon', color: 'bg-cyan-400', badge: 'Dark Cyan' },
  { id: 'theme-emerald-shield', name: 'Emerald Shield', color: 'bg-emerald-400', badge: 'Security Mint' },
  { id: 'theme-obsidian-gold', name: 'Obsidian Gold', color: 'bg-amber-400', badge: 'Gold Velvet' },
  { id: 'theme-quantum-violet', name: 'Quantum Violet', color: 'bg-purple-400', badge: 'Cyberpunk' },
  { id: 'theme-cyber-light', name: 'Cyber Light', color: 'bg-blue-600', badge: 'High Contrast' },
];

interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
        title="Change Website Theme Colors"
      >
        <Palette className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">{activeObj.name}</span>
        <span className={`w-2.5 h-2.5 rounded-full ${activeObj.color}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono text-slate-400 uppercase border-b border-slate-800 font-bold tracking-wider">
              Select Color Theme
            </div>

            {THEMES.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    onThemeChange(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-white font-bold border border-slate-600'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-3 h-3 rounded-full ${t.color} shrink-0`} />
                    <span>{t.name}</span>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
