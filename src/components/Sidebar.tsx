import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
    Type,
    Settings,
    ChevronLeft,
    ChevronDown,
    ChevronRight,
    Palette,
    AlignLeft,
    Layout,
    Check,
    X
} from 'lucide-react';
import type { StyleConfig, FontFamily, PaperSize } from '../types';

interface SidebarProps {
    styles: StyleConfig;
    setStyles: React.Dispatch<React.SetStateAction<StyleConfig>>;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ styles, setStyles, isOpen, setIsOpen, isMobile = false }) => {
    const fonts: FontFamily[] = ['Inter', 'Lora', 'JetBrains Mono', 'system-ui'];
    const paperSizes: PaperSize[] = ['A3', 'A4', 'A5', 'Letter', 'Custom'];

    const [isHeadersOpen, setIsHeadersOpen] = useState(false);
    const [activeColorKey, setActiveColorKey] = useState<keyof StyleConfig | null>(null);

    const handleStyleChange = (key: keyof StyleConfig, value: any) => {
        setStyles(prev => ({ ...prev, [key]: value }));
    };

    const colorItems = [
        { label: 'Text Color', key: 'textColor' as keyof StyleConfig },
        { label: 'Accent Color', key: 'accentColor' as keyof StyleConfig },
        { label: 'Background', key: 'backgroundColor' as keyof StyleConfig }
    ];

    return (
        <aside
            className={`relative transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto h-full ${isMobile
                    ? 'w-80 max-w-[85vw]'
                    : isOpen ? 'w-80' : 'w-0 border-none'
                }`}
        >
            <div className={`p-4 md:p-6 space-y-6 md:space-y-8 ${!isMobile && !isOpen && 'hidden'}`}>
                {/* Header with close button */}
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 flex items-center gap-2">
                        <Settings size={16} /> Configuration
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-500 transition-colors"
                        aria-label="Close sidebar"
                    >
                        {isMobile ? <X size={20} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Typography Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                        <Type size={14} /> Typography
                    </h3>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1.5 block">Font Family</label>
                            <select
                                value={styles.fontFamily}
                                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                {fonts.map(font => (
                                    <option key={font} value={font}>{font}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1.5 block">Base Font Size ({styles.baseSize}px)</label>
                            <input
                                type="range" min="12" max="24" step="1"
                                value={styles.baseSize}
                                onChange={(e) => handleStyleChange('baseSize', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Header Sizes Section */}
                <div className="space-y-2 border-b border-gray-100 dark:border-zinc-800 pb-6">
                    <button
                        onClick={() => setIsHeadersOpen(!isHeadersOpen)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-gray-900 dark:text-zinc-100 hover:text-blue-600 transition-colors py-2"
                    >
                        <div className="flex items-center gap-2">
                            <AlignLeft size={14} /> Headings Sizes
                        </div>
                        {isHeadersOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {isHeadersOpen && (
                        <div className="grid grid-cols-2 gap-3 pt-4 px-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            {[1, 2, 3, 4, 5, 6].map(level => {
                                const key = `h${level}Size` as keyof StyleConfig;
                                return (
                                    <div key={level} className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500">H{level}</label>
                                            <span className="text-[9px] text-blue-500 font-mono">{styles[key]}px</span>
                                        </div>
                                        <input
                                            type="number"
                                            value={styles[key] as number}
                                            onChange={(e) => handleStyleChange(key, parseInt(e.target.value))}
                                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Spacing Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                        <AlignLeft size={14} /> Spacing & Layout
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1.5 block">Line Height ({styles.lineHeight})</label>
                            <input
                                type="range" min="1" max="2.5" step="0.1"
                                value={styles.lineHeight}
                                onChange={(e) => handleStyleChange('lineHeight', parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1.5 block">Margin ({styles.margin}mm)</label>
                            <input
                                type="range" min="0" max="100" step="5"
                                value={styles.margin}
                                onChange={(e) => handleStyleChange('margin', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Colors Section */}
                <div className="space-y-6">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                        <Palette size={14} /> Visual Style
                    </h3>

                    {/* Presets - Responsive grid */}
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { name: 'Professional', text: '#1f2937', accent: '#3b82f6', bg: '#ffffff' },
                            { name: 'Paper/Sepia', text: '#433422', accent: '#92400e', bg: '#fdf6e3' },
                            { name: 'Modern Dark', text: '#e2e8f0', accent: '#60a5fa', bg: '#1e293b' },
                            { name: 'High Contrast', text: '#000000', accent: '#6366f1', bg: '#ffffff' }
                        ].map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => {
                                    handleStyleChange('textColor', preset.text);
                                    handleStyleChange('accentColor', preset.accent);
                                    handleStyleChange('backgroundColor', preset.bg);
                                }}
                                className="flex flex-col gap-1 p-2 rounded-lg border border-gray-100 dark:border-zinc-800 hover:border-blue-500 transition-all text-left group active:scale-95"
                            >
                                <span className="text-[9px] font-bold text-gray-400 group-hover:text-blue-500 uppercase">{preset.name}</span>
                                <div className="flex gap-1">
                                    <div className="w-4 h-4 rounded-full border border-gray-100" style={{ backgroundColor: preset.bg }} />
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.text }} />
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Color Pickers */}
                    <div className="space-y-4 pt-2">
                        {colorItems.map(item => (
                            <div key={item.key} className="space-y-2">
                                <div
                                    className="flex items-center justify-between cursor-pointer group p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                                    onClick={() => setActiveColorKey(activeColorKey === item.key ? null : item.key)}
                                >
                                    <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 cursor-pointer group-hover:text-blue-500 transition-colors">
                                        {item.label}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-gray-400">{styles[item.key] as string}</span>
                                        <div
                                            className={`w-7 h-7 rounded-md border border-gray-200 dark:border-zinc-700 shadow-sm transition-transform ${activeColorKey === item.key ? 'scale-110 ring-2 ring-blue-500/20' : ''}`}
                                            style={{ backgroundColor: styles[item.key] as string }}
                                        />
                                    </div>
                                </div>

                                {activeColorKey === item.key && (
                                    <div className="pt-2 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800 flex flex-col items-center gap-3">
                                            <HexColorPicker
                                                color={styles[item.key] as string}
                                                onChange={(newColor) => handleStyleChange(item.key, newColor)}
                                                className="!w-full !h-40"
                                            />
                                            <div className="w-full flex gap-2">
                                                <input
                                                    type="text"
                                                    value={styles[item.key] as string}
                                                    onChange={(e) => handleStyleChange(item.key, e.target.value)}
                                                    className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-500/20"
                                                />
                                                <button
                                                    onClick={() => setActiveColorKey(null)}
                                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Paper Section */}
                <div className="space-y-4 pb-8">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                        <Layout size={14} /> Paper Settings
                    </h3>
                    <div className="space-y-3">
                        <select
                            value={styles.paperSize}
                            onChange={(e) => handleStyleChange('paperSize', e.target.value)}
                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                        >
                            {paperSizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>

                        {styles.paperSize === 'Custom' && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1 block">Width (mm)</label>
                                    <input
                                        type="number"
                                        value={styles.customWidth}
                                        onChange={(e) => handleStyleChange('customWidth', parseInt(e.target.value))}
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-zinc-500 mb-1 block">Height (mm)</label>
                                    <input
                                        type="number"
                                        value={styles.customHeight}
                                        onChange={(e) => handleStyleChange('customHeight', parseInt(e.target.value))}
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
