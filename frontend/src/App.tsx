import React, { useState, useEffect } from 'react';
import { SystemStatus, HistoryItem, DemoExample } from './types';
import { api } from './services/api';
import { StatusHeader } from './components/StatusHeader';
import { Sidebar } from './components/Sidebar';
import { DemoPresetBar } from './components/DemoPresetBar';
import { ThemeMode } from './components/ThemeSelector';
import { ScamKnowledgeModal } from './components/ScamKnowledgeModal';

import { Dashboard } from './pages/Dashboard';
import { MessageAnalyzer } from './pages/MessageAnalyzer';
import { ImageAnalyzer } from './pages/ImageAnalyzer';
import { UrlAnalyzer } from './pages/UrlAnalyzer';
import { HistoryPage } from './pages/HistoryPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { HowItWorks } from './pages/HowItWorks';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [demoExamples, setDemoExamples] = useState<DemoExample[]>([]);
  const [presetText, setPresetText] = useState<string>('');
  const [showKnowledgeModal, setShowKnowledgeModal] = useState<boolean>(false);

  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('snapguard_theme') as ThemeMode) || 'theme-cyber-light';
  });

  useEffect(() => {
    document.documentElement.className = currentTheme;
    localStorage.setItem('snapguard_theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const s = await api.getSystemStatus();
      setStatus(s);

      const h = await api.getHistory();
      setHistory(h);

      const ex = await api.getDemoExamples();
      setDemoExamples(ex);
    } catch (e) {
      console.error("API Connection error:", e);
    }
  };

  const handleRefreshHistory = async () => {
    try {
      const h = await api.getHistory();
      setHistory(h);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectDemoExample = (ex: DemoExample) => {
    if (ex.type === 'message') {
      setPresetText(ex.content);
      setCurrentPage('analyze-message');
    } else if (ex.type === 'url') {
      setCurrentPage('analyze-url');
    } else {
      setCurrentPage('analyze-image');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${currentTheme}`}>
      <StatusHeader
        status={status}
        demoMode={demoMode}
        onToggleDemoMode={() => setDemoMode(!demoMode)}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        onOpenKnowledgeModal={() => setShowKnowledgeModal(true)}
      />

      <div className="flex-1 flex">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {demoMode && demoExamples.length > 0 && (
            <div className="mb-6">
              <DemoPresetBar
                examples={demoExamples}
                onSelectExample={handleSelectDemoExample}
              />
            </div>
          )}

          {currentPage === 'dashboard' && (
            <Dashboard
              status={status}
              history={history}
              onNavigate={setCurrentPage}
              onSelectHistoryItem={(id) => {
                setCurrentPage('history');
              }}
              onOpenKnowledgeModal={() => setShowKnowledgeModal(true)}
            />
          )}

          {currentPage === 'analyze-message' && (
            <MessageAnalyzer
              demoMode={demoMode}
              demoExamples={demoExamples}
              presetContent={presetText}
            />
          )}

          {currentPage === 'analyze-image' && (
            <ImageAnalyzer />
          )}

          {currentPage === 'analyze-url' && (
            <UrlAnalyzer />
          )}

          {currentPage === 'history' && (
            <HistoryPage
              history={history}
              onRefresh={handleRefreshHistory}
              onSelectHistoryItem={(id) => {}}
            />
          )}

          {currentPage === 'privacy' && (
            <PrivacyPage />
          )}

          {currentPage === 'how-it-works' && (
            <HowItWorks status={status} />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              status={status}
              demoMode={demoMode}
              onToggleDemoMode={() => setDemoMode(!demoMode)}
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
            />
          )}
        </main>
      </div>

      {showKnowledgeModal && (
        <ScamKnowledgeModal onClose={() => setShowKnowledgeModal(false)} />
      )}
    </div>
  );
};

export default App;
