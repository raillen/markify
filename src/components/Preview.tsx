import { useRef, useImperativeHandle, forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PAPER_DIMENSIONS } from '../types';
import type { StyleConfig } from '../types';

export interface PreviewHandle {
    exportPdf: () => Promise<void>;
    exportOdt: () => Promise<void>;
}

interface PreviewProps {
    markdown: string;
    styles: StyleConfig;
    isMobile?: boolean;
}

const Preview = forwardRef<PreviewHandle, PreviewProps>(({ markdown, styles, isMobile = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const getDimensions = () => {
        if (styles.paperSize === 'Custom') {
            return { width: styles.customWidth, height: styles.customHeight };
        }
        return PAPER_DIMENSIONS[styles.paperSize];
    };

    const { width, height } = getDimensions();

    useImperativeHandle(ref, () => ({
        exportPdf: async () => {
            if (!containerRef.current) return;

            // @ts-ignore
            if (typeof window.html2pdf === 'undefined') {
                alert('PDF library is loading. Please try again in a moment.');
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
                await window.html2pdf().set(opt).from(element).save();
            } catch (err) {
                console.error('PDF Export Error:', err);
                throw err;
            }
        },
        exportOdt: async () => {
            if (!containerRef.current) return;

            const content = containerRef.current.innerHTML;
            const fullHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: ${styles.fontFamily}, sans-serif; 
              color: ${styles.textColor}; 
              background-color: ${styles.backgroundColor};
              padding: ${styles.margin}px;
            }
            h1 { font-size: ${styles.h1Size}px; font-weight: bold; border-bottom: 1px solid #eee; }
            h2 { font-size: ${styles.h2Size}px; font-weight: bold; }
            h3 { font-size: ${styles.h3Size}px; font-weight: bold; }
            p { margin-bottom: ${styles.paragraphSpacing}em; line-height: ${styles.lineHeight}; }
          </style>
        </head>
        <body>${content}</body>
        </html>
      `;

            const blob = new Blob([fullHtml], { type: 'application/vnd.oasis.opendocument.text' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'document.odt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }));

    // Responsive container styles
    const containerStyle: React.CSSProperties = {
        fontFamily: styles.fontFamily === 'system-ui' ? 'inherit' : `'${styles.fontFamily}', sans-serif`,
        fontSize: isMobile ? `${Math.max(styles.baseSize - 2, 12)}px` : `${styles.baseSize}px`,
        lineHeight: styles.lineHeight,
        color: styles.textColor,
        backgroundColor: styles.backgroundColor,
        padding: isMobile ? '24px 16px' : `60px ${styles.margin}px`,
        width: isMobile ? '100%' : `${width}mm`,
        maxWidth: isMobile ? '100%' : undefined,
        minHeight: isMobile ? 'auto' : `${height}mm`,
        margin: '0 auto',
        boxShadow: isMobile ? 'none' : '0 10px 40px rgba(0,0,0,0.08)',
        borderRadius: isMobile ? '0' : undefined,
    };

    // Responsive heading sizes
    const mobileScale = 0.75;
    const h1Size = isMobile ? Math.round(styles.h1Size * mobileScale) : styles.h1Size;
    const h2Size = isMobile ? Math.round(styles.h2Size * mobileScale) : styles.h2Size;
    const h3Size = isMobile ? Math.round(styles.h3Size * mobileScale) : styles.h3Size;
    const h4Size = isMobile ? Math.round(styles.h4Size * mobileScale) : styles.h4Size;
    const h5Size = isMobile ? Math.round(styles.h5Size * mobileScale) : styles.h5Size;
    const h6Size = isMobile ? Math.round(styles.h6Size * mobileScale) : styles.h6Size;

    return (
        <div className="w-full flex justify-center">
            <div
                ref={containerRef}
                id="document-preview"
                style={containerStyle}
                className="preview-content bg-white rounded-md shadow-sm transition-all duration-300 overflow-hidden relative"
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
          #document-preview h1 { font-size: ${h1Size}px; margin-bottom: 0.8em; font-weight: 700; color: ${styles.textColor}; border-bottom: 1px solid #eee; padding-bottom: 0.3em; word-wrap: break-word; }
          #document-preview h2 { font-size: ${h2Size}px; margin-bottom: 0.6em; font-weight: 600; color: ${styles.textColor}; margin-top: 1.5em; word-wrap: break-word; }
          #document-preview h3 { font-size: ${h3Size}px; margin-bottom: 0.5em; font-weight: 600; color: ${styles.textColor}; margin-top: 1.2em; word-wrap: break-word; }
          #document-preview h4 { font-size: ${h4Size}px; margin-bottom: 0.5em; font-weight: 600; color: ${styles.textColor}; margin-top: 1.1em; word-wrap: break-word; }
          #document-preview h5 { font-size: ${h5Size}px; margin-bottom: 0.5em; font-weight: 600; color: ${styles.textColor}; margin-top: 1em; word-wrap: break-word; }
          #document-preview h6 { font-size: ${h6Size}px; margin-bottom: 0.5em; font-weight: 600; color: ${styles.textColor}; margin-top: 1em; word-wrap: break-word; }
          #document-preview p { margin-bottom: ${styles.paragraphSpacing}em; line-height: ${styles.lineHeight}; word-wrap: break-word; }
          #document-preview a { color: ${styles.accentColor}; text-decoration: underline; word-break: break-word; }
          #document-preview code { background: #f1f5f9; padding: 0.2em 0.4em; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.85em; word-break: break-word; }
          #document-preview pre { background: #1e293b; color: #f8fafc; padding: ${isMobile ? '1em' : '1.5em'}; border-radius: 8px; overflow-x: auto; margin-bottom: 1.5em; font-size: ${isMobile ? '0.8em' : '0.9em'}; }
          #document-preview pre code { background: transparent; padding: 0; border-radius: 0; color: inherit; font-size: inherit; }
          #document-preview table { width: 100%; border-collapse: collapse; margin-bottom: 1.5em; font-size: ${isMobile ? '0.85em' : '1em'}; display: block; overflow-x: auto; }
          #document-preview th, #document-preview td { border: 1px solid #e2e8f0; padding: ${isMobile ? '8px' : '12px'}; text-align: left; white-space: nowrap; }
          #document-preview th { background: #f8fafc; font-weight: 600; }
          #document-preview ul, #document-preview ol { padding-left: ${isMobile ? '1.25em' : '1.5em'}; margin-bottom: 1em; }
          #document-preview li { margin-bottom: 0.25em; }
          #document-preview blockquote { border-left: 4px solid ${styles.accentColor}; padding-left: 1em; margin: 1em 0; color: #6b7280; font-style: italic; }
          #document-preview img { max-width: 100%; height: auto; border-radius: 8px; }
          #document-preview hr { border: none; border-top: 1px solid #e5e7eb; margin: 2em 0; }
        `}} />
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdown}
                </ReactMarkdown>
            </div>
        </div>
    );
});

export default Preview;
