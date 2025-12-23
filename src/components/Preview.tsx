import { useRef, useImperativeHandle, forwardRef } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { toPng } from 'html-to-image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PAPER_DIMENSIONS } from '../types';
import type { StyleConfig } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language } from '../i18n/translations';

export interface PreviewHandle {
    exportPdf: () => Promise<void>;
    exportOdt: () => Promise<void>;
    exportPng: () => Promise<void>;
    exportHtml: () => Promise<void>;
    exportMd: () => Promise<void>;
}

interface PreviewProps {
    markdown: string;
    styles: StyleConfig;
    isMobile?: boolean;
    language: Language;
}

const Preview = forwardRef<PreviewHandle, PreviewProps>(({ markdown, styles, isMobile = false, language }, ref) => {
    const t = TRANSLATIONS[language];
    const containerRef = useRef<HTMLDivElement>(null);

    const getDimensions = () => {
        if (styles.paperSize === 'Custom') {
            return { width: styles.customWidth, height: styles.customHeight };
        }
        return PAPER_DIMENSIONS[styles.paperSize];
    };

    const { width, height } = getDimensions();

    const downloadFile = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', filename);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();

        // Use a small delay for removal to ensure Chrome processes the click
        setTimeout(() => {
            document.body.removeChild(link);
        }, 100);
    };

    useImperativeHandle(ref, () => ({
        exportPdf: async () => {
            if (!containerRef.current) return;

            // @ts-ignore
            if (typeof window.html2pdf === 'undefined') {
                alert(t.pdfLoading);
                return;
            }

            const element = containerRef.current;
            const opt = {
                margin: 0,
                filename: 'document.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: styles.backgroundColor,
                    logging: false
                },
                jsPDF: {
                    unit: 'mm',
                    format: styles.paperSize === 'Custom' ? [styles.customWidth, styles.customHeight] : styles.paperSize.toLowerCase(),
                    orientation: 'portrait'
                }
            };

            try {
                // @ts-ignore
                const pdfGenerator = window.html2pdf().set(opt).from(element);
                const blob = await pdfGenerator.output('blob');
                const url = URL.createObjectURL(blob);
                downloadFile(url, 'document.pdf');
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error('PDF Export Error:', err);
                throw err;
            }
        },
        exportOdt: async () => {
            if (!containerRef.current) return;

            const lines = markdown.split('\n');
            const children = lines.map(line => {
                if (line.startsWith('# ')) {
                    return new Paragraph({
                        text: line.replace('# ', ''),
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 200 },
                    });
                }
                if (line.startsWith('## ')) {
                    return new Paragraph({
                        text: line.replace('## ', ''),
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 150 },
                    });
                }
                if (line.startsWith('### ')) {
                    return new Paragraph({
                        text: line.replace('### ', ''),
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 150, after: 100 },
                    });
                }
                if (line.trim() === '') {
                    return new Paragraph({ text: '' });
                }
                return new Paragraph({
                    children: [new TextRun(line)],
                    spacing: { after: 120 },
                });
            });

            const doc = new Document({
                sections: [{
                    properties: {},
                    children: children,
                }],
            });

            try {
                const blob = await Packer.toBlob(doc);
                const url = URL.createObjectURL(blob);
                downloadFile(url, 'document.docx');
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error('Document Export Error:', err);
                alert(t.docError);
            }
        },
        exportPng: async () => {
            if (!containerRef.current) return;
            try {
                // Primary attempt with fonts and cache busting
                const dataUrl = await toPng(containerRef.current, {
                    backgroundColor: styles.backgroundColor,
                    pixelRatio: 2,
                    cacheBust: true,
                });
                downloadFile(dataUrl, 'document.png');
            } catch (err) {
                console.warn('Primary PNG Export failed (likely CORS or Font parsing), retrying with skipFonts...', err);
                try {
                    // Fallback attempt skipping problematic font parsing
                    const dataUrl = await toPng(containerRef.current, {
                        backgroundColor: styles.backgroundColor,
                        pixelRatio: 2,
                        skipFonts: true,
                    });
                    downloadFile(dataUrl, 'document.png');
                } catch (retryErr) {
                    console.error('PNG Export Error:', retryErr);
                    alert(t.pngCorsError);
                }
            }
        },
        exportHtml: async () => {
            if (!containerRef.current) return;
            const content = containerRef.current.innerHTML;
            const fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${t.htmlTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 20px; background: #f8fafc; font-family: 'Inter', sans-serif; display: flex; justify-content: center; }
        .page { 
            background: ${styles.backgroundColor}; 
            color: ${styles.textColor}; 
            padding: 60px ${styles.margin}px; 
            width: ${width}mm; 
            min-height: ${height}mm;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            line-height: ${styles.lineHeight};
            font-size: ${styles.baseSize}px;
        }
        h1 { font-family: 'Outfit', sans-serif; font-size: ${styles.h1Size}px; margin-bottom: 1em; }
        h2 { font-family: 'Outfit', sans-serif; font-size: ${styles.h2Size}px; margin-top: 1.5em; }
        h3 { font-family: 'Outfit', sans-serif; font-size: ${styles.h3Size}px; margin-top: 1.25em; }
        p { margin-bottom: ${styles.paragraphSpacing}em; }
        a { color: ${styles.accentColor || '#3b82f6'}; }
        code { background: #f1f5f9; padding: 0.2em 0.4em; border-radius: 4px; font-family: 'JetBrains Mono', monospace; color: #ef4444; }
        pre { background: #1e293b; color: #f8fafc; padding: 1.25rem; border-radius: 8px; overflow-x: auto; }
        pre code { background: transparent !important; color: inherit; padding: 0; }
        blockquote { border-left: 4px solid ${styles.accentColor || '#3b82f6'}; padding-left: 1.25em; color: #64748b; font-style: italic; background: #f8fafc; padding-top: 0.5rem; padding-bottom: 0.5rem; }
    </style>
</head>
<body>
    <div class="page">${content}</div>
</body>
</html>`;
            const blob = new Blob([fullHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            downloadFile(url, 'document.html');
            URL.revokeObjectURL(url);
        },
        exportMd: async () => {
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            downloadFile(url, 'document.md');
            URL.revokeObjectURL(url);
        }
    }));

    // Responsive container styles with scaling logic for mobile
    const containerStyle: React.CSSProperties = {
        fontFamily: styles.fontFamily === 'system-ui' ? 'inherit' : `'${styles.fontFamily}', sans-serif`,
        fontSize: `${styles.baseSize}px`,
        lineHeight: styles.lineHeight,
        color: styles.textColor,
        backgroundColor: styles.backgroundColor,
        padding: isMobile ? '24px 16px' : `60px ${styles.margin}px`,
        width: `${width}mm`,
        minHeight: `${height}mm`,
        margin: '0 auto',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
        borderRadius: '2px',
        transform: isMobile ? 'scale(var(--preview-scale, 1))' : 'none',
        transformOrigin: 'top center',
    };

    // Calculate scale factor based on screen width
    const scaleFactor = isMobile ? (window.innerWidth - 32) / (width * 3.78) : 1; // 1mm ~= 3.78px

    return (
        <div className="w-full flex justify-center py-4" style={{ '--preview-scale': scaleFactor } as any}>
            <div
                ref={containerRef}
                id="document-preview"
                style={containerStyle}
                className="preview-content bg-white transition-all duration-500 overflow-hidden relative origin-top"
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
#document-preview h1 { font-family: 'Outfit', sans-serif; font-size: ${styles.h1Size}px; margin-bottom: 1em; font-weight: 700; color: ${styles.textColor}; word-wrap: break-word; line-height: 1.1; }
#document-preview h2 { font-family: 'Outfit', sans-serif; font-size: ${styles.h2Size}px; margin-bottom: 0.75em; font-weight: 600; color: ${styles.textColor}; margin-top: 1.5em; word-wrap: break-word; }
#document-preview h3 { font-family: 'Outfit', sans-serif; font-size: ${styles.h3Size}px; margin-bottom: 0.5em; font-weight: 600; color: ${styles.textColor}; margin-top: 1.25em; word-wrap: break-word; }
#document-preview p { margin-bottom: ${styles.paragraphSpacing}em; line-height: ${styles.lineHeight}; word-wrap: break-word; }
#document-preview a { color: var(--accent-primary); text-decoration: none; border-bottom: 1px solid var(--accent-primary); transition: all 0.2s; opacity: 0.8; }
#document-preview a:hover { opacity: 1; border-bottom-width: 2px; }
#document-preview code { 
    background: #f1f5f9; 
    padding: 0.2em 0.4em; 
    border-radius: 4px; 
    font-family: 'JetBrains Mono', monospace; 
    font-size: 0.85em;
    color: #ef4444;
}
#document-preview pre { 
    background: #1e293b; 
    color: #f8fafc; 
    padding: 1.25rem; 
    border-radius: 8px; 
    overflow-x: auto; 
    margin: 1.5em 0;
    line-height: 1.5;
    border: 1px solid rgba(255,255,255,0.05);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
#document-preview pre code { 
    background: transparent !important; 
    padding: 0; 
    color: inherit; 
    font-size: 0.85rem;
    border-radius: 0;
}
#document-preview blockquote { 
    border-left: 4px solid var(--accent-primary); 
    padding-left: 1.25em; 
    margin: 1.5em 0; 
    color: #64748b; 
    font-style: italic;
    background: #f8fafc;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}
#document-preview hr { border: none; border-top: 1px solid #e2e8f0; margin: 2.5em 0; }
`}} />
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdown}
                </ReactMarkdown>
            </div>
        </div>
    );
});

export default Preview;
