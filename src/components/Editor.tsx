import React from 'react';

interface EditorProps {
    markdown: string;
    setMarkdown: (value: string) => void;
    isMobile?: boolean;
}

const Editor: React.FC<EditorProps> = ({ markdown, setMarkdown, isMobile = false }) => {
    return (
        <div className="h-full w-full relative bg-white dark:bg-zinc-950">
            <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="# Start writing your markdown here..."
                className={`absolute inset-0 w-full h-full font-mono text-sm resize-none outline-none bg-transparent text-gray-700 dark:text-zinc-300 leading-relaxed selection:bg-blue-100 dark:selection:bg-blue-900/50 placeholder:text-gray-300 dark:placeholder:text-zinc-700 ${isMobile ? 'p-4 text-base' : 'p-8'
                    }`}
                style={{
                    // Prevent zoom on iOS when focusing input
                    fontSize: isMobile ? '16px' : '14px',
                }}
            />
        </div>
    );
};

export default Editor;
