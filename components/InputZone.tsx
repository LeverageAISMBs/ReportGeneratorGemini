import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { MOCK_CONTENT_PLACEHOLDER } from '../constants';

interface InputZoneProps {
  onAnalyze: (content: string) => void;
  isLoading: boolean;
}

const InputZone: React.FC<InputZoneProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length) processFile(files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAnalyze(text);
  };

  return (
    <div className="animate-fade-in">
      {/* Notion-style Header Image / Icon */}
      <div className="group relative mb-8 mt-4">
         <div className="text-7xl mb-4 select-none animate-bounce-subtle hover:scale-110 transition-transform origin-left duration-300 w-min cursor-default">
            ✨
         </div>
         <h1 className="text-4xl font-bold text-notion-text-light dark:text-notion-text-dark mb-2 tracking-tight">
           Weekly Insight Generator
         </h1>
         <div className="text-notion-muted-light dark:text-notion-muted-dark flex items-center gap-2 text-lg">
            <span>Powered by Gemini 3.0 Pro</span>
         </div>
      </div>

      {/* Input Area */}
      <div 
        className={`
          relative rounded-xl border-2 transition-all duration-300
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-notion-border-light dark:border-notion-border-dark bg-notion-bg-light dark:bg-notion-bg-dark hover:border-notion-muted-light'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={MOCK_CONTENT_PLACEHOLDER}
          className="w-full h-64 p-6 bg-transparent resize-none outline-none text-notion-text-light dark:text-notion-text-dark font-mono text-sm leading-relaxed"
          disabled={isLoading}
        />
        
        {/* Actions Overlay */}
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden"
              accept=".txt,.md"
              onChange={handleFileSelect}
            />
            <button
               onClick={() => fileInputRef.current?.click()}
               className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-notion-hover-light dark:bg-notion-hover-dark text-notion-text-light dark:text-notion-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
               <UploadCloud size={14} />
               <span>Import File</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className={`
                px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm transition-all
                ${!text.trim() || isLoading 
                   ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                   : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80'
                }
              `}
            >
              {isLoading ? 'Thinking...' : 'Generate Report'}
            </button>
        </div>
      </div>
      
      {/* Hint */}
      <div className="mt-4 text-xs text-notion-muted-light dark:text-notion-muted-dark text-center">
        Supports Markdown (.md) and Text (.txt) files. Your data is processed securely by Gemini.
      </div>
    </div>
  );
};

export default InputZone;