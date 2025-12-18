import React, { useState, useRef } from 'react';
import { Download, Eye, Code, Maximize2, FileDown, Sun, Moon, Settings } from 'lucide-react';
import Logo from './components/Logo';
import Preview from './components/Preview';
import type { PreviewHandle } from './components/Preview';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import { DEFAULT_STYLE } from './types';
import type { StyleConfig } from './types';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`# Welcome to Markify ✨

This is a **high-fidelity** Markdown visualizer and editor.

## Features
- 🚀 Real-time preview
- 🎨 Style customization
- 📄 Export to PDF & ODT
- 📱 Responsive design
- 🌙 Dark mode

### Code Support
\`\`\`javascript
function helloWorld() {
  console.log("Hello from Markify!");
}
\`\`\`

### Tables
| Feature | Support |
| :--- | :--- |
| Emoji | ✅ |
| GFM | ✅ |
| Dark Mode | ✅ |
`);

  const [styles, setStyles] = useState<StyleConfig>(DEFAULT_STYLE);
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'editor'>('split');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const previewRef = useRef<PreviewHandle>(null);


  const handleExport = async (type: 'pdf' | 'odt') => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      if (type === 'pdf') {
        await previewRef.current.exportPdf();
      } else {
        await previewRef.current.exportOdt();
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please check your browser settings.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden ${isDarkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar
        styles={styles}
        setStyles={setStyles}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 transition-colors"
              >
                <Settings size={18} />
              </button>
            )}
            <Logo size={24} />
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Markify
            </span>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'editor' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'}`}
            >
              <Code size={14} className="inline mr-1.5" /> Editor
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'split' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'}`}
            >
              <Maximize2 size={14} className="inline mr-1.5" /> Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'}`}
            >
              <Eye size={14} className="inline mr-1.5" /> Preview
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Download size={14} />
                {isExporting ? 'Exporting...' : 'PDF'}
              </button>
              <button
                onClick={() => handleExport('odt')}
                disabled={isExporting}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <FileDown size={14} />
                ODT
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div className="flex-1 h-full border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <Editor markdown={markdown} setMarkdown={setMarkdown} />
            </div>
          )}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className="flex-1 h-full bg-gray-50 dark:bg-zinc-900 overflow-y-auto overflow-x-hidden p-4 md:p-10">
              <Preview ref={previewRef} markdown={markdown} styles={styles} />
            </div>
          )}
        </div>

        <footer className="h-8 border-t border-gray-200 dark:border-zinc-800 px-4 flex items-center justify-between text-[10px] font-medium text-gray-400 dark:text-zinc-500 bg-white dark:bg-zinc-900">
          <div className="flex gap-4">
            <span>Words: {markdown.split(/\s+/).filter(Boolean).length}</span>
            <span>Lines: {markdown.split('\n').length}</span>
          </div>
          <div>Markdown</div>
        </footer>
      </main>
    </div>
  );
};

export default App;
