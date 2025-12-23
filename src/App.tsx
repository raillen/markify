import React, { useState, useRef, useEffect } from 'react';
import {
  Settings, Eye, Maximize2, Code, Download, FileDown,
  FolderOpen, ChevronDown, Image, Globe, FileText,
  Heart, Coffee, Copy, Check, ExternalLink, Languages
} from 'lucide-react';
import { TRANSLATIONS } from './i18n/translations';
import type { Language } from './i18n/translations';
import Preview from './components/Preview';
import type { PreviewHandle } from './components/Preview';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';
import { DEFAULT_STYLE } from './types';
import type { StyleConfig } from './types';

const ACCENT_COLORS = [
  { name: 'Azul', value: '#3b82f6', ring: 'rgba(59, 130, 246, 0.2)' },
  { name: 'Rosa', value: '#ec4899', ring: 'rgba(236, 72, 153, 0.2)' },
  { name: 'Roxo', value: '#8b5cf6', ring: 'rgba(139, 92, 246, 0.2)' },
  { name: 'Laranja', value: '#f97316', ring: 'rgba(249, 115, 22, 0.2)' },
  { name: 'Esmeralda', value: '#10b981', ring: 'rgba(16, 185, 129, 0.2)' },
  { name: 'Âmbar', value: '#f59e0b', ring: 'rgba(245, 158, 11, 0.2)' },
];

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`# Welcome to Markify ✨

This is a **high-fidelity** Markdown visualizer and editor.

## Features
- 🚀 Real-time preview
- 🎨 Accent colors
- 📄 Export to PDF & DOCX
- 📱 Responsive design

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
| Themes | ✅ |
`);

  const [styles, setStyles] = useState<StyleConfig>(DEFAULT_STYLE);
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'editor'>('split');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('markify-accent') || '#3b82f6';
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('markify-language') as Language;
    if (saved) return saved;
    const browserLang = navigator.language.split('-')[0] as Language;
    return (['pt', 'en', 'es', 'zh', 'ja'].includes(browserLang) ? browserLang : 'pt');
  });

  const t = TRANSLATIONS[language];

  const previewRef = useRef<PreviewHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const donationRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('markify-language', language);
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
      if (donationRef.current && !donationRef.current.contains(event.target as Node)) {
        setIsDonationOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyPix = () => {
    navigator.clipboard.writeText('contato@raillen.site');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFileOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMarkdown(content);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  useEffect(() => {
    const selected = ACCENT_COLORS.find(c => c.value === accentColor) || ACCENT_COLORS[0];
    document.documentElement.style.setProperty('--accent-primary', selected.value);
    document.documentElement.style.setProperty('--accent-ring', selected.ring);
    localStorage.setItem('markify-accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && viewMode === 'split') {
      setViewMode('editor');
    }
  }, [isMobile, viewMode]);

  const handleExport = async (type: 'pdf' | 'odt' | 'png' | 'html' | 'md') => {
    if (!previewRef.current) return;
    setIsExporting(true);
    setIsExportDropdownOpen(false);
    try {
      switch (type) {
        case 'pdf': await previewRef.current.exportPdf(); break;
        case 'odt': await previewRef.current.exportOdt(); break;
        case 'png': await previewRef.current.exportPng(); break;
        case 'html': await previewRef.current.exportHtml(); break;
        case 'md': await previewRef.current.exportMd(); break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden transition-colors duration-500 bg-slate-50 font-sans">
      {/* Sidebar background overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        language={language}
        styles={styles}
        setStyles={setStyles}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[var(--app-bg)]">
        {/* Header - Professional Density */}
        <header className="h-14 border-b border-zinc-200 bg-white/95 backdrop-blur-md flex items-center justify-between px-4 shadow-sm z-20">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 hover:bg-zinc-100 rounded-[0.4rem] text-zinc-500 transition-all border border-transparent hover:border-zinc-200"
              >
                <Settings size={18} />
              </button>
            )}

            <div className="flex items-center gap-2 pr-2 border-r border-zinc-200">
              <div className="w-7 h-7 rounded-[0.4rem] flex items-center justify-center text-white shadow-sm transition-colors duration-300" style={{ backgroundColor: accentColor }}>
                <Code size={16} />
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-900 font-outfit" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Markify
              </span>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-[0.4rem] transition-all"
            >
              <FolderOpen size={16} />
              <span className="hidden md:inline">{t.openFile}</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileOpen} accept=".md,.txt" className="hidden" />
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-[0.5rem] border border-zinc-200 mx-4">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[0.4rem] text-xs font-bold transition-all ${viewMode === 'editor' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <Code size={14} />
              <span className="hidden md:inline">{t.editor}</span>
            </button>
            {!isMobile && (
              <button
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[0.4rem] text-xs font-bold transition-all ${viewMode === 'split' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <Maximize2 size={14} />
                <span className="hidden md:inline">{t.split}</span>
              </button>
            )}
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[0.4rem] text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <Eye size={14} />
              <span className="hidden md:inline">{t.preview}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative mr-1" ref={languageRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[0.5rem] border border-zinc-200 shadow-sm transition-all duration-300 hover:bg-zinc-50 active:scale-[0.98] ${isLanguageOpen ? 'ring-2 ring-zinc-100 border-zinc-300' : ''}`}
                title={t.language}
              >
                <Languages size={14} className="text-zinc-500" />
                <span className="text-xs font-semibold text-zinc-700 hidden xl:inline">{language.toUpperCase()}</span>
                <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-zinc-200 rounded-[0.6rem] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-zinc-100 bg-zinc-50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t.selectLanguage}</span>
                  </div>
                  <div className="p-1 grid grid-cols-1 gap-0.5">
                    {[
                      { code: 'pt', label: 'Português', flag: '🇧🇷' },
                      { code: 'en', label: 'English', flag: '🇺🇸' },
                      { code: 'es', label: 'Español', flag: '🇪🇸' },
                      { code: 'zh', label: 'Mandarin', flag: '🇨🇳' },
                      { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as Language);
                          setIsLanguageOpen(false);
                        }}
                        className={`
                          flex items-center justify-between w-full px-2.5 py-1.5 rounded-[0.4rem] text-xs font-medium transition-all
                          ${language === lang.code
                            ? 'bg-zinc-50 text-zinc-900'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs">{lang.flag}</span>
                          {lang.label}
                        </div>
                        {language === lang.code && <Check size={12} className="text-[var(--accent-primary)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color Accent Picker - Professional Dropdown */}
            <div className="relative mr-1.5" ref={colorPickerRef}>
              <button
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[0.5rem] border border-zinc-200 shadow-sm transition-all duration-300 hover:bg-zinc-50 active:scale-[0.98] ${isColorPickerOpen ? 'ring-2 ring-zinc-100 border-zinc-300' : ''}`}
                title={t.theme}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shadow-inner"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="text-xs font-semibold text-zinc-700 hidden sm:inline">{t.theme}</span>
                <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-300 ${isColorPickerOpen ? 'rotate-180' : ''}`} />
              </button>

              {isColorPickerOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-[0.6rem] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-zinc-100 bg-zinc-50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t.selectColor}</span>
                  </div>
                  <div className="p-2 grid grid-cols-1 gap-1">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          setAccentColor(color.value);
                          setIsColorPickerOpen(false);
                        }}
                        className={`
                          flex items-center justify-between w-full px-2 py-1.5 rounded-[0.4rem] text-xs font-medium transition-all group
                          ${accentColor === color.value
                            ? 'bg-zinc-50 text-zinc-900'
                            : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color.value }} />
                          {color.name}
                        </div>
                        {accentColor === color.value && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color.value }} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Donation Dropdown */}
            <div className="relative" ref={donationRef}>
              <button
                onClick={() => setIsDonationOpen(!isDonationOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[0.5rem] border border-zinc-200 shadow-sm transition-all duration-300 hover:bg-zinc-50 active:scale-[0.98] ${isDonationOpen ? 'ring-2 ring-zinc-100 border-zinc-300' : ''}`}
                title={t.supportTitle}
              >
                <Heart size={16} style={{ color: accentColor }} className={isDonationOpen ? 'fill-current' : ''} />
                <span className="text-xs font-semibold text-zinc-700 hidden lg:inline">{t.support}</span>
              </button>

              {isDonationOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200 rounded-[0.6rem] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50">
                    <h3 className="text-sm font-bold text-zinc-900">{t.supportTitle}</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{t.supportDesc}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <a
                      href="https://ko-fi.com/raillen/donate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-3 py-2.5 rounded-[0.4rem] text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#29abe0]/10 flex items-center justify-center text-[#29abe0]">
                          <Coffee size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-zinc-900 leading-tight">Ko-fi</span>
                          <span className="text-[10px] text-zinc-500">{t.kofiDesc}</span>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                    </a>

                    <div className="px-3 py-2.5 rounded-[0.4rem] bg-zinc-50/50 border border-zinc-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                          <span className="text-[10px] font-black italic">PIX</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-zinc-900 leading-tight">{t.pixDirect}</span>
                          <span className="text-[10px] text-zinc-500 italic">contato@raillen.site</span>
                        </div>
                      </div>
                      <button
                        onClick={handleCopyPix}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-[11px] font-bold transition-all ${isCopied ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white text-zinc-700 border border-zinc-200 hover:border-zinc-300 shadow-sm active:scale-95'}`}
                      >
                        {isCopied ? (
                          <>
                            <Check size={14} />
                            <span>{t.pixCopied}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>{t.copyPix}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-[1px] bg-zinc-200 mx-1 hidden sm:block" />

            <div className="flex items-center gap-1.5">
              {/* Unified Export Dropdown */}
              <div className="relative" ref={exportDropdownRef}>
                <button
                  onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                  disabled={isExporting}
                  className="btn-primary flex items-center gap-2"
                >
                  {isExporting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  <span className="hidden sm:inline">{t.export}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isExportDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-[0.6rem] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 border-b border-zinc-100 bg-zinc-50">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{t.exportFormat}</span>
                    </div>
                    <div className="p-1.5 grid grid-cols-1 gap-0.5">
                      {[
                        { id: 'pdf' as const, label: t.formatPdf, icon: <FileDown size={14} /> },
                        { id: 'odt' as const, label: t.formatDocx, icon: <FileText size={14} /> },
                        { id: 'png' as const, label: t.formatPng, icon: <Image size={14} /> },
                        { id: 'html' as const, label: t.formatHtml, icon: <Globe size={14} /> },
                        { id: 'md' as const, label: t.formatMd, icon: <Code size={14} /> },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleExport(item.id)}
                          className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-[0.4rem] text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all group"
                        >
                          <div className="text-zinc-400 group-hover:text-[var(--accent-primary)] transition-colors">
                            {item.icon}
                          </div>
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Professional Grid */}
        <div className="flex-1 flex overflow-hidden p-2 md:p-3 gap-2 md:gap-3">
          {(viewMode === 'editor' || viewMode === 'split') && (
            <div className={`
              ${viewMode === 'split' ? 'w-1/2' : 'flex-1'} 
              h-full rounded-[0.4rem] overflow-hidden border border-zinc-200 
              bg-white shadow-sm
            `}>
              <Editor markdown={markdown} setMarkdown={setMarkdown} isMobile={isMobile} />
            </div>
          )}
          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`
              ${viewMode === 'split' ? 'w-1/2' : 'flex-1'} 
              h-full rounded-[0.4rem] bg-zinc-100/30 border border-zinc-200 
              overflow-y-auto overflow-x-hidden flex justify-center p-2 lg:p-4 shadow-sm
            `}>
              <Preview
                ref={previewRef}
                markdown={markdown}
                styles={styles}
                isMobile={isMobile}
                language={language}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="h-8 bg-white border-t border-zinc-200 px-4 flex items-center justify-between text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
              {t.words}: {markdown.split(/\s+/).filter(Boolean).length}
            </span>
            <span className="hidden sm:inline flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
              {t.lines}: {markdown.split('\n').length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">{t.gfmActive}</span>
            <div className="w-2 h-2 rounded-full shadow-[0_0_8px_var(--accent-primary)]" style={{ backgroundColor: 'var(--accent-primary)' }} />
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
