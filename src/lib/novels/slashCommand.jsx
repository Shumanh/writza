import { Command, createSuggestionItems, renderItems } from "novel";
import { CheckSquare, Code, Heading1, Heading2, Heading3, ImageIcon, List, ListOrdered, Minus, Sigma, Text, TextQuote, Twitter, Youtube, Link, Highlighter } from "lucide-react";
import { uploadFn } from "./uploadFn";

export const suggestionItems = createSuggestionItems([
  { title: "Text", description: "Paragraph", searchTerms: ["p","paragraph"], icon: <Text size={18} />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleNode("paragraph","paragraph").run() },
  { title: "To-do List", description: "Track tasks", searchTerms: ["todo","task","list"], icon: <CheckSquare size={18} />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleTaskList().run() },
  { title: "Heading 1", description: "H1", icon: <Heading1 size={18} />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode("heading",{ level:1 }).run() },
  { title: "Heading 2", description: "H2", icon: <Heading2 size={18} />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode("heading",{ level:2 }).run() },
  { title: "Heading 3", description: "H3", icon: <Heading3 size={18} />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode("heading",{ level:3 }).run() },
  { title: "Bullet List", description: "List", icon: <List size={18} />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
  { title: "Numbered List", description: "Ordered", icon: <ListOrdered size={18} />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
  { title: "Quote", description: "Blockquote", icon: <TextQuote size={18} />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleNode("paragraph","paragraph").toggleBlockquote().run() },
  { title: "Code", description: "Code block", icon: <Code size={18} />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run() },
  { title: "Horizontal Rule", description: "Insert divider", searchTerms: ["hr","divider"], icon: <Minus size={18} />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run() },
  { title: "Link", description: "Add hyperlink", searchTerms: ["url","href"], icon: <Link size={18} />, command: ({ editor, range }) => { const href = prompt("Enter URL"); if (href) editor.chain().focus().deleteRange(range).setLink({ href }).run(); } },
  { title: "Math", description: "Insert LaTeX inline", searchTerms: ["katex","latex"], icon: <Sigma size={18} />, command: ({ editor, range }) => { const latex = prompt("Enter LaTeX (inline)"); if (latex) editor.chain().focus().deleteRange(range).setLatex({ latex }).run(); } },
  { title: "Highlight", description: "Toggle highlight", searchTerms: ["mark","bg"], icon: <Highlighter size={18} />, command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleAIHighlight().run() },
  {
    title: "Image", description: "Upload image", icon: <ImageIcon size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const input = document.createElement("input");
      input.type = "file"; input.accept = "image/*";
      input.onchange = () => { if (input.files?.length) uploadFn(input.files[0], editor.view, editor.view.state.selection.from); };
      input.click();
    },
  },
  {
    title: "Youtube", description: "Embed video", icon: <Youtube size={18} />,
    command: ({ editor, range }) => {
      const link = prompt("Youtube link");
      const rx = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
      if (link && rx.test(link)) editor.chain().focus().deleteRange(range).setYoutubeVideo({ src: link }).run();
    },
  },
  {
    title: "Twitter", description: "Embed tweet", icon: <Twitter size={18} />,
    command: ({ editor, range }) => {
      const link = prompt("X/Twitter link");
      const rx = /^https?:\/\/(www\.)?x\.com\/([a-zA-Z0-9_]{1,15})(\/status\/(\d+))?(\/\S*)?$/;
      if (link && rx.test(link)) editor.chain().focus().deleteRange(range).setTweet({ src: link }).run();
    },
  },
]);

export const slashCommand = Command.configure({
  suggestion: { items: () => suggestionItems, render: renderItems },
});