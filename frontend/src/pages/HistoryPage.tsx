import React, { useState } from 'react';
import { History, Trash2, Search, Filter, Eye, ShieldAlert } from 'lucide-react';
import { HistoryItem, AnalysisResult } from '../types';
import { api } from '../services/api';
import { ExportReportModal } from '../components/ExportReportModal';

interface HistoryPageProps {
  history: HistoryItem[];
  onRefresh: () => void;
  onSelectHistoryItem: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ history, onRefresh }) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this scan record from local history?')) {
      await api.deleteHistoryItem(id);
      onRefresh();
    }
  };

  const handleClearAll = async () => {
    if (confirm('Clear ALL scan history from local SQLite database?')) {
      await api.clearHistory();
      onRefresh();
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesLevel = filterLevel === 'ALL' || (
      filterLevel === 'HIGH' ? (item.risk_level === 'HIGH' || item.risk_level === 'CRITICAL') :
      item.risk_level === filterLevel
    );
    const matchesSearch = !searchQuery || (
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scan_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesLevel && matchesSearch;
  });

  const handleViewDetail = async (id: string) => {
    try {
      const detail = await api.getHistoryDetail(id);
      setSelectedAnalysis(detail);
    } catch (e) {
      alert('Failed to load scan report detail.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Scan History & Audit Logs</h1>
            <p className="text-xs text-slate-500 font-medium">Locally persisted scan metadata and threat analysis summaries.</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-700 transition-all shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history by keyword or scan ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-bold">Risk Filter:</span>
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterLevel === lvl
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2 text-slate-500 shadow-sm">
          <ShieldAlert className="w-10 h-10 mx-auto text-slate-400" />
          <p className="text-sm font-bold text-slate-900">No Scan History Matches Your Filter</p>
          <p className="text-xs text-slate-500 font-medium">Scan records will appear here as you analyze messages and URLs.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => handleViewDetail(item.id)}
              className="p-5 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 cursor-pointer transition-all flex flex-wrap items-center justify-between gap-4 group shadow-sm"
            >
              <div className="flex items-center space-x-4 min-w-[240px] flex-1">
                <span className={`w-3 h-3 rounded-full shrink-0 ${
                  item.risk_level === 'CRITICAL' || item.risk_level === 'HIGH' ? 'bg-red-500' :
                  item.risk_level === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-900 uppercase">{item.scan_type}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">• {item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-1 font-medium">{item.summary}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                  item.risk_level === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' :
                  item.risk_level === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  item.risk_level === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {item.risk_level} ({item.risk_score}/100)
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleViewDetail(item.id); }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => handleDeleteItem(e, item.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAnalysis && (
        <ExportReportModal
          analysis={selectedAnalysis}
          onClose={() => setSelectedAnalysis(null)}
        />
      )}
    </div>
  );
};
