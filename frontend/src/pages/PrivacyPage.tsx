import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import { PrivacyStatus } from '../types';
import { api } from '../services/api';

export const PrivacyPage: React.FC = () => {
  const [privacy, setPrivacy] = useState<PrivacyStatus | null>(null);
  const [storeContent, setStoreContent] = useState<boolean>(false);

  useEffect(() => {
    loadPrivacy();
  }, []);

  const loadPrivacy = async () => {
    try {
      const p = await api.getPrivacyStatus();
      setPrivacy(p);
      setStoreContent(p.store_content_enabled);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStorage = async () => {
    const nextVal = !storeContent;
    setStoreContent(nextVal);
    await api.toggleStorageSetting(nextVal);
    await loadPrivacy();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Privacy Center & Data Architecture</h1>
          <p className="text-xs text-slate-500 font-medium">On-device privacy guarantees and data retention controls.</p>
        </div>
      </div>

      {/* Main Privacy Guarantee Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-white to-slate-50 border border-emerald-200 space-y-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Lock className="w-6 h-6 text-emerald-600" />
          <h2 className="text-lg font-black text-slate-900">Privacy First Security Engine</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
          SnapGuard AI is designed to minimize data leaving your device.
          Actual local/cloud behavior depends on the configured AI provider. Core heuristic rule matching, URL domain parsing, and local model inference run strictly in-memory on your Windows machine.
        </p>
      </div>

      {/* Privacy Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">LOCAL INFERENCE ENGINE</span>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {privacy?.local_processing || 'ACTIVE'}
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium">All heuristic checks and LLM/ONNX model operations execute locally.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">EXTERNAL CLOUD APIs</span>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {privacy?.cloud_ai || 'DISABLED BY DEFAULT'}
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium">No message payloads or sensitive communications are uploaded to third-party cloud servers.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">DATA STORAGE LOCATION</span>
            <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200">
              {privacy?.data_storage || 'LOCAL SQLITE'}
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium">Scan metadata is stored in local file-system SQLite database at <code>backend/data/snapguard.db</code>.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">ANALYTICS & TELEMETRY</span>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {privacy?.telemetry || 'ZERO TELEMETRY'}
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium">Zero usage analytics, user tracking, or advertising scripts are embedded.</p>
        </div>
      </div>

      {/* Data Retention Setting */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm text-slate-900">Store Analyzed Message Content in History</h3>
            <p className="text-xs text-slate-500 font-medium">
              When OFF (default), SnapGuard AI stores only risk scores, signal counts, and anonymous timestamps.
            </p>
          </div>

          <button
            onClick={handleToggleStorage}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
              storeContent ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
              storeContent ? 'translate-x-6' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center space-x-2 font-medium">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Current Mode: {storeContent ? 'Storing message snippets in local SQLite db' : 'Maximum Privacy (Raw text discarded immediately after scan)'}</span>
        </div>
      </div>
    </div>
  );
};
