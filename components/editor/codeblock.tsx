import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { useState, useEffect } from "react";
import type { NodeViewProps } from "@tiptap/react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Create lowlight instance
const lowlight = createLowlight(common);

// Language options with display names and colors
interface LanguageOption {
  value: string;
  label: string;
  color: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "javascript", label: "JavaScript", color: "#f7df1e" },
  { value: "typescript", label: "TypeScript", color: "#3178c6" },
  { value: "jsx", label: "JSX", color: "#61dafb" },
  { value: "tsx", label: "TSX", color: "#3178c6" },
  { value: "css", label: "CSS", color: "#1572b6" },
  { value: "scss", label: "SCSS", color: "#cf649a" },
  { value: "html", label: "HTML", color: "#e34f26" },
  { value: "json", label: "JSON", color: "#000000" },
  { value: "python", label: "Python", color: "#3776ab" },
  { value: "java", label: "Java", color: "#ed8b00" },
  { value: "bash", label: "Bash", color: "#4eaa25" },
  { value: "sql", label: "SQL", color: "#336791" },
  { value: "yaml", label: "YAML", color: "#cb171e" },
  { value: "markdown", label: "Markdown", color: "#083fa1" },
  { value: "php", label: "PHP", color: "#777bb4" },
  { value: "ruby", label: "Ruby", color: "#cc342d" },
  { value: "go", label: "Go", color: "#00add8" },
  { value: "rust", label: "Rust", color: "#000000" },
  { value: "swift", label: "Swift", color: "#fa7343" },
  { value: "kotlin", label: "Kotlin", color: "#7f52ff" },
];

// Define attributes interface
interface CodeBlockAttributes {
  language: string;
}

// Custom CodeBlock Component with shadcn dropdown
const CodeBlockComponent: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  editor,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    (node.attrs as CodeBlockAttributes).language || "javascript"
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const newLanguage =
      (node.attrs as CodeBlockAttributes).language || "javascript";
    if (newLanguage !== selectedLanguage) {
      setSelectedLanguage(newLanguage);
    }
  }, [node.attrs.language]);

  const handleLanguageChange = (language: string): void => {
    // Update local state immediately
    setSelectedLanguage(language);
    setIsOpen(false);

    // Update the node attributes - this is the key fix
    updateAttributes({ language });

    // Force a transaction to ensure the change is committed
    editor.commands.focus();

    // Trigger a re-render by updating the editor content
    // This ensures the lowlight highlighting is updated
    setTimeout(() => {
      const { tr } = editor.state;
      const pos = editor.state.selection.from;
      editor.view.dispatch(tr.setMeta("forceUpdate", true));
    }, 0);
  };

  const getCurrentLanguage = (): LanguageOption => {
    return (
      LANGUAGE_OPTIONS.find((lang) => lang.value === selectedLanguage) ||
      LANGUAGE_OPTIONS[0]
    );
  };

  const currentLang = getCurrentLanguage();
  const isLightColor =
    currentLang.color === "#f7df1e" || currentLang.color === "#61dafb";

  return (
    <NodeViewWrapper className="code-block-wrapper">
      <div className="relative group">
        {/* Language Dropdown */}
        {/* <div className="absolute top-2 right-2 z-20 hidden group-hover:block"> */}
        <div className="absolute top-0 right-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors hover:opacity-90 border border-border/20 shadow-sm backdrop-blur-sm"
                style={{
                  backgroundColor: currentLang.color,
                  color: isLightColor ? "#000" : "#fff",
                }}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              >
                {currentLang.label}
                <svg
                  className={`w-3 h-3 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 max-h-64 overflow-y-auto"
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                editor?.commands.focus();
              }}
            >
              {LANGUAGE_OPTIONS.map((language) => (
                <DropdownMenuItem
                  key={language.value}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleLanguageChange(language.value);
                  }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: language.color }}
                  />
                  <span className="flex-1">{language.label}</span>
                  {selectedLanguage === language.value && (
                    <svg
                      className="w-4 h-4 text-primary flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Code Block */}
        <NodeViewContent
          className={`rounded-md bg-muted p-4 pt-12 font-mono text-sm code-block language-${selectedLanguage} block leading-relaxed overflow-x-auto border border-input min-h-[60px]`}
          as="pre"
          spellCheck={false}
        />
      </div>
    </NodeViewWrapper>
  );
};

// Create the extension by extending CodeBlockLowlight
export const CodeBlockWithLanguage = CodeBlockLowlight.extend({
  name: "codeBlockWithLanguage",

  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: "javascript",
        parseHTML: (element: HTMLElement) => {
          // Check multiple sources for the language
          const dataLang = element.getAttribute("data-language");
          const classLang = element
            .getAttribute("class")
            ?.match(/language-(\w+)/)?.[1];
          const codeLang = element
            .querySelector("code")
            ?.getAttribute("class")
            ?.match(/language-(\w+)/)?.[1];

          return dataLang || classLang || codeLang || "javascript";
        },
        renderHTML: (attributes: CodeBlockAttributes) => {
          const language = attributes.language || "javascript";
          return {
            "data-language": language,
            class: `language-${language}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full",
        getAttrs: (element) => {
          const htmlElement = element as HTMLElement;
          const dataLang = htmlElement.getAttribute("data-language");
          const classLang = htmlElement
            .getAttribute("class")
            ?.match(/language-(\w+)/)?.[1];
          const codeLang = htmlElement
            .querySelector("code")
            ?.getAttribute("class")
            ?.match(/language-(\w+)/)?.[1];

          return {
            language: dataLang || classLang || codeLang || "javascript",
          };
        },
      },
      {
        tag: "code",
        preserveWhitespace: "full",
        getAttrs: (element) => {
          const htmlElement = element as HTMLElement;
          const parentPre = htmlElement.closest("pre");
          if (!parentPre) return false;

          const dataLang = parentPre.getAttribute("data-language");
          const classLang = htmlElement
            .getAttribute("class")
            ?.match(/language-(\w+)/)?.[1];

          return {
            language: dataLang || classLang || "javascript",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const language = node.attrs.language || "javascript";

    return [
      "pre",
      mergeAttributes(HTMLAttributes, {
        "data-language": language,
        class: `language-${language}`,
        spellcheck: "false",
      }),
      ["code", { class: `language-${language}` }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent);
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Alt-c": () => this.editor.commands.setCodeBlock(),
      "Mod-Shift-\\": () => this.editor.commands.setCodeBlock(),

      // Exit code block with Cmd/Ctrl + Enter
      "Mod-Enter": ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        // Check if we're in a code block
        if ($from.parent.type.name === "codeBlockWithLanguage") {
          // Find the code block node and its position
          let codeBlockPos = null;
          let depth = $from.depth;

          for (let i = depth; i >= 0; i--) {
            if ($from.node(i).type.name === "codeBlockWithLanguage") {
              codeBlockPos = $from.start(i) - 1;
              break;
            }
          }

          if (codeBlockPos !== null) {
            const codeBlockNode = state.doc.nodeAt(codeBlockPos);
            if (codeBlockNode) {
              const endPos = codeBlockPos + codeBlockNode.nodeSize;
              return (
                editor.commands.insertContentAt(endPos, "<p></p>") &&
                editor.commands.focus(endPos + 1)
              );
            }
          }
        }

        return false;
      },

      // Exit code block with double Enter
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, empty } = selection;

        // Only handle if we're in a code block and selection is empty
        if (empty && $from.parent.type.name === "codeBlockWithLanguage") {
          const textContent = $from.parent.textContent;
          const cursorPos = $from.parentOffset;

          // Check if we're at the end and the last character is a newline (indicating empty line)
          const isAtEnd = cursorPos === textContent.length;
          const endsWithNewline = textContent.endsWith("\n");
          const endsWithDoubleNewline = textContent.endsWith("\n\n");

          if (isAtEnd && endsWithNewline) {
            // We're at the end of an empty line, so exit the code block

            // Find the code block position
            let codeBlockPos = null;
            let depth = $from.depth;

            for (let i = depth; i >= 0; i--) {
              if ($from.node(i).type.name === "codeBlockWithLanguage") {
                codeBlockPos = $from.start(i) - 1;
                break;
              }
            }

            if (codeBlockPos !== null) {
              const codeBlockNode = state.doc.nodeAt(codeBlockPos);
              if (codeBlockNode) {
                // Remove the trailing newline if it's a double newline
                if (endsWithDoubleNewline) {
                  const deleteFrom = $from.pos - 1;
                  editor.commands.deleteRange({
                    from: deleteFrom,
                    to: $from.pos,
                  });
                }

                // Insert paragraph after code block
                const endPos = codeBlockPos + codeBlockNode.nodeSize;
                return (
                  editor.commands.insertContentAt(endPos, "<p></p>") &&
                  editor.commands.focus(endPos + 1)
                );
              }
            }
          }
        }

        return false;
      },

      // Shift + Enter to force exit
      "Shift-Enter": ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;

        if ($from.parent.type.name === "codeBlockWithLanguage") {
          // Find the code block position
          let codeBlockPos = null;
          let depth = $from.depth;

          for (let i = depth; i >= 0; i--) {
            if ($from.node(i).type.name === "codeBlockWithLanguage") {
              codeBlockPos = $from.start(i) - 1;
              break;
            }
          }

          if (codeBlockPos !== null) {
            const codeBlockNode = state.doc.nodeAt(codeBlockPos);
            if (codeBlockNode) {
              const endPos = codeBlockPos + codeBlockNode.nodeSize;
              return (
                editor.commands.insertContentAt(endPos, "<p></p>") &&
                editor.commands.focus(endPos + 1)
              );
            }
          }
        }

        return false;
      },
    };
  },

  // Add commands to set language
  addCommands() {
    return {
      ...this.parent?.(),
      setCodeBlockLanguage:
        (language: string) =>
        ({ commands }: { commands: any }) => {
          return commands.updateAttributes("codeBlockWithLanguage", {
            language,
          });
        },
    };
  },
}).configure({
  lowlight,
  defaultLanguage: "javascript",
  languageClassPrefix: "language-",
});

/*
Usage in your editor setup:

```tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { CodeBlockWithLanguage } from './CodeBlockWithLanguage'

const MyEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block
      }),
      CodeBlockWithLanguage, // This includes lowlight configuration
    ],
    content: '<p>Hello World!</p>',
  })

  return <EditorContent editor={editor} />
}
```

Key fixes implemented:
1. Improved handleLanguageChange to properly update attributes
2. Enhanced parseHTML and renderHTML to preserve language across serialization
3. Added proper HTML structure with data-language attributes
4. Improved language detection from multiple sources
5. Added command to programmatically set language
6. Fixed timing issues with attribute updates

Required packages:
```bash
npm install lowlight @tiptap/extension-code-block-lowlight
```

Make sure you have shadcn/ui dropdown-menu installed:
```bash
npx shadcn-ui@latest add dropdown-menu
```
*/
