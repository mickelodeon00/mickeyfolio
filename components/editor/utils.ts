import TurndownService from "turndown";
// import MarkdownIt from "markdown-it";

// import { Color } from '@tiptap/extension-color';
// import TextStyle from '@tiptap/extension-text-style';
import { Node } from "@tiptap/core";

export const createEnhancedTurndown = () => {
  const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });

  // Custom rule for code blocks with syntax highlighting
  turndownService.addRule("codeBlock", {
    filter: function (node) {
      return (
        node.nodeName === "PRE" &&
        !!node.firstChild &&
        node.firstChild.nodeName === "CODE"
      );
    },
    replacement: function (content, node) {
      const codeElement = node.firstChild as HTMLElement;
      const className = codeElement.className || "";

      // Extract language from class (e.g., "language-javascript")
      const languageMatch = className.match(/language-(\w+)/);
      const language = languageMatch ? languageMatch[1] : "";

      // Clean up the content
      const cleanContent = content
        .replace(/^\n+|\n+$/g, "") // Remove leading/trailing newlines
        .replace(/\n{3,}/g, "\n\n"); // Replace multiple newlines with double

      return `\n\`\`\`${language}\n${cleanContent}\n\`\`\`\n\n`;
    },
  });

  // Custom rule for highlighted text
  turndownService.addRule("highlight", {
    filter: function (node) {
      return (
        node.nodeName === "MARK" ||
        (node.nodeName === "SPAN" &&
          node instanceof HTMLElement &&
          node.classList.contains("highlight"))
      );
    },
    replacement: function (content) {
      return `==${content}==`;
    },
  });

  return turndownService;
};

// export const createEnhancedMarkdownIt = () => {
//   // const MarkdownIt = require('markdown-it');
//   const md = new MarkdownIt();

//   // Custom renderer for images with styling
//   md.renderer.rules.image = function (tokens, idx, options, env) {
//     const token = tokens[idx];
//     const src = token.attrGet("src") || "";
//     const alt = token.content || "";
//     const title = token.attrGet("title") || "";

//     // Check if there's custom styling syntax after the image
//     const nextToken = tokens[idx + 1];
//     let styleAttrs = "";

//     // Parse custom styling syntax: ![alt](src){width="100px" height="200px" class="rounded"}
//     const srcWithStyle = src.match(/^(.+?)\{(.+?)\}$/);
//     if (srcWithStyle) {
//       const actualSrc = srcWithStyle[1];
//       const styleString = srcWithStyle[2];

//       // Parse style attributes
//       const styleMatches = styleString.match(/(\w+)="([^"]+)"/g) || [];
//       const attributes: string[] = [];

//       styleMatches.forEach((match) => {
//         const [, key, value] = match.match(/(\w+)="([^"]+)"/) || [];
//         if (key && value) {
//           if (key === "style") {
//             attributes.push(`style="${value}"`);
//           } else if (key === "class") {
//             attributes.push(`class="${value}"`);
//           } else {
//             attributes.push(`${key}="${value}"`);
//           }
//         }
//       });

//       styleAttrs = attributes.join(" ");
//       token.attrSet("src", actualSrc);
//     }

//     const titleAttr = title ? ` title="${title}"` : "";
//     const altAttr = alt ? ` alt="${alt}"` : "";

//     return `<img src="${token.attrGet(
//       "src"
//     )}"${altAttr}${titleAttr} ${styleAttrs}>`;
//   };

//   return md;
// };

export const HtmlNode = Node.create({
  name: "htmlNode",
  group: "block",
  content: "text*",

  addAttributes() {
    return {
      HTMLAttributes: {
        default: {},
        parseHTML: (element) => {
          const attrs: Record<string, string> = {};
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            attrs[attr.name] = attr.value;
          }
          return {
            tagName: element.tagName.toLowerCase(),
            attributes: attrs,
          };
        },
        renderHTML: (attributes) => attributes.HTMLAttributes || {},
      },
    };
  },

  parseHTML() {
    // This will catch any HTML element not handled by other extensions
    return [
      {
        tag: "*",
        priority: 1, // Lower priority so specific extensions take precedence
        getAttrs: (element) => {
          // Skip elements that have specific extensions
          if (
            [
              "p",
              "h1",
              "h2",
              "h3",
              "h4",
              "h5",
              "h6",
              "ul",
              "ol",
              "li",
              "pre",
              "code",
              "img",
              "table",
              "tr",
              "td",
              "th",
            ].includes(element.tagName.toLowerCase())
          ) {
            return false;
          }
          return null;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { tagName = "div", attributes = {} } = HTMLAttributes;
    return [tagName, attributes, 0];
  },
});
