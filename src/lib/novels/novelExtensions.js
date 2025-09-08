import {
  AIHighlight, CharacterCount, CodeBlockLowlight, Color, CustomKeymap, GlobalDragHandle,
  HighlightExtension, HorizontalRule, Mathematics, Placeholder, StarterKit,
  TaskItem, TaskList, TextStyle, TiptapImage, TiptapLink, TiptapUnderline, Twitter, UpdatedImage,
  UploadImagesPlugin, Youtube,
} from "novel";
import { cx } from "class-variance-authority";
import { common, createLowlight } from "lowlight";

const tiptapLink = TiptapLink.configure({
  HTMLAttributes: { class: cx("text-muted-foreground underline underline-offset-[3px] hover:text-primary") },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [UploadImagesPlugin({ imageClass: cx("opacity-40 rounded-lg border border-stone-200") })];
  },
}).configure({ allowBase64: true, HTMLAttributes: { class: cx("rounded-lg border border-muted") } });

const starterKit = StarterKit.configure({
  bulletList: { HTMLAttributes: { class: cx("list-disc list-outside -mt-2") } },
  orderedList: { HTMLAttributes: { class: cx("list-decimal list-outside -mt-2") } },
  listItem: { HTMLAttributes: { class: cx("leading-normal -mb-2") } },
  blockquote: { HTMLAttributes: { class: cx("border-l-4 border-primary") } },
  codeBlock: { HTMLAttributes: { class: cx("rounded-md bg-muted text-muted-foreground border p-5 font-mono") } },
  horizontalRule: false,
  dropcursor: { color: "#DBEAFE", width: 4 },
  gapcursor: false,
});

export const defaultExtensions = [
  starterKit,
  Placeholder.configure({
    placeholder: "Write your blog content… Type '/' for commands",
  }),
  tiptapLink,
  tiptapImage,
  UpdatedImage,
  TaskList.configure({ HTMLAttributes: { class: cx("not-prose pl-2") } }),
  TaskItem.configure({ HTMLAttributes: { class: cx("flex gap-2 items-start my-4") }, nested: true }),
  HorizontalRule.configure({ HTMLAttributes: { class: cx("mt-4 mb-6 border-t border-muted-foreground") } }),
  AIHighlight,
  CodeBlockLowlight.configure({ lowlight: createLowlight(common) }),
  Youtube.configure({ HTMLAttributes: { class: cx("rounded-lg border border-muted") }, inline: false }),
  Twitter.configure({ HTMLAttributes: { class: cx("not-prose") }, inline: false }),
  Mathematics.configure({ HTMLAttributes: { class: cx("text-foreground rounded p-1 hover:bg-accent cursor-pointer") }, katexOptions: { throwOnError: false } }),
  CharacterCount.configure(),
  TiptapUnderline,
  HighlightExtension,
  TextStyle,
  Color,
  CustomKeymap,
  GlobalDragHandle,
];