"use client";
import { useEffect, useState } from "react";
import {
  EditorRoot, EditorContent, ImageResizer,
  handleCommandNavigation, handleImageDrop, handleImagePaste,
  EditorCommand, EditorCommandEmpty, EditorCommandItem, EditorCommandList,
  EditorBubble, EditorBubbleItem,
} from "novel";
import { Link, Unlink } from "lucide-react";
import { defaultExtensions } from "@/lib/novels/novelExtensions";
import { slashCommand, suggestionItems } from "@/lib/novels/slashCommand";
import { uploadFn } from "@/lib/novels/uploadFn";

const extensions = [...defaultExtensions, slashCommand];

export default function NovelEditor({ onChange, initialContent: initialContentProp }) {
  const [initialContent, setInitialContent] = useState(null);

  useEffect(() => {
    if (initialContentProp) {
      setInitialContent(initialContentProp);
      return;
    }
    const saved = typeof window !== "undefined" ? localStorage.getItem("novel-content") : null;
    setInitialContent(saved ? JSON.parse(saved) : { type: "doc", content: [{ type: "paragraph" }] });
  }, []);

  if (!initialContent) return null;

  return (
    <EditorRoot>
      <EditorContent
        initialContent={initialContent}
        extensions={extensions}
        className="relative min-h-[400px] w-full bg-white rounded-lg p-4"
        editorProps={{
          handleDOMEvents: { keydown: (_view, event) => handleCommandNavigation(event) },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
          attributes: { class: "prose prose-lg focus:outline-none max-w-full text-gray-900" },
        }}
        onUpdate={({ editor }) => {
          const json = editor.getJSON();
          localStorage.setItem("novel-content", JSON.stringify(json));
          if (typeof onChange === "function") {
            const html = editor.getHTML();
            onChange(html, json);
          }
        }}
        slotAfter={<ImageResizer />}
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
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border bg-background px-1 py-2 shadow-md">
          <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                key={item.title}
                value={item.title}
                onCommand={(val) => item.command(val)}
                className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background">{item.icon}</div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
      </EditorContent>
    </EditorRoot>
  );
}