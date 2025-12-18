export type FontFamily = 'Inter' | 'Lora' | 'JetBrains Mono' | 'system-ui';
export type PaperSize = 'A3' | 'A4' | 'A5' | 'Letter' | 'Custom';

export type StyleConfig = {
    fontFamily: FontFamily;
    headingFontFamily: FontFamily;
    baseSize: number;
    h1Size: number;
    h2Size: number;
    h3Size: number;
    h4Size: number;
    h5Size: number;
    h6Size: number;
    lineHeight: number;
    paragraphSpacing: number;
    textColor: string;
    accentColor: string;
    backgroundColor: string;
    margin: number;
    paperSize: PaperSize;
    customWidth: number;
    customHeight: number;
}

export const PAPER_DIMENSIONS: Record<Exclude<PaperSize, 'Custom'>, { width: number; height: number }> = {
    'A3': { width: 297, height: 420 },
    'A4': { width: 210, height: 297 },
    'A5': { width: 148, height: 210 },
    'Letter': { width: 215.9, height: 279.4 }
};

export const DEFAULT_STYLE: StyleConfig = {
    fontFamily: 'Inter',
    headingFontFamily: 'Inter',
    baseSize: 16,
    h1Size: 32,
    h2Size: 24,
    h3Size: 20,
    h4Size: 18,
    h5Size: 16,
    h6Size: 14,
    lineHeight: 1.6,
    paragraphSpacing: 1.5,
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    backgroundColor: '#ffffff',
    margin: 40,
    paperSize: 'A4',
    customWidth: 210,
    customHeight: 297,
};
