export interface WeeklyReportStructured {
  period: string;
  intellectualFocus: string;
  keyInsights: string[];
  challenges: string;
  nextWeekNavigation: string;
}

export interface WeeklyReportData {
  id: string;
  rawContent: string;
  structured: WeeklyReportStructured;
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface ReportContextType {
  appState: AppState;
  report: WeeklyReportData | null;
  error: string | null;
  generateReport: (content: string) => Promise<void>;
  reset: () => void;
}

export interface IconProps {
  className?: string;
  size?: number;
}