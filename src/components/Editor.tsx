import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import {
    Bold, Italic, List, ListOrdered, Quote, Heading1, Heading2,
    Terminal
} from 'lucide-react';

interface EditorProps {
    markdown: string;
    setMarkdown: (value: string) => void;
    isMobile?: boolean;
}

const ToolbarButton = ({
    onClick,
    active,
    icon,
    label
}: {
    onClick: () => void;
    active?: boolean;
    icon: React.ReactNode;
    label: string
}) => (
    <button
        onClick={onClick}
        title={label}
        className={`
            p-1.5 rounded-[0.4rem] transition-all duration-200
            ${active
                ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}
        `}
    >
        {icon}
    </button>
);

const Editor: React.FC<EditorProps> = ({ markdown, setMarkdown, isMobile = false }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Markdown.configure({
                html: false,
                tightLists: true,
                bulletListMarker: '-',
            }),
        ],
        content: markdown,
        onUpdate: ({ editor }) => {
            const content = (editor.storage as any).markdown.getMarkdown();
            setMarkdown(content);
        },
    });

    useEffect(() => {
        if (editor && markdown !== (editor.storage as any).markdown.getMarkdown()) {
            editor.commands.setContent(markdown, { emitUpdate: false });
        }
    }, [markdown, editor]);

    if (!editor) return null;

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-zinc-200 bg-zinc-50 z-10 transition-colors">
                <div className="flex items-center gap-1 pr-1.5 border-r border-zinc-200 mr-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive('bold')}
                        icon={<Bold size={14} />}
                        label="Negrito"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive('italic')}
                        icon={<Italic size={14} />}
                        label="Itálico"
                    />
                </div>

                <div className="flex items-center gap-1 pr-1.5 border-r border-zinc-200 mr-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        active={editor.isActive('heading', { level: 1 })}
                        icon={<Heading1 size={14} />}
                        label="Título 1"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        active={editor.isActive('heading', { level: 2 })}
                        icon={<Heading2 size={14} />}
                        label="Título 2"
                    />
                </div>

                <div className="flex items-center gap-1 pr-1.5 border-r border-zinc-200 mr-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive('bulletList')}
                        icon={<List size={14} />}
                        label="Lista"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        active={editor.isActive('orderedList')}
                        icon={<ListOrdered size={14} />}
                        label="Lista Numerada"
                    />
                </div>

                <div className="flex items-center gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        active={editor.isActive('codeBlock')}
                        icon={<Terminal size={14} />}
                        label="Código"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        active={editor.isActive('blockquote')}
                        icon={<Quote size={14} />}
                        label="Citação"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .tiptap-wrapper { height: 100%; overflow-y: auto; }
                    .tiptap {
                        min-height: 100%;
                        padding: ${isMobile ? '1.5rem 1rem' : '3rem 4rem'};
                        outline: none;
                        font-family: 'Inter', sans-serif;
                    }
                    .tiptap p { margin-bottom: 1.25em; line-height: 1.7; font-size: 0.95rem; color: inherit; }
                    .tiptap h1 { font-family: 'Outfit', sans-serif; font-size: 2.25rem; font-weight: 700; margin-bottom: 0.75em; line-height: 1.2; letter-spacing: -0.02em; }
                    .tiptap h2 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 600; margin-top: 2em; margin-bottom: 0.5em; letter-spacing: -0.01em; }
                    .tiptap h3 { font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 600; margin-top: 1.5em; }
                    .tiptap ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.25em; }
                    .tiptap ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1.25em; }
                    .tiptap blockquote { border-left: 4px solid var(--accent-primary); padding-left: 1.25em; font-style: italic; color: #64748b; margin: 1.5em 0; background: #f8fafc; padding-top: 0.5rem; padding-bottom: 0.5rem; }
                    .tiptap code { background: #f1f5f9; padding: 0.2em 0.4em; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.85em; color: #ef4444; }
                    .tiptap pre { background: #1e293b; color: #f8fafc; padding: 1.25rem; border-radius: 0.5rem; margin: 1.5em 0; overflow-x: auto; }
                    .tiptap pre code { background: transparent !important; padding: 0; color: inherit; font-size: 0.85rem; border-radius: 0; }
                    .tiptap-wrapper::-webkit-scrollbar { width: 4px; }
                    .tiptap-wrapper::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                `}} />
                <div className="tiptap-wrapper custom-scrollbar h-full">
                    <EditorContent editor={editor} className="h-full" />
                </div>
            </div>
        </div>
    );
};

export default Editor;
