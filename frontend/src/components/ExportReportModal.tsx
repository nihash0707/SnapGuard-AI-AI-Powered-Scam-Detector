import React, { useState } from 'react';
import { X, Download, FileText, Check } from 'lucide-react';
import { AnalysisResult } from '../types';
import { api } from '../services/api';

interface ExportReportModalProps {
  analysis: AnalysisResult;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ analysis, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      await api.downloadPdfReport(analysis.id);
    } catch (e) {
      alert('Failed to generate PDF report.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Export Security Report</h3>
            <p className="text-xs text-slate-500 font-mono">Scan ID: {analysis.id} • {analysis.timestamp}</p>
          </div>
        </div>

        {/* Report Preview */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 max-h-60 overflow-y-auto text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-mono">
            <span className="text-slate-500 font-bold">RISK ASSESSMENT</span>
            <span className={`font-black ${
              analysis.risk_level === 'CRITICAL' ? 'text-red-600' :
              analysis.risk_level === 'HIGH' ? 'text-orange-600' : 'text-emerald-600'
            }`}>
              {analysis.risk_level} ({analysis.risk_score}/100)
            </span>
          </div>

          <div>
            <span className="text-slate-500 block font-bold mb-1">SUMMARY</span>
            <p className="text-slate-800 leading-relaxed font-medium">{analysis.summary}</p>
          </div>

          {analysis.signals.length > 0 && (
            <div>
              <span className="text-slate-500 block font-bold mb-1">SIGNALS ({analysis.signals.length})</span>
              <ul className="list-disc list-inside text-slate-700 space-y-1 font-medium">
                {analysis.signals.map((s, idx) => (
                  <li key={idx}>[{s.severity.toUpperCase()}] {s.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            onClick={handleCopyJson}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'JSON Copied!' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
