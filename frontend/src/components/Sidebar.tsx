import React from 'react';
import {
  LayoutDashboard, MessageSquareText, Image, Link,
  History, ShieldCheck, Cpu, Settings
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze-message', label: 'Analyze Message', icon: MessageSquareText },
    { id: 'analyze-image', label: 'Analyze Screenshot', icon: Image },
    { id: 'analyze-url', label: 'Check URL', icon: Link },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'privacy', label: 'Privacy Center', icon: ShieldCheck },
    { id: 'how-it-works', label: 'Hardware & AI', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-65px)] shadow-sm">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
          Security Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Info Pill */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
        <div className="flex items-center justify-between text-slate-800 font-bold">
          <span>Snapdragon AI Lab</span>
          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold">v1.0</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight">
          Qualcomm Snapdragon® AI Build Challenge
        </p>
      </div>
    </aside>
  );
};
