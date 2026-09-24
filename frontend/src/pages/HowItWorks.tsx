import React from 'react';
import { Cpu, Zap, CheckCircle } from 'lucide-react';
import { SystemStatus } from '../types';
import { HardwareCard } from '../components/HardwareCard';

interface HowItWorksProps {
  status: SystemStatus | null;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ status }) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Snapdragon Optimization & Architecture</h1>
          <p className="text-xs text-slate-500 font-medium">On-device AI execution pipeline designed for Qualcomm Snapdragon® ARM64 platform.</p>
        </div>
      </div>

      <HardwareCard hardware={status?.hardware || null} />

      {/* Execution Architecture Flow */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <span>SnapGuard AI Provider Pipeline</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-extrabold text-blue-700 block font-mono">1. FRONTEND</span>
            <p className="text-slate-600 text-[11px] font-medium">React + Vite + TypeScript UI</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-extrabold text-cyan-700 block font-mono">2. FASTAPI</span>
            <p className="text-slate-600 text-[11px] font-medium">Local Security REST Server</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-extrabold text-purple-700 block font-mono">3. AI PROVIDER</span>
            <p className="text-slate-600 text-[11px] font-medium">LocalAIProvider Abstraction</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-extrabold text-emerald-700 block font-mono">4. MODEL RUNTIME</span>
            <p className="text-slate-600 text-[11px] font-medium">Ollama / ONNX / Rule Engine</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
            <span className="font-extrabold text-purple-800 block font-mono">5. HARDWARE</span>
            <p className="text-purple-900 text-[11px] font-medium">Snapdragon NPU / CPU Engine</p>
          </div>
        </div>
      </div>

      {/* Snapdragon Technical Considerations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Qualcomm QNN Integration Points</span>
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            The <code>LocalAIProvider</code> interface cleanly isolates inference from application code. On Snapdragon PCs with the Qualcomm Neural Processing SDK, ONNX Runtime with <code>QNNExecutionProvider</code> accelerates transformer layers directly on Hexagon NPU hardware.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Portable ARM64 Dependencies</span>
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            SnapGuard AI avoids x86-only native binaries. All Python packages, SQLite engines, and JavaScript dependencies compile natively on Windows ARM64 and cross-platform CPU development machines.
          </p>
        </div>
      </div>
    </div>
  );
};
