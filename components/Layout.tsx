import React, { ReactNode, useContext } from 'react';
import { ThemeContext } from '../App';
import { Sun, Moon, Sidebar as SidebarIcon, Plus, History, Settings, MoreHorizontal, Trash2 } from 'lucide-react';
import { WeeklyReportData } from '../types';

interface LayoutProps {
  children: ReactNode;
  onReset: () => void;
  history: WeeklyReportData[];
  onSelectReport: (report: WeeklyReportData) => void;
  onDeleteReport: (e: React.MouseEvent, id: string) => void;
  currentReportId?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  onReset, 
  history, 
  onSelectReport, 
  onDeleteReport,
  currentReportId 
}) => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`flex h-screen w-full transition-colors duration-200 ${isDark ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div 
        className={`
          flex-shrink-0 bg-notion-sidebar-light dark:bg-notion-sidebar-dark 
          border-r border-notion-border-light dark:border-notion-border-dark
          transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden opacity-0'}
        `}
      >
        <div className="p-3 flex items-center justify-between group">
          <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark cursor-pointer flex-1">
            <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold">M</div>
            <span className="text-sm font-medium truncate text-notion-text-light dark:text-notion-text-dark">Mike's Workspace</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1 rounded hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark text-notion-muted-light dark:text-notion-muted-dark opacity-0 group-hover:opacity-100 transition-opacity">
            <SidebarIcon size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-2 mb-4">
            <button 
              onClick={onReset}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-notion-muted-light dark:text-notion-muted-dark hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark rounded transition-colors"
            >
              <Plus size={16} />
              <span className="font-medium text-notion-text-light dark:text-notion-text-dark">New Report</span>
            </button>
          </div>

          <div className="px-3 mb-2">
             <div className="text-xs font-semibold text-notion-muted-light dark:text-notion-muted-dark mb-1 px-1">Favorites</div>
             <div className="flex items-center gap-2 px-2 py-1 text-sm text-notion-text-light dark:text-notion-text-dark hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark rounded cursor-pointer">
                <span className="text-lg">🧠</span>
                <span>Weekly Insights</span>
             </div>
          </div>

          <div className="px-3 mt-4">
             <div className="text-xs font-semibold text-notion-muted-light dark:text-notion-muted-dark mb-1 px-1">History</div>
             {history.length === 0 ? (
                <div className="px-2 py-1 text-xs text-notion-muted-light dark:text-notion-muted-dark italic">No reports yet</div>
             ) : (
                history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => onSelectReport(item)}
                    className={`
                      group flex items-center justify-between px-2 py-1 text-sm rounded cursor-pointer mb-0.5
                      ${currentReportId === item.id 
                        ? 'bg-notion-hover-light dark:bg-notion-hover-dark text-notion-text-light dark:text-notion-text-dark font-medium' 
                        : 'text-notion-text-light dark:text-notion-text-dark hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark opacity-80 hover:opacity-100'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <History size={14} className="flex-shrink-0" />
                      <span className="truncate">{item.structured.period || formatDate(item.timestamp)}</span>
                    </div>
                    <button 
                      onClick={(e) => onDeleteReport(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
             )}
          </div>
        </div>

        <div className="p-2 border-t border-notion-border-light dark:border-notion-border-dark">
          <button 
             onClick={toggleTheme}
             className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-notion-text-light dark:text-notion-text-dark hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark rounded transition-colors"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-notion-text-light dark:text-notion-text-dark hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark rounded transition-colors">
            <Settings size={16} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-notion-bg-light dark:bg-notion-bg-dark relative">
        
        {/* Top Bar / Breadcrumbs */}
        <div className="h-12 flex items-center px-4 flex-shrink-0 sticky top-0 z-10 bg-notion-bg-light dark:bg-notion-bg-dark transition-all">
           {!isSidebarOpen && (
             <button 
               onClick={() => setSidebarOpen(true)} 
               className="mr-2 p-1 rounded hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark text-notion-muted-light dark:text-notion-muted-dark hover:text-notion-text-light dark:hover:text-notion-text-dark transition-colors"
               aria-label="Open sidebar"
             >
               <SidebarIcon size={18} />
             </button>
           )}
           
           <div className="flex items-center gap-2 text-sm text-notion-text-light dark:text-notion-text-dark">
             <span className="opacity-60">Workspace</span>
             <span className="opacity-40">/</span>
             <span className="font-medium">Weekly Insights</span>
           </div>
           
           <div className="ml-auto flex items-center gap-2 text-notion-muted-light dark:text-notion-muted-dark">
              <span className="text-xs opacity-60">
                 {currentReportId ? 'Saved' : 'Auto-save enabled'}
              </span>
              <MoreHorizontal size={16} className="cursor-pointer hover:text-notion-text-light dark:hover:text-notion-text-dark" />
           </div>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="max-w-3xl mx-auto px-12 pb-24 pt-8 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;