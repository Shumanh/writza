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
import { useEffect, useState } from "react";
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

const FlexibleRichEditor = ({ 
  onChange, 
  placeholder = "Start typing...",
  initialValue = "",
  minHeight = "100px",
  fieldType = "general", // 'title', 'description', 'tags', 'content', 'general'
  showWordCount = false,
  enableImages = true,
  enableSlashCommands = true,
  className = ""
}) => {
  const [initialContent, setInitialContent] = useState(null);
  const [charsCount, setCharsCount] = useState(0);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);

  // Configure extensions based on field type
  const getExtensionsForFieldType = (type) => {
    const baseExtensions = [...defaultExtensions];
    
    switch (type) {
      case 'title':
        // For titles, we might want simpler formatting
        return baseExtensions.filter(ext => 
          !['CodeBlockLowlight', 'HorizontalRule', 'TaskList', 'Table'].includes(ext.name)
        );
      case 'description':
        // For descriptions, moderate formatting
        return baseExtensions.filter(ext => 
          !['CodeBlockLowlight', 'Table'].includes(ext.name)
        );
      case 'tags':
        // For tags, minimal formatting
        return baseExtensions.filter(ext => 
          ['Bold', 'Italic', 'Link'].includes(ext.name) || !ext.name
        );
      case 'content':
        // Full feature set for content
        return enableSlashCommands ? [...baseExtensions, slashCommand] : baseExtensions;
      default:
        return baseExtensions;
    }
  };

  const fieldExtensions = getExtensionsForFieldType(fieldType);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const html = highlightCodeblocks(editor.getHTML());
    const wordsCount = editor.storage.characterCount.words();
    const plainText = editor.getText();
    setCharsCount(wordsCount);
    
    // Pass the HTML content back to the parent form
    if (onChange) {
      onChange(html, plainText, wordsCount);
    }
  }, 300);

  useEffect(() => {
    // Set initial content based on initialValue or default
    if (initialValue && initialValue.trim()) {
      setInitialContent(initialValue);
    } else {
      // For different field types, set appropriate empty content
      switch (fieldType) {
        case 'title':
        case 'description':
        case 'tags':
          setInitialContent('<p></p>');
          break;
        default:
          setInitialContent(defaultEditorContent);
      }
    }
  }, [initialValue, fieldType]);

  if (!initialContent) return null;

  // Configure editor props based on field type
  const getEditorClass = () => {
    const baseClass = "prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full px-4 py-3";
    
    switch (fieldType) {
      case 'title':
        return `${baseClass} prose-2xl font-bold`;
      case 'description':
        return `${baseClass} prose-lg`;
      case 'tags':
        return `${baseClass} prose-sm`;
      default:
        return `${baseClass} prose-lg`;
    }
  };

  const shouldShowToolbar = fieldType === 'content' || fieldType === 'description';
  const shouldShowSlashCommands = enableSlashCommands && (fieldType === 'content');

  return (
    <div className={`relative w-full ${className}`}>
      {showWordCount && (
        <div className="flex absolute right-3 top-3 z-10 gap-2">
          <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
            {charsCount} Words
          </div>
        </div>
      )}
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={fieldExtensions}
          className={`relative w-full border-muted bg-background rounded-lg border shadow-sm`}
          style={{ minHeight }}
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
              class: getEditorClass(),
              "data-placeholder": placeholder,
              style: `min-height: ${minHeight};`,
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
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

          {shouldShowToolbar && (
            <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
              <Separator orientation="vertical" />
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />
              <Separator orientation="vertical" />
              <LinkSelector open={openLink} onOpenChange={setOpenLink} />
              <Separator orientation="vertical" />
              {fieldType === 'content' && (
                <>
                  <MathSelector />
                  <Separator orientation="vertical" />
                </>
              )}
              <TextButtons />
              <Separator orientation="vertical" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />
            </GenerativeMenuSwitch>
          )}
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default FlexibleRichEditor;