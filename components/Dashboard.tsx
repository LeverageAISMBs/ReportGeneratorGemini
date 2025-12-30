import React, { useState } from 'react';
import { WeeklyReportStructured, WeeklyReportData } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { 
  Download, 
  Eye, 
  Check, 
  ChevronDown, 
  LayoutDashboard, 
  FileJson, 
  FileText, 
  FileType 
} from 'lucide-react';

interface DashboardProps {
  data: WeeklyReportData;
  onReset: () => void;
}

type SectionKey = keyof WeeklyReportStructured;

const SECTIONS: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'intellectualFocus', label: 'Intellectual Focus', icon: '🧠' },
  { key: 'keyInsights', label: 'Key Insights', icon: '✨' },
  { key: 'challenges', label: 'Challenges', icon: '🤔' },
  { key: 'nextWeekNavigation', label: 'Next Week Navigation', icon: '🚀' },
];

const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const [activeSections, setActiveSections] = useState<Set<SectionKey>>(
    new Set(['intellectualFocus', 'keyInsights', 'challenges', 'nextWeekNavigation'])
  );
  const [isViewMenuOpen, setViewMenuOpen] = useState(false);
  const [isExportMenuOpen, setExportMenuOpen] = useState(false);

  const toggleSection = (key: SectionKey) => {
    const newSet = new Set(activeSections);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setActiveSections(newSet);
  };

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportMenuOpen(false);
  };

  const handleExport = (format: 'markdown' | 'json' | 'txt') => {
    const { structured } = data;
    const dateStr = new Date().toISOString().slice(0, 10);
    
    if (format === 'json') {
      downloadFile(
        `weekly-insight-${dateStr}.json`, 
        JSON.stringify(structured, null, 2), 
        'application/json'
      );
    } else if (format === 'markdown') {
      const mdContent = `
# Weekly Report (${structured.period})

## 🧠 Intellectual Focus
${structured.intellectualFocus}

## ✨ Key Insights
${structured.keyInsights.map(i => `- ${i}`).join('\n')}

## 🤔 Challenges
${structured.challenges}

## 🚀 Next Week Navigation
${structured.nextWeekNavigation}
      `.trim();
      downloadFile(`weekly-insight-${dateStr}.md`, mdContent, 'text/markdown');
    } else if (format === 'txt') {
      const txtContent = `
Weekly Report (${structured.period})
===================================

[Intellectual Focus]
${structured.intellectualFocus.replace(/\*\*/g, '')}

[Key Insights]
${structured.keyInsights.map(i => `- ${i.replace(/\*\*/g, '')}`).join('\n')}

[Challenges]
${structured.challenges.replace(/\*\*/g, '')}

[Next Week Navigation]
${structured.nextWeekNavigation.replace(/\*\*/g, '')}
      `.trim();
      downloadFile(`weekly-insight-${dateStr}.txt`, txtContent, 'text/plain');
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-notion-border-light dark:border-notion-border-dark">
        <div>
          <h1 className="text-3xl font-bold text-notion-text-light dark:text-notion-text-dark mb-1">Weekly Dashboard</h1>
          <p className="text-notion-muted-light dark:text-notion-muted-dark font-mono text-sm">
            Period: {data.structured.period}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle Menu */}
          <div className="relative">
            <button 
              onClick={() => { setViewMenuOpen(!isViewMenuOpen); setExportMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark text-notion-text-light dark:text-notion-text-dark border border-notion-border-light dark:border-notion-border-dark transition-colors"
            >
              <Eye size={16} />
              <span>Customize View</span>
              <ChevronDown size={14} />
            </button>
            
            {isViewMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setViewMenuOpen(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-notion-sidebar-dark rounded-lg shadow-lg border border-notion-border-light dark:border-notion-border-dark z-20 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-xs font-semibold text-notion-muted-light dark:text-notion-muted-dark uppercase tracking-wider">Visible Sections</div>
                  {SECTIONS.map((section) => (
                    <div 
                      key={section.key}
                      onClick={() => toggleSection(section.key)}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark text-notion-text-light dark:text-notion-text-dark text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span>{section.icon}</span>
                        <span>{section.label}</span>
                      </div>
                      {activeSections.has(section.key) && <Check size={14} className="text-blue-500" />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export Menu */}
          <div className="relative">
            <button 
              onClick={() => { setExportMenuOpen(!isExportMenuOpen); setViewMenuOpen(false); }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
            >
              <Download size={16} />
              <span>Export</span>
              <ChevronDown size={14} />
            </button>
            
            {isExportMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setExportMenuOpen(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-notion-sidebar-dark rounded-lg shadow-lg border border-notion-border-light dark:border-notion-border-dark z-20 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 text-xs font-semibold text-notion-muted-light dark:text-notion-muted-dark uppercase tracking-wider">Export As</div>
                  <button onClick={() => handleExport('markdown')} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark text-notion-text-light dark:text-notion-text-dark text-sm text-left">
                    <FileType size={16} /> Markdown (.md)
                  </button>
                  <button onClick={() => handleExport('txt')} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark text-notion-text-light dark:text-notion-text-dark text-sm text-left">
                    <FileText size={16} /> Plain Text (.txt)
                  </button>
                  <button onClick={() => handleExport('json')} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark text-notion-text-light dark:text-notion-text-dark text-sm text-left">
                    <FileJson size={16} /> JSON Data (.json)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Intellectual Focus */}
        {activeSections.has('intellectualFocus') && (
          <div className="p-6 rounded-xl border border-notion-border-light dark:border-notion-border-dark bg-white dark:bg-notion-sidebar-dark/50 hover:shadow-sm transition-shadow">
             <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl select-none">🧠</span>
                <h2 className="text-xl font-bold text-notion-text-light dark:text-notion-text-dark">Intellectual Focus</h2>
             </div>
             <MarkdownRenderer content={data.structured.intellectualFocus} />
          </div>
        )}

        {/* Key Insights */}
        {activeSections.has('keyInsights') && (
          <div className="p-6 rounded-xl border border-notion-border-light dark:border-notion-border-dark bg-white dark:bg-notion-sidebar-dark/50 hover:shadow-sm transition-shadow">
             <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl select-none">✨</span>
                <h2 className="text-xl font-bold text-notion-text-light dark:text-notion-text-dark">Key Insights</h2>
             </div>
             <ul className="space-y-4">
               {data.structured.keyInsights.map((insight, idx) => (
                 <li key={idx} className="flex gap-3 text-notion-text-light dark:text-notion-text-dark leading-relaxed">
                   <span className="text-amber-500 font-bold mt-1">•</span>
                   <MarkdownRenderer content={insight} />
                 </li>
               ))}
             </ul>
          </div>
        )}

        {/* Challenges & Navigation (Side by Side on Large screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeSections.has('challenges') && (
            <div className="p-6 rounded-xl border border-notion-border-light dark:border-notion-border-dark bg-red-50/30 dark:bg-red-900/10 hover:shadow-sm transition-shadow">
               <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl select-none">🤔</span>
                  <h2 className="text-xl font-bold text-notion-text-light dark:text-notion-text-dark">Challenges</h2>
               </div>
               <MarkdownRenderer content={data.structured.challenges} />
            </div>
          )}

          {activeSections.has('nextWeekNavigation') && (
            <div className={`p-6 rounded-xl border border-notion-border-light dark:border-notion-border-dark bg-blue-50/30 dark:bg-blue-900/10 hover:shadow-sm transition-shadow ${!activeSections.has('challenges') ? 'col-span-1 lg:col-span-2' : ''}`}>
               <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl select-none">🚀</span>
                  <h2 className="text-xl font-bold text-notion-text-light dark:text-notion-text-dark">Next Week</h2>
               </div>
               <MarkdownRenderer content={data.structured.nextWeekNavigation} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-notion-border-light dark:border-notion-border-dark flex justify-center">
         <button 
            onClick={onReset}
            className="px-6 py-2 rounded text-sm text-notion-muted-light dark:text-notion-muted-dark hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark transition-colors"
         >
           Start New Analysis
         </button>
      </div>
    </div>
  );
};

export default Dashboard;