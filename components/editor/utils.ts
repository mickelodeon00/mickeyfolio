import TurndownService from "turndown";

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
