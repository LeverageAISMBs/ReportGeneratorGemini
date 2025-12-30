import React, { useState, createContext, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import InputZone from './components/InputZone';
import Dashboard from './components/Dashboard';
import { generateWeeklyInsight } from './services/geminiService';
import { saveReportToDB, getAllReportsFromDB, deleteReportFromDB } from './utils/db';
import { AppState, WeeklyReportData, ThemeContextType } from './types';
import { Loader2, AlertCircle, RefreshCcw } from 'lucide-react';

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

const App: React.FC = () => {
  // Theme State
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(prev => !prev);

  // App Logic State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [report, setReport] = useState<WeeklyReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<WeeklyReportData[]>([]);

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedReports = await getAllReportsFromDB();
        setHistory(savedReports);
      } catch (e) {
        console.error("Failed to load history", e);
      }
    };
    loadHistory();
  }, []);

  const handleAnalysis = useCallback(async (content: string) => {
    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const result = await generateWeeklyInsight(content);
      const newReport: WeeklyReportData = {
        id: crypto.randomUUID(),
        rawContent: content,
        structured: result,
        timestamp: Date.now()
      };
      
      // Save to State
      setReport(newReport);
      setAppState(AppState.COMPLETE);

      // Save to DB and update History
      await saveReportToDB(newReport);
      setHistory(prev => [newReport, ...prev]);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while contacting Gemini.");
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setReport(null);
    setError(null);
  }, []);

  const handleSelectReport = useCallback((selectedReport: WeeklyReportData) => {
    setReport(selectedReport);
    setAppState(AppState.COMPLETE);
    setError(null);
  }, []);

  const handleDeleteReport = useCallback(async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReportFromDB(id);
        setHistory(prev => prev.filter(item => item.id !== id));
        if (report?.id === id) {
          handleReset();
        }
      } catch (e) {
        console.error("Failed to delete report", e);
      }
    }
  }, [report, handleReset]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <Layout 
        onReset={handleReset} 
        history={history} 
        onSelectReport={handleSelectReport}
        onDeleteReport={handleDeleteReport}
        currentReportId={report?.id}
      >
        
        {appState === AppState.IDLE && (
          <InputZone onAnalyze={handleAnalysis} isLoading={false} />
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full"></div>
              <Loader2 size={48} className="animate-spin text-notion-text-light dark:text-notion-text-dark relative z-10" />
            </div>
            <h2 className="text-xl font-medium text-notion-text-light dark:text-notion-text-dark mb-2">Analyzing Conversations</h2>
            <p className="text-notion-muted-light dark:text-notion-muted-dark text-sm">Extracting patterns and insights...</p>
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-notion-text-light dark:text-notion-text-dark mb-2">Analysis Failed</h2>
            <p className="text-notion-muted-light dark:text-notion-muted-dark mb-6">{error}</p>
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-notion-hover-light dark:bg-notion-hover-dark rounded-md font-medium text-notion-text-light dark:text-notion-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCcw size={16} />
              Try Again
            </button>
          </div>
        )}

        {appState === AppState.COMPLETE && report && (
          <Dashboard data={report} onReset={handleReset} />
        )}
      </Layout>
    </ThemeContext.Provider>
  );
};

export default App;