import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Copy, FileText, Check, Scan, Eye } from 'lucide-react';
import { AnalysisResult } from '../types';
import { api } from '../services/api';
import { RiskScoreMeter } from '../components/RiskScoreMeter';
import { SignalCard } from '../components/SignalCard';
import { RecommendationList } from '../components/RecommendationList';
import { ExportReportModal } from '../components/ExportReportModal';

export const ImageAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Please upload a valid PNG, JPG, JPEG, or WEBP image.');
      return;
    }
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await api.analyzeImage(file);
      setResult(res);
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Image screenshot analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyExtractedText = () => {
    if (!result?.extracted_text) return;
    navigator.clipboard.writeText(result.extracted_text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
          <ImageIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Analyze Screenshot / Image</h1>
          <p className="text-xs text-slate-500 font-medium">Upload suspicious SMS screenshots, chat images, or fake alerts for local OCR & risk analysis.</p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="p-8 rounded-3xl border-2 border-dashed border-slate-300 hover:border-cyan-500 bg-white hover:bg-slate-50 text-center cursor-pointer transition-all space-y-3 group shadow-sm"
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mx-auto group-hover:scale-110 transition-transform">
          <Upload className="w-6 h-6" />
        </div>

        <div>
          <p className="text-sm font-extrabold text-slate-900">
            {file ? file.name : 'Drag & Drop screenshot image here, or Browse'}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Supports PNG, JPG, JPEG, WEBP up to 10MB</p>
        </div>
      </div>

      {/* Image Preview & Analyze Action */}
      {previewUrl && (
        <div className="p-4 rounded-3xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <img src={previewUrl} alt="Screenshot preview" className="w-20 h-20 object-cover rounded-2xl border border-slate-200" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-900 block truncate max-w-xs">{file?.name}</span>
              <span className="text-[11px] font-mono text-slate-500 block">
                {((file?.size || 0) / 1024).toFixed(1)} KB
              </span>
              <span className="inline-flex items-center space-x-1 text-[10px] text-cyan-700 font-mono font-bold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                <Scan className="w-3 h-3 text-cyan-600" />
                <span>Ready for Local OCR</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            <span>{loading ? 'Running Local OCR & AI...' : 'Analyze Screenshot'}</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-sm animate-pulse">
          <div className="w-10 h-10 rounded-full bg-cyan-50 mx-auto flex items-center justify-center text-cyan-600 animate-spin">
            <Scan className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-slate-900">Extracting Text via Local OCR Engine...</p>
          <p className="text-xs text-slate-500 font-medium">Parsing text, detecting embedded URLs, and computing security score</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6 pt-4 border-t border-slate-200 animate-fadeIn">
          {/* Multimodal Runtime Badge */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-slate-800">Extraction Runtime:</span>
              <span className="text-cyan-700 font-mono font-bold">{result.ocr_used ? 'Local OCR Engine' : 'Direct Text Extraction'}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono font-bold">Multimodal Architecture</span>
          </div>

          {/* Extracted Text Box */}
          {result.extracted_text && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900">Extracted Text Content</span>
                <button
                  onClick={handleCopyExtractedText}
                  className="flex items-center space-x-1 text-[11px] text-cyan-700 font-bold"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedText ? 'Text Copied!' : 'Copy Extracted Text'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-slate-800 whitespace-pre-wrap bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed max-h-40 overflow-y-auto">
                {result.extracted_text}
              </p>
            </div>
          )}

          {/* Risk Meter */}
          <RiskScoreMeter
            score={result.risk_score}
            level={result.risk_level}
            confidence={result.confidence}
          />

          {/* AI Threat Explanation */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <h3 className="text-sm font-black text-slate-900">AI Risk Assessment</h3>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">{result.summary}</p>
          </div>

          {/* Signals */}
          <SignalCard signals={result.signals} />

          {/* Recommendations */}
          <RecommendationList recommendations={result.recommendations} />

          {/* Export button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 text-xs font-bold text-white shadow-lg shadow-cyan-500/20"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF Report</span>
            </button>
          </div>
        </div>
      )}

      {showExportModal && result && (
        <ExportReportModal
          analysis={result}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};
