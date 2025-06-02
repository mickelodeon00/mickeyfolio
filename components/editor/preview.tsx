import Prism from "prismjs";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import { useEffect } from "react";

// import "prismjs/themes/prism-tomorrow.css"; // Dark theme
// import "./prism-custom.css"; // Dark theme
// import "prismjs/themes/prism.css";
import "./code.css";

// const md = new MarkdownIt();
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    // console.log(lang, str, "console");

    // Handle language aliases
    const languageMap: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      sh: "bash",
      shell: "bash",
      py: "python",
      yml: "yaml",
      md: "markdown",
    };

    const normalizedLang = languageMap[lang] || lang;

    if (normalizedLang && Prism.languages[normalizedLang]) {
      try {
        const highlighted = Prism.highlight(
          str,
          Prism.languages[normalizedLang],
          normalizedLang
        );
        return `<pre class=" language-${normalizedLang}"><code class="language-${normalizedLang}">${highlighted}</code></pre>`;
      } catch (error) {
        console.error("Prism highlighting error:", error);
      }
    }

    // Fallback for unsupported languages
    return `<pre class="language-${lang || "text"}"><code class="language-${
      lang || "text"
    }">${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

export default function Preview({ markdown }: { markdown: string }) {
  const html = md.render(markdown);
  useEffect(() => {
    // Re-highlight code blocks after component mounts/updates
    if (typeof window !== "undefined") {
      Prism.highlightAll();
    }
  }, [markdown]);

  return (
    <div className="min-h-[400px] p-4 border rounded-md prose dark:prose-invert max-w-none ">
      {markdown ? (
        // <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(html, {
              ADD_TAGS: ["pre", "code"],
              ADD_ATTR: ["class"],
            }),
          }}
        />
      ) : (
        <p className="text-muted-foreground italic">
          Nothing to preview yet. Start writing in the Edit tab.
        </p>
      )}
    </div>
  );
}
