'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Youtube as YoutubeIcon, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({ openOnClick: false }),
            Youtube.configure({ controls: false }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[300px]',
            },
        },
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addYoutube = () => {
        const url = window.prompt('Enter YouTube URL');
        if (url) {
            editor.commands.setYoutubeVideo({ src: url });
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="border rounded-md">
            <div className="bg-gray-100 p-2 flex flex-wrap gap-2 border-b">
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-200' : ''}>
                    <Bold className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-200' : ''}>
                    <Italic className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={setLink} className={editor.isActive('link') ? 'bg-gray-200' : ''}>
                    <LinkIcon className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}>
                    <List className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}>
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}>
                    <Quote className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={addImage}>
                    <ImageIcon className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={addYoutube}>
                    <YoutubeIcon className="w-4 h-4" />
                </Button>
                <div className="flex-1" />
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().undo().run()}>
                    <Undo className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().redo().run()}>
                    <Redo className="w-4 h-4" />
                </Button>
            </div>
            <EditorContent editor={editor} className="p-4" />
        </div>
    );
}
