"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { EditorToolbar } from "./EditorToolbar";
import { FontSize } from "@/lib/tiptap-extensions/fontSize";
import { CodeBlockHighlight } from "@/lib/tiptap-extensions/codeBlockHighlight";
import { Video } from "@/lib/tiptap-extensions/video";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function TipTapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  className,
}: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        horizontalRule: false,
        codeBlock: false, // Disable default code block
      }),
      TextStyle,
      FontSize,
      CodeBlockHighlight,
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "my-8 border-gray-300 dark:border-gray-700",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Video.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className={className}>
      <EditorToolbar editor={editor} />
      <div className="border border-gray-300 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-900 max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 [&::-webkit-scrollbar-thumb]:dark:hover:bg-gray-500">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
