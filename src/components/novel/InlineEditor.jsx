"use client";
import { useEffect, useState } from "react";
import {
  EditorRoot, EditorContent,
  handleCommandNavigation, handleImageDrop, handleImagePaste,
  EditorBubble, EditorBubbleItem,
} from "novel";
import { Link, Unlink } from "lucide-react";
import { defaultExtensions } from "@/lib/novels/novelExtensions";
import { slashCommand, suggestionItems } from "@/lib/novels/slashCommand";
import { uploadFn } from "@/lib/novels/uploadFn";

const extensions = [...defaultExtensions, slashCommand];

export default function InlineEditor({ onChange, placeholder = "Type here...", className = "" }) {
  const [initialContent, setInitialContent] = useState(null);

  useEffect(() => {
    setInitialContent({ type: "doc", content: [{ type: "paragraph" }] });
  }, []);

  if (!initialContent) return null;

  return (
    <EditorRoot>
      <EditorContent
        initialContent={initialContent}
        extensions={extensions}
        className={`relative min-h-[60px] w-full bg-white rounded-lg p-3 border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 ${className}`}
        editorProps={{
          handleDOMEvents: { keydown: (_view, event) => handleCommandNavigation(event) },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
          attributes: { 
            class: "prose prose-sm focus:outline-none max-w-full",
            "data-placeholder": placeholder
          },
        }}
        onUpdate={({ editor }) => {
          if (typeof onChange === "function") {
            const html = editor.getHTML();
            onChange(html);
          }
        }}
      >
        <EditorBubble className="flex gap-2 rounded-md border bg-background p-1 shadow">
          <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleBold().run()} className="px-2 py-1 text-sm hover:bg-accent rounded">B</EditorBubbleItem>
          <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 text-sm hover:bg-accent rounded italic">I</EditorBubbleItem>
          <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 text-sm hover:bg-accent rounded underline">U</EditorBubbleItem>
          <EditorBubbleItem
            onSelect={(editor) => {
              const url = prompt("Enter URL");
              if (!url) return;
              editor.chain().focus().setLink({ href: url }).run();
            }}
            className="px-2 py-1 text-sm hover:bg-accent rounded flex items-center gap-1"
          >
            <Link size={16} /> Link
          </EditorBubbleItem>
          <EditorBubbleItem
            onSelect={(editor) => editor.chain().focus().unsetLink().run()}
            className="px-2 py-1 text-sm hover:bg-accent rounded flex items-center gap-1"
          >
            <Unlink size={16} /> Unlink
          </EditorBubbleItem>
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
}

