"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Menubar from "./menubar";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import MarkdownIt from "markdown-it";
import { createEnhancedTurndown } from "./utils";
import "./code.css";
import { CodeBlockWithLanguage } from "./codeblock";

// Usage in your component:
const turndownService = createEnhancedTurndown();

const md = new MarkdownIt();

interface Props {
  content: string;
  setContent: (val: string) => void;
}

const Tiptap = ({ content, setContent }: Props) => {
  const lowlight = createLowlight(common);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
        },
        codeBlock: false, // Disable default code block to use CodeBlockLowlight instead
      }),
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      // CodeBlockLowlight.configure({
      //   lowlight,
      //   defaultLanguage: "javascript",
      //   languageClassPrefix: "language-",
      //   HTMLAttributes: {
      //     class: "rounded-md bg-muted p-4 font-mono text-sm code-block",
      //     SpellCheck: "false", // Disable spell check for code blocks
      //   },
      // }),
      CodeBlockWithLanguage,
      // codeBlock,
    ],
    content: md.render(content || ""),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = turndownService.turndown(html);
      setContent(markdown);
    },

    editorProps: {
      attributes: {
        class:
          "h-[400px] w-full overflow-y-auto p-4 rounded-md bg-background text-foreground border border-input ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      },
    },
  });
  // Re-sync editor if content changes from markdown tab
  useEffect(() => {
    if (editor && !editor.isFocused) {
      const html = md.render(content);
      editor.commands.setContent(html);
    }
  }, [content]);

  if (!editor) {
    return null; // Ensure editor is initialized before rendering
  }

  return (
    <>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
