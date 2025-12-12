"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";

import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";

import Menubar from "./menubar";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";
import MarkdownIt from "markdown-it";
import {
  // createEnhancedMarkdownIt,
  createEnhancedTurndown,
  HtmlNode,
} from "./utils";
import { CodeBlockWithLanguage } from "./codeblock";
import { CustomImage } from "./imageblock";
import { CustomTable, TableRow, TableHeader, TableCell } from "./table";

import "./styles/code.css";
import "./styles/table.css";

// Usage in your component:
const turndownService = createEnhancedTurndown();

// const md = createEnhancedMarkdownIt();
const md = new MarkdownIt({
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
});

interface Props {
  content: string;
  setContent: (val: string) => void;
}

const Tiptap = ({ content, setContent }: Props) => {
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
      CustomImage,
      CodeBlockWithLanguage,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CustomTable.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Color,
      TextStyle,
      HtmlNode,
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
    immediatelyRender: false, // Prevents immediate rendering on every keystroke
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
