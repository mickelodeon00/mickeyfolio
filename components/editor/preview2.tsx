// components/editor/preview.tsx
"use client";

import { useEffect, useState } from "react";
import MarkdownIt from "markdown-it";
// import "./prismcustom.css"; // Add this line
// We'll import DOMPurify dynamically in useEffect

// Import Prism only on client side
let Prism: any = null;
if (typeof window !== "undefined") {
  Prism = require("prismjs");

  // Import languages
  require("prismjs/components/prism-javascript");
  require("prismjs/components/prism-typescript");
  require("prismjs/components/prism-jsx");
  require("prismjs/components/prism-tsx");
  require("prismjs/components/prism-bash");
  require("prismjs/components/prism-css");
  require("prismjs/components/prism-scss");
  require("prismjs/components/prism-json");
  require("prismjs/components/prism-python");
  require("prismjs/components/prism-java");
  require("prismjs/components/prism-sql");
  require("prismjs/components/prism-yaml");
  require("prismjs/components/prism-markdown");

  // Import CSS theme
  require("prismjs/themes/prism-tomorrow.css");
}

interface PreviewProps {
  markdown: string;
}

export default function Preview({ markdown }: PreviewProps) {
  const [isClient, setIsClient] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState("");

  // Language mapping for aliases
  const languageMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    sh: "bash",
    shell: "bash",
    py: "python",
    yml: "yaml",
    md: "markdown",
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !markdown) return;

    const processMarkdown = async () => {
      // Dynamically import DOMPurify only on client side
      let DOMPurify: any = null;
      if (typeof window !== "undefined") {
        const DOMPurifyModule = await import("dompurify");
        DOMPurify = DOMPurifyModule.default;
      }

      const md: MarkdownIt = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
          console.log("🔍 Highlighting:", {
            lang,
            codeLength: str.length,
            code: str.substring(0, 50) + "...",
          });

          if (!Prism) {
            console.log("❌ Prism not loaded");
            return `<pre class="language-${lang || "text"}"><code>${escapeHtml(
              str
            )}</code></pre>`;
          }

          const normalizedLang = languageMap[lang] || lang;
          console.log("🔄 Normalized language:", normalizedLang);

          if (normalizedLang && Prism.languages[normalizedLang]) {
            try {
              const highlighted = Prism.highlight(
                str,
                Prism.languages[normalizedLang],
                normalizedLang
              );
              console.log("✅ Successfully highlighted with Prism");
              return `<pre class="language-${normalizedLang}"><code class="language-${normalizedLang}">${highlighted}</code></pre>`;
            } catch (error) {
              console.error("❌ Prism highlighting error:", error);
            }
          } else {
            console.log("⚠️ Language not supported:", normalizedLang);
            console.log(
              "📋 Available languages:",
              Object.keys(Prism.languages || {})
            );
          }

          // Fallback for unsupported languages
          return `<pre class="language-${
            lang || "text"
          }"><code class="language-${lang || "text"}">${escapeHtml(
            str
          )}</code></pre>`;
        },
      });

      const html = md.render(markdown);
      console.log("📄 Rendered HTML:", html);

      // Use DOMPurify if available, otherwise use the HTML directly
      if (DOMPurify) {
        const cleanHtml = DOMPurify.sanitize(html, {
          ADD_TAGS: ["pre", "code", "span"],
          ADD_ATTR: ["class", "style"],
        });
        setHighlightedHtml(cleanHtml);
      } else {
        setHighlightedHtml(html);
      }
    };

    processMarkdown();
  }, [markdown, isClient]);

  // Simple HTML escape function
  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Re-highlight after HTML is set
  useEffect(() => {
    if (isClient && highlightedHtml && Prism) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        console.log("🎨 Running Prism.highlightAll()");
        Prism.highlightAll();
      }, 100);
    }
  }, [highlightedHtml, isClient]);

  if (!isClient) {
    return (
      <div className="min-h-[400px] p-4 border rounded-md prose dark:prose-invert max-w-none">
        <div className="animate-pulse">Loading preview...</div>
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="min-h-[400px] p-4 border rounded-md prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground italic">
          Nothing to preview yet. Start writing in the Edit tab.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] p-4 border rounded-md prose dark:prose-invert max-w-none">
      <div
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        className="prism-preview"
      />

      {/* Debug info - remove in production */}
      <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
        <p>🔧 Debug Info:</p>
        <p>Client loaded: {isClient ? "✅" : "❌"}</p>
        <p>Prism loaded: {Prism ? "✅" : "❌"}</p>
        <p>
          Available languages:{" "}
          {Prism ? Object.keys(Prism.languages).join(", ") : "None"}
        </p>
      </div>
    </div>
  );
}
