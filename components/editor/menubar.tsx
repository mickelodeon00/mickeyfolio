import React from "react";

import {
  Bold,
  Italic,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Code,
  ImageIcon,
  Table,
  Plus,
  Minus,
  Merge,
  Split,
  TableProperties,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "../ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

type Prop = {
  editor: Editor; // Replace with actual editor type
};

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "css", label: "CSS" },
  { value: "html", label: "HTML" },
  { value: "json", label: "JSON" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "php", label: "PHP" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "plaintext", label: "Plain Text" },
];
const Menubar = ({ editor }: Prop) => {
  if (!editor) {
    return null;
  }

  const isInCodeBlock = editor.isActive("codeBlock");

  const getCurrentLanguage = () => {
    const { language } = editor.getAttributes("codeBlock");
    return language || "plaintext";
  };

  const setCodeBlockLanguage = (language: string) => {
    if (isInCodeBlock) {
      editor.chain().focus().updateAttributes("codeBlock", { language }).run();
    }
  };

  const insertCodeBlockWithLanguage = (language: string) => {
    editor.chain().focus().setCodeBlock({ language }).run();
  };

  const tableOptions = [
    {
      icon: <Table className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
      isActive: () => editor.isActive("table"),
      label: "Insert Table",
    },
    // Table-specific options (only show when table is active)
    ...(editor.isActive("table")
      ? [
          {
            icon: <Plus className="size-4" />,
            onClick: () => editor.chain().focus().addColumnBefore().run(),
            isActive: () => false,
            label: "Add Column Before",
          },
          {
            icon: <Plus className="size-4" />,
            onClick: () => editor.chain().focus().addColumnAfter().run(),
            isActive: () => false,
            label: "Add Column After",
          },
          {
            icon: <Minus className="size-4" />,
            onClick: () => editor.chain().focus().deleteColumn().run(),
            isActive: () => false,
            label: "Delete Column",
          },
          {
            icon: <Plus className="size-4" />,
            onClick: () => editor.chain().focus().addRowBefore().run(),
            isActive: () => false,
            label: "Add Row Before",
          },
          {
            icon: <Plus className="size-4" />,
            onClick: () => editor.chain().focus().addRowAfter().run(),
            isActive: () => false,
            label: "Add Row After",
          },
          {
            icon: <Minus className="size-4" />,
            onClick: () => editor.chain().focus().deleteRow().run(),
            isActive: () => false,
            label: "Delete Row",
          },
          {
            icon: <Merge className="size-4" />,
            onClick: () => editor.chain().focus().mergeCells().run(),
            isActive: () => false,
            label: "Merge Cells",
          },
          {
            icon: <Split className="size-4" />,
            onClick: () => editor.chain().focus().splitCell().run(),
            isActive: () => false,
            label: "Split Cell",
          },
          {
            icon: <TableProperties className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeaderRow().run(),
            isActive: () => false,
            label: "Toggle Header Row",
          },
          {
            icon: <TableProperties className="size-4" />,
            onClick: () => editor.chain().focus().toggleHeaderColumn().run(),
            isActive: () => false,
            label: "Toggle Header Column",
          },
          {
            icon: <Trash2 className="size-4" />,
            onClick: () => editor.chain().focus().deleteTable().run(),
            isActive: () => false,
            label: "Delete Table",
          },
        ]
      : []),
  ];

  const tableMenubarOptions = [
    {
      icon: <Table className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
      isActive: () => editor.isActive("table"),
      label: "Insert Table",
    },
    {
      icon: <Plus className="size-4" />,
      onClick: () => editor.chain().focus().addColumnAfter().run(),
      isActive: () => false,
      label: "Add Column",
      isDisabled: () => !editor.isActive("table"),
    },
    {
      icon: <Plus className="size-4" />,
      onClick: () => editor.chain().focus().addRowAfter().run(),
      isActive: () => false,
      label: "Add Row",
      isDisabled: () => !editor.isActive("table"),
    },
    {
      icon: <Trash2 className="size-4" />,
      onClick: () => editor.chain().focus().deleteTable().run(),
      isActive: () => false,
      label: "Delete Table",
      isDisabled: () => !editor.isActive("table"),
    },
  ];

  const options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
      label: "H1",
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
      label: "H2",
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
      label: "H3",
    },
    {
      icon: <Pilcrow className="size-4" />,
      onClick: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
      label: "Paragraph",
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      label: "Bold",
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      label: "Italic",
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
      label: "Strike",
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
      label: "Highlight",
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: () => editor.isActive({ textAlign: "left" }),
      label: "Left",
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: () => editor.isActive({ textAlign: "center" }),
      label: "Center",
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: () => editor.isActive({ textAlign: "right" }),
      label: "Right",
    },
    {
      icon: <AlignJustify className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: () => editor.isActive({ textAlign: "justify" }),
      label: "Justify",
    },
    {
      icon: <List className="size-4" />, // Bullet list icon
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
      label: "Bullet List",
    },
    {
      icon: <ListOrdered className="size-4" />, // Ordered list icon
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
      label: "Ordered List",
    },
    {
      icon: <Code className="w-4 h-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
      label: "Code Block",
    },
    {
      icon: <ImageIcon className="size-4" />,
      onClick: () => {
        const url = window.prompt("Enter image URL");
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      },
      isActive: () => editor.isActive("image"),
      label: "Insert Image",
    },
    // Table options

    {
      icon: <Table className="size-4" />,
      onClick: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
      isActive: () => editor.isActive("table"),
      label: "Insert Table",
    },
    {
      icon: <Plus className="size-4" />,
      onClick: () => editor.chain().focus().addColumnAfter().run(),
      isActive: () => false,
      label: "Add Column",
      isDisabled: () => !editor.isActive("table"),
      className: () =>
        !editor.isActive("table") ? "opacity-50 pointer-events-none" : "",
    },
    {
      icon: <Plus className="size-4" />,
      onClick: () => editor.chain().focus().addRowAfter().run(),
      isActive: () => false,
      label: "Add Row",
      isDisabled: () => !editor.isActive("table"),
      className: () =>
        !editor.isActive("table") ? "opacity-50 pointer-events-none" : "",
    },
    {
      icon: <Minus className="size-4" />,
      onClick: () => editor.chain().focus().deleteColumn().run(),
      isActive: () => false,
      label: "Delete Column",
      isDisabled: () => !editor.isActive("table"),
      className: () =>
        !editor.isActive("table") ? "opacity-50 pointer-events-none" : "",
    },
    {
      icon: <Minus className="size-4" />,
      onClick: () => editor.chain().focus().deleteRow().run(),
      isActive: () => false,
      label: "Delete Row",
      isDisabled: () => !editor.isActive("table"),
      className: () =>
        !editor.isActive("table") ? "opacity-50 pointer-events-none" : "",
    },
    {
      icon: <Trash2 className="size-4" />,
      onClick: () => editor.chain().focus().deleteTable().run(),
      isActive: () => false,
      label: "Delete Table",
      isDisabled: () => !editor.isActive("table"),
      className: () =>
        !editor.isActive("table") ? "opacity-50 pointer-events-none" : "",
    },
    {
      icon: <Merge className="size-4" />,
      onClick: () => editor.chain().focus().mergeCells().run(),
      isActive: () => false,
      label: "Merge Cells",
      isDisabled: () => !editor.isActive("table"),
      className: () =>
        !editor.isActive("table") ? "opacity-50 pointer-events-none" : "",
    },
    {
      icon: <Split className="size-4" />,
      onClick: () => editor.chain().focus().splitCell().run(),
      isActive: () => false,
      label: "Split Cell",
      isDisabled: () => !editor.isActive("table"),
      className: () =>
        !editor.isActive("table") ? "opacity-50 pointer-events-none" : "",
    },
    {
      icon: <ToggleLeft className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeaderColumn().run(),
      isActive: () => false,
      label: "Toggle Header Column",
      isDisabled: () => !editor.isActive("table"),
      className: () =>
        !editor.isActive("table") ? "opacity-50 pointer-events-none" : "",
    },
    {
      icon: <ToggleRight className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeaderRow().run(),
      isActive: () => false,
      label: "Toggle Header Row",
      isDisabled: () => !editor.isActive("table"),
      className: () =>
        !editor.isActive("table") ? "opacity-50 pointer-events-none" : "",
    },
    {
      icon: <ToggleRight className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeaderCell().run(),
      isActive: () => false,
      label: "Toggle Header Cell",
      isDisabled: () => !editor.isActive("table"),
      className: () =>
        !editor.isActive("table") ? "opacity-50 pointer-events-none" : "",
    },
  ];

  return (
    <div className="control-group p-2">
      <div className="flex gap-2 ">
        {/* Language Selector - shows when in code block */}
        {isInCodeBlock && (
          <Select
            value={getCurrentLanguage()}
            onValueChange={setCodeBlockLanguage}
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Insert Code Block with Language - shows when NOT in code block */}
        {!isInCodeBlock && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Insert Code
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 max-h-60 overflow-y-auto">
              {LANGUAGES.map((language) => (
                <DropdownMenuItem
                  key={language.value}
                  onClick={() => insertCodeBlockWithLanguage(language.value)}
                >
                  {language.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <TooltipProvider>
        <div className="flex gap-2 w-full flex-wrap">
          {options.map((option, index) => (
            <Tooltip key={index}>
              <TooltipTrigger
                asChild
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div>
                  <Toggle
                    pressed={option.isActive()}
                    onPressedChange={option.onClick}
                  >
                    {option.icon}
                  </Toggle>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{option.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Menubar;
