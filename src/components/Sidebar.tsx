import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
    Type,
    Settings,
    ChevronLeft,
    Palette,
    AlignLeft,
    Layout,
    Check,
    Monitor,
} from 'lucide-react';
import type { StyleConfig, FontFamily, PaperSize } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language } from '../i18n/translations';

interface SidebarProps {
    language: Language;
    styles: StyleConfig;
    setStyles: React.Dispatch<React.SetStateAction<StyleConfig>>;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ language, styles, setStyles, isOpen, setIsOpen, isMobile = false }) => {
    const t = TRANSLATIONS[language];
    const fonts: FontFamily[] = ['Outfit', 'Inter', 'Lora', 'JetBrains Mono', 'system-ui'];
    const paperSizes: PaperSize[] = ['A3', 'A4', 'A5', 'Letter', 'Custom'];

    const [activeTab, setActiveTab] = useState<'typography' | 'style' | 'layout'>('typography');
    const [activeColorKey, setActiveColorKey] = useState<keyof StyleConfig | null>(null);

    const handleStyleChange = (key: keyof StyleConfig, value: any) => {
        setStyles(prev => ({ ...prev, [key]: value }));
    };

    const colorItems = [
        { label: t.colors, key: 'textColor' as keyof StyleConfig },
        { label: t.theme, key: 'accentColor' as keyof StyleConfig },
        { label: t.paper, key: 'backgroundColor' as keyof StyleConfig }
    ];

    const TabButton = ({ id, icon, label }: { id: typeof activeTab, icon: React.ReactNode, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`
                flex flex-col items-center gap-1.5 flex-1 py-2.5 px-1 rounded-[0.4rem] transition-all duration-200
                ${activeTab === id
                    ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}
            `}
        >
            {icon}
            <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
        </button>
    );

    return (
        <aside
            className={`
                relative transition-all duration-500 ease-in-out 
                border-r border-zinc-200 
                bg-white 
                h-full z-50
                ${isMobile
                    ? `fixed inset-y-0 left-0 w-80 max-w-[85vw] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`
                    : isOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 border-none pointer-events-none'
                }
            `}
        >
            <div className={`flex flex-col h-full ${!isOpen && !isMobile && 'hidden'}`}>
                {/* Sidebar Header */}
                <div className="p-4 flex items-center justify-between border-b border-zinc-100">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-[0.4rem] bg-zinc-100 text-zinc-600">
                            <Settings size={16} />
                        </div>
                        <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
                            {t.settings}
                        </h2>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-zinc-100 rounded-[0.4rem] text-zinc-500 transition-all active:scale-95"
                    >
                        <ChevronLeft size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-4 py-3">
                    <div className="flex bg-zinc-50 p-1 rounded-[0.5rem] border border-zinc-200">
                        <TabButton id="typography" icon={<Type size={14} />} label={t.fonts} />
                        <TabButton id="style" icon={<Palette size={14} />} label={t.colors} />
                        <TabButton id="layout" icon={<Layout size={14} />} label={t.paper} />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6 space-y-6">

                    {activeTab === 'typography' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-400 mb-2 block tracking-wider">{t.fontFamily}</label>
                                    <select
                                        value={styles.fontFamily}
                                        onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                                        className="w-full bg-white border border-zinc-200 rounded-[0.4rem] px-3 py-2 text-sm font-medium outline-none focus:border-zinc-400 transition-all"
                                    >
                                        {fonts.map(font => (
                                            <option key={font} value={font}>{font}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">{t.baseSize}</label>
                                        <span className="text-[10px] font-semibold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">{styles.baseSize}px</span>
                                    </div>
                                    <input
                                        type="range" min="12" max="24" step="1"
                                        value={styles.baseSize}
                                        onChange={(e) => handleStyleChange('baseSize', parseInt(e.target.value))}
                                        className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-100">
                                <label className="text-[10px] uppercase font-bold text-zinc-400 mb-4 block tracking-wider">{t.typography}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[1, 2, 3].map(level => {
                                        const key = `h${level}Size` as keyof StyleConfig;
                                        return (
                                            <div key={level} className="space-y-1.5">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-medium text-zinc-400 uppercase">H{level}</span>
                                                    <span className="text-[10px] font-semibold text-zinc-900">{styles[key]}px</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={styles[key] as number}
                                                    onChange={(e) => handleStyleChange(key, parseInt(e.target.value))}
                                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-[0.4rem] px-2 py-1.5 text-xs font-semibold outline-none focus:border-zinc-400"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'style' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: 'Profissional', text: '#1f2937', accent: '#3b82f6', bg: '#ffffff' },
                                    { name: 'Sépia', text: '#433422', accent: '#92400e', bg: '#fdf6e3' },
                                    { name: 'Minimalista', text: '#000000', accent: '#6366f1', bg: '#ffffff' },
                                    { name: 'Suave', text: '#475569', accent: '#10b981', bg: '#f8fafc' }
                                ].map(preset => (
                                    <button
                                        key={preset.name}
                                        onClick={() => {
                                            handleStyleChange('textColor', preset.text);
                                            handleStyleChange('accentColor', preset.accent);
                                            handleStyleChange('backgroundColor', preset.bg);
                                        }}
                                        className="flex flex-col gap-2 p-2.5 rounded-[0.4rem] border border-zinc-100 hover:border-zinc-400 transition-all bg-white active:scale-95 shadow-sm"
                                    >
                                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{preset.name}</span>
                                        <div className="flex gap-1">
                                            <div className="w-4 h-4 rounded-sm border border-zinc-100" style={{ backgroundColor: preset.bg }} />
                                            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: preset.text }} />
                                            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: preset.accent }} />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-zinc-100">
                                {colorItems.map(item => (
                                    <div key={item.key} className="space-y-2">
                                        <div
                                            className={`
                                                flex items-center justify-between p-2.5 rounded-[0.4rem] transition-all cursor-pointer border
                                                ${activeColorKey === item.key ? 'bg-zinc-50 border-zinc-200' : 'hover:bg-zinc-50 border-transparent'}
                                            `}
                                            onClick={() => setActiveColorKey(activeColorKey === item.key ? null : item.key)}
                                        >
                                            <span className="text-xs font-medium text-zinc-600">{item.label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-medium text-zinc-400 font-mono tracking-tight">{styles[item.key] as string}</span>
                                                <div
                                                    className="w-6 h-6 rounded-md border border-zinc-200 shadow-sm"
                                                    style={{ backgroundColor: styles[item.key] as string }}
                                                />
                                            </div>
                                        </div>

                                        {activeColorKey === item.key && (
                                            <div className="p-3 bg-white rounded-[0.4rem] border border-zinc-200 animate-in zoom-in-95 duration-200">
                                                <HexColorPicker
                                                    color={styles[item.key] as string}
                                                    onChange={(newColor) => handleStyleChange(item.key, newColor)}
                                                    className="!w-full !h-24 mb-3"
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={styles[item.key] as string}
                                                        onChange={(e) => handleStyleChange(item.key, e.target.value)}
                                                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-[0.4rem] px-3 py-1.5 text-xs font-semibold font-mono outline-none"
                                                    />
                                                    <button
                                                        onClick={() => setActiveColorKey(null)}
                                                        className="px-2 bg-zinc-900 text-white rounded-[0.4rem]"
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'layout' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-zinc-400 mb-3 block tracking-wider text-center">{t.paperSize}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {paperSizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => handleStyleChange('paperSize', size)}
                                                className={`
                                                    py-2 rounded-[0.4rem] text-xs font-semibold border transition-all
                                                    ${styles.paperSize === size
                                                        ? 'bg-[var(--accent-primary)] text-white border-transparent shadow-sm'
                                                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300'}
                                                `}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 space-y-4 border-t border-zinc-100">
                                    <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                        <AlignLeft size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{t.visualSettings}</span>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-medium text-zinc-400 uppercase">{t.lineHeight}</label>
                                            <span className="text-[10px] font-semibold text-zinc-900">{styles.lineHeight}</span>
                                        </div>
                                        <input
                                            type="range" min="1" max="2.5" step="0.1"
                                            value={styles.lineHeight}
                                            onChange={(e) => handleStyleChange('lineHeight', parseFloat(e.target.value))}
                                            className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-medium text-zinc-400 uppercase">{t.sideMargin}</label>
                                            <span className="text-[10px] font-semibold text-zinc-900">{styles.margin}mm</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="100" step="5"
                                            value={styles.margin}
                                            onChange={(e) => handleStyleChange('margin', parseInt(e.target.value))}
                                            className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 bg-zinc-50 border-t border-zinc-100 mt-auto">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <div className="w-7 h-7 rounded-[0.4rem] bg-zinc-200 flex items-center justify-center">
                            <Monitor size={14} />
                        </div>
                        <p className="text-[9px] font-medium uppercase tracking-widest leading-tight">
                            Documento Editável <br />em Instantes
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
