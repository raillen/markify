import React, { useState, useRef, useEffect } from 'react';
import { Download, Eye, Code, Maximize2, FileDown, Sun, Moon, Settings, Menu, X } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const previewRef = useRef<PreviewHandle>(null);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // On desktop, default to open sidebar. On mobile, default to closed.
      if (!mobile && window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile, set default view to editor only
  useEffect(() => {
    if (isMobile && viewMode === 'split') {
      setViewMode('editor');
    }
  }, [isMobile, viewMode]);

  // Close sidebar on mobile when clicking overlay
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

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
      {/* Mobile Overlay */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={`
        ${isMobile ? 'mobile-sidebar' : ''}
        ${isMobile && !isSidebarOpen ? 'mobile-sidebar-hidden' : ''}
        ${isMobile && isSidebarOpen ? 'mobile-sidebar-visible' : ''}
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar
          styles={styles}
          setStyles={setStyles}
          isOpen={isMobile ? true : isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isMobile={isMobile}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header - Responsive */}
        <header className="h-14 md:h-14 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex items-center justify-between px-2 md:px-4 safe-area-inset-top">
          {/* Left side */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 transition-colors"
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isMobile && isSidebarOpen ? <X size={20} /> : isMobile ? <Menu size={20} /> : !isSidebarOpen && <Settings size={18} />}
            </button>

            {/* Logo - hidden on very small screens when menu is shown */}
            <div className="flex items-center gap-2">
              <Logo size={24} />
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hidden sm:inline">
                Markify
              </span>
            </div>
          </div>

          {/* View Mode Toggle - Responsive */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-2 md:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'editor' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'}`}
            >
              <Code size={14} className="inline mr-0 md:mr-1.5" />
              <span className="hidden md:inline">Editor</span>
            </button>
            {/* Hide split mode on mobile */}
            {!isMobile && (
              <button
                onClick={() => setViewMode('split')}
                className={`px-2 md:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'split' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'}`}
              >
                <Maximize2 size={14} className="inline mr-0 md:mr-1.5" />
                <span className="hidden md:inline">Split</span>
              </button>
            )}
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2 md:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-zinc-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-zinc-400'}`}
            >
              <Eye size={14} className="inline mr-0 md:mr-1.5" />
              <span className="hidden md:inline">Preview</span>
            </button>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Theme toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-zinc-400 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Export buttons - Condensed on mobile */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Download size={14} />
                <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'PDF'}</span>
              </button>
              {/* ODT button - hidden on very small screens */}
              <button
                onClick={() => handleExport('odt')}
                disabled={isExporting}
                className="hidden sm:flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 text-xs font-medium bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm disabled:opacity-50"
              >
                <FileDown size={14} />
                <span className="hidden md:inline">ODT</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area - Responsive */}
        <div className="flex-1 flex overflow-hidden">
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div className={`${viewMode === 'split' ? 'w-1/2' : 'flex-1'} h-full border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950`}>
              <Editor markdown={markdown} setMarkdown={setMarkdown} isMobile={isMobile} />
            </div>
          )}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`${viewMode === 'split' ? 'w-1/2' : 'flex-1'} h-full bg-gray-50 dark:bg-zinc-900 overflow-y-auto overflow-x-hidden p-2 md:p-4 lg:p-10`}>
              <Preview ref={previewRef} markdown={markdown} styles={styles} isMobile={isMobile} />
            </div>
          )}
        </div>

        {/* Footer - Responsive */}
        <footer className="h-8 border-t border-gray-200 dark:border-zinc-800 px-2 md:px-4 flex items-center justify-between text-[10px] font-medium text-gray-400 dark:text-zinc-500 bg-white dark:bg-zinc-900 safe-area-inset-bottom">
          <div className="flex gap-2 md:gap-4">
            <span>Words: {markdown.split(/\s+/).filter(Boolean).length}</span>
            <span className="hidden sm:inline">Lines: {markdown.split('\n').length}</span>
          </div>
          <div className="hidden sm:block">Markdown</div>
        </footer>
      </main>
    </div>
  );
};

export default App;
