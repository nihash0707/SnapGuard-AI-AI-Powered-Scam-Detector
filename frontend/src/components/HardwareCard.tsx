import React from 'react';
import { Cpu, Zap, Shield } from 'lucide-react';
import { HardwareStatus } from '../types';

interface HardwareCardProps {
  hardware: HardwareStatus | null;
}

export const HardwareCard: React.FC<HardwareCardProps> = ({ hardware }) => {
  if (!hardware) return null;

  const isSnapdragon = hardware.snapdragon_detected;
  const accelActive = hardware.ai_acceleration_available;

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">AI Hardware Runtime</h3>
            <p className="text-[11px] text-slate-500 font-medium">On-Device Hardware Execution</p>
          </div>
        </div>

        {isSnapdragon ? (
          <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700">
            Snapdragon Platform
          </span>
        ) : (
          <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
            Local ARM64 / x64
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono font-bold block">OS & ARCHITECTURE</span>
          <span className="font-bold text-slate-800 block truncate">{hardware.os} ({hardware.architecture})</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-400 font-mono font-bold block">SYSTEM RAM</span>
          <span className="font-bold text-slate-800 block">{hardware.memory_gb} GB Memory</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 col-span-2">
          <span className="text-[10px] text-slate-400 font-mono font-bold block">PROCESSOR</span>
          <span className="font-bold text-slate-800 block truncate">{hardware.processor}</span>
        </div>
      </div>

      {/* Acceleration Status Pill */}
      <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
        accelActive
          ? 'bg-purple-50 border-purple-200 text-purple-800'
          : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center space-x-2">
          {accelActive ? <Zap className="w-4 h-4 text-purple-600" /> : <Shield className="w-4 h-4 text-blue-600" />}
          <span>{hardware.ai_runtime_status}</span>
        </div>

        <span className="text-[10px] font-mono font-bold text-slate-500">
          {hardware.ai_acceleration_backend || 'Local Engine'}
        </span>
      </div>
    </div>
  );
};
