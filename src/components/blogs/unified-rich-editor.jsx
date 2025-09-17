"use client";
import { defaultEditorContent } from "@/lib/novels/content";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  ImageResizer,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Tweet } from "react-tweet";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "../novel/taiwlind/extensions";
import { ColorSelector } from "../novel/taiwlind/selectors/color-selector";
import { LinkSelector } from "../novel/taiwlind/selectors/link-selector";
import { MathSelector } from "../novel/taiwlind/selectors/math-selector";
import { NodeSelector } from "../novel/taiwlind/selectors/node-selector";
import { Separator } from "../novel/taiwlind/ui/separator";

import GenerativeMenuSwitch from "../novel/taiwlind/generative/generative-menu-switch";
import { uploadFn } from "../novel/taiwlind/image-upload";
import { TextButtons } from "../novel/taiwlind/selectors/text-buttons";
import { slashCommand, suggestionItems } from "../novel/taiwlind/slash-command";

import hljs from "highlight.js";

const extensions = [...defaultExtensions, slashCommand];

const ensureTweetAnchors = (content) => {
  try {
    const doc = new DOMParser().parseFromString(content, "text/html");

    // Helper to create an anchor for a tweet URL if not already present
    const appendAnchorIfMissing = (el, href) => {
      if (!href) return;
      const hasAnchor = el.querySelector && el.querySelector('a[href*="twitter.com/"] , a[href*="x.com/"]');
      if (hasAnchor) return;
      const a = doc.createElement('a');
      a.setAttribute('href', href);
      a.textContent = href;
      el.appendChild(a);
    };

    // 1) Explicit tweet nodes from extensions (common patterns)
    // data-type="tweet" with data-src or data-tweet-id
    doc.querySelectorAll('[data-type="tweet"]').forEach((node) => {
      const src = node.getAttribute('data-src');
      const id = node.getAttribute('data-tweet-id');
      const href = src || (id ? `https://x.com/i/web/status/${id}` : null);
      appendAnchorIfMissing(node, href);
    });

    // 2) Generic nodes with data-src that points to twitter/x status
    doc.querySelectorAll('[data-src]').forEach((node) => {
      const src = node.getAttribute('data-src') || '';
      if (/https?:\/\/(?:www\.)?(twitter\.com|x\.com)\/[^\s/]+\/status\/\d+/.test(src)) {
        appendAnchorIfMissing(node, src);
      }
    });

    // 3) Placeholder divs with data-tweet-id (created by our viewer fallback)
    doc.querySelectorAll('[data-tweet-id]').forEach((node) => {
      const id = node.getAttribute('data-tweet-id');
      if (id) appendAnchorIfMissing(node, `https://x.com/i/web/status/${id}`);
    });

    return new XMLSerializer().serializeToString(doc);
  } catch (_e) {
    return content;
  }
};

const highlightCodeblocks = (content) => {
  const doc = new DOMParser().parseFromString(content, "text/html");
  doc.querySelectorAll("pre code").forEach((el) => {
    // @ts-expect-error - highlightElement method exists but not in types definition
    // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
    hljs.highlightElement(el);
  });
  return new XMLSerializer().serializeToString(doc);
};

const UnifiedRichEditor = ({ 
  onChange, 
  placeholder = "Start typing...",
  initialValue = "",
  minHeight = "150px",
  fieldType = "general", // 'title', 'description', 'tags', 'content', 'general'
  showWordCount = true,
  showSaveStatus = false,
  enableImages = true,
  enableSlashCommands = true,
  className = "",
  padding = "1rem",
}) => {
  const [initialContent, setInitialContent] = useState(null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState(0);
  const editorContainerRef = useRef(null);

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const json = editor.getJSON();
    const html = highlightCodeblocks(editor.getHTML());
    const processed = ensureTweetAnchors(html);
    const plainText = editor.getText();
    const wordsCount = editor.storage.characterCount.words();
    
    setCharsCount(wordsCount);
    setSaveStatus("Saved");
    
    // Pass the content back to the parent form
    if (onChange) {
      onChange(processed, plainText, wordsCount);
    }
  }, 300);

  useEffect(() => {
    // Set initial content based on initialValue or field type
    if (initialValue && initialValue.trim()) {
      try {
        // Try to parse as JSON first (if it's editor JSON content)
        const parsedContent = JSON.parse(initialValue);
        setInitialContent(parsedContent);
      } catch (e) {
        // If not JSON, treat as HTML or plain text
        setInitialContent(initialValue);
      }
    } else {
      // For different field types, set appropriate empty content
      switch (fieldType) {
        case 'title':
        case 'description':
        case 'tags':
        case 'content':
          setInitialContent('<p></p>');
          break;
        default:
          setInitialContent(defaultEditorContent);
      }
    }
  }, [initialValue, fieldType]);

  if (!initialContent) return null;

  // Configure editor class based on field type and custom styling
  const getEditorClass = () => {
    // Force a light, readable theme in the editor and ensure headings are clear
    const baseClass = "prose prose-headings:font-title font-default focus:outline-none max-w-full text-gray-800 prose-headings:text-gray-900";
    
    // If custom className is provided, use it instead of default styling
    if (className && className.includes('text-')) {
      return `${baseClass} ${className.replace(/border-none|shadow-none/g, '').trim()}`;
    }
    
    switch (fieldType) {
      case 'title':
        return `${baseClass} prose-2xl font-bold`;
      case 'description':
        return `${baseClass} prose-lg`;
      case 'tags':
        return `${baseClass} prose-sm`;
      case 'content':
        // Properly differentiate between heading sizes
        return `${baseClass} prose-lg prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-headings:font-bold`;
      default:
        return `${baseClass} prose-lg`;
    }
  };

  // Configure container class based on field type and custom className
  const getContainerClass = () => {
    // If custom className includes "border-none" or "shadow-none", use minimal styling
    const isMinimalStyle = className.includes('border-none') || className.includes('shadow-none');
    
    if (isMinimalStyle) {
      return "w-full bg-transparent";
    }
    
    switch (fieldType) {
      case 'title':
        return "w-full border-muted bg-background rounded-lg border shadow-sm";
      case 'description':
        return "w-full border-muted bg-background rounded-lg border shadow-sm";
      case 'tags':
        return "w-full border-muted bg-background rounded-lg border shadow-sm";
      case 'content':
        return "w-full max-w-screen-lg border-muted bg-background sm:rounded-lg sm:border sm:shadow-lg";
      default:
        return "w-full border-muted bg-background rounded-lg border shadow-sm";
    }
  };

  const shouldShowSlashCommands = enableSlashCommands;
  const displayWordCount = showWordCount && charsCount > 0;
  const displaySaveStatus = showSaveStatus;
  const isMinimalStyle = className.includes('border-none') || className.includes('shadow-none');
  const shouldShowToolbar = !isMinimalStyle && (fieldType === 'content' || fieldType === 'description');

  const isFullHeight = minHeight === "100%" || className.includes('h-full');
  const containerStyle = isFullHeight ? { height: '100%' } : { minHeight };
  const editorStyle = isFullHeight ? 
    `height: 100%; padding: ${padding}; overflow-y: visible;` : 
    `min-height: ${minHeight}; padding: ${padding};`;

  return (
    <div ref={editorContainerRef} className={`relative w-full ${className} ${isFullHeight ? 'h-full flex flex-col' : ''}`}>
      {(displayWordCount || displaySaveStatus) && (
        <div className="flex absolute right-3 top-3 z-10 gap-2">
          {displaySaveStatus && (
            <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
              {saveStatus}
            </div>
          )}
          {displayWordCount && (
            <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
              {charsCount} Words
            </div>
          )}
        </div>
      )}
      
      <EditorRoot className={isFullHeight ? 'flex-1 flex flex-col h-full' : ''}>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className={`relative ${getContainerClass()} ${isFullHeight ? 'flex-1 flex flex-col' : ''}`}
          style={containerStyle}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => {
                if (shouldShowSlashCommands) {
                  handleCommandNavigation(event);
                }
              },
            },
            handlePaste: enableImages ? 
              (view, event) => handleImagePaste(view, event, uploadFn) : 
              undefined,
            handleDrop: enableImages ? 
              (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn) : 
              undefined,
            attributes: {
              class: `${getEditorClass()} ${isFullHeight ? 'h-full' : ''}`,
              "data-placeholder": placeholder,
              style: editorStyle,
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={enableImages ? <ImageResizer /> : null}
        >
          {shouldShowSlashCommands && (
            <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
              <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
              <EditorCommandList>
                {suggestionItems.map((item) => (
                  <EditorCommandItem
                    value={item.title}
                    onCommand={(val) => item.command(val)}
                    className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                    key={item.title}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </EditorCommandItem>
                ))}
              </EditorCommandList>
            </EditorCommand>
          )}

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
        
      </EditorRoot>
      
      {/* Fixed Bottom Toolbar */}
      {shouldShowToolbar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-center py-2 px-4">
            <div className="flex items-center space-x-1 rounded-md p-1">
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />
              <Separator orientation="vertical" className="h-6 mx-1" />
              <LinkSelector open={openLink} onOpenChange={setOpenLink} />
              <Separator orientation="vertical" className="h-6 mx-1" />
              <MathSelector />
              <Separator orientation="vertical" className="h-6 mx-1" />
              <TextButtons />
              <Separator orientation="vertical" className="h-6 mx-1" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedRichEditor;
