import React from 'react';

interface EditorProps {
    markdown: string;
    setMarkdown: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ markdown, setMarkdown }) => {
    return (
        <div className="h-full w-full relative bg-white dark:bg-zinc-950">
            <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="# Start writing your markdown here..."
                className="absolute inset-0 w-full h-full p-8 font-mono text-sm resize-none outline-none bg-transparent text-gray-700 dark:text-zinc-300 leading-relaxed selection:bg-blue-100 dark:selection:bg-blue-900/50 placeholder:text-gray-300 dark:placeholder:text-zinc-700"
            />
        </div>
    );
};

export default Editor;
