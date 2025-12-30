import React from 'react';

// A lightweight, robust renderer to avoid dependency issues while maintaining Notion aesthetic
// Splits text by newlines and applies formatting based on standard Markdown patterns

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content || typeof content !== 'string') {
    return null;
  }

  const lines = content.split('\n');
  
  return (
    <div className="space-y-4 text-notion-text-light dark:text-notion-text-dark">
      {lines.map((line, index) => {
        const key = `line-${index}`;
        
        // H1
        if (line.startsWith('# ')) {
          return <h1 key={key} className="text-4xl font-bold mt-8 mb-4 tracking-tight">{line.substring(2)}</h1>;
        }
        // H2
        if (line.startsWith('## ')) {
          return <h2 key={key} className="text-2xl font-semibold mt-8 mb-2 border-b border-notion-border-light dark:border-notion-border-dark pb-2">{line.substring(3)}</h2>;
        }
        // H3
        if (line.startsWith('### ')) {
          return <h3 key={key} className="text-xl font-semibold mt-6 mb-2">{line.substring(4)}</h3>;
        }
        // H4
        if (line.startsWith('#### ')) {
            return <h4 key={key} className="text-lg font-semibold mt-4 mb-1 text-gray-800 dark:text-gray-200">{line.substring(5)}</h4>;
        }
        // Bullet points
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          const content = line.trim().substring(2);
          // Handle bolding within lists
          const parts = content.split(/(\*\*.*?\*\*)/g);
          return (
            <div key={key} className="flex gap-2 ml-1 leading-7">
              <span className="select-none text-lg leading-6">•</span>
              <p>
                {parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-semibold text-gray-900 dark:text-gray-100">{part.slice(2, -2)}</strong>;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </p>
            </div>
          );
        }
        
        // Horizontal Rule
        if (line.trim() === '---') {
            return <hr key={key} className="my-8 border-notion-border-light dark:border-notion-border-dark" />;
        }

        // Empty line
        if (line.trim() === '') {
          return <div key={key} className="h-2"></div>;
        }

        // Paragraph with bold support
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={key} className="leading-7 text-[16px]">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold text-gray-900 dark:text-gray-100">{part.slice(2, -2)}</strong>;
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;