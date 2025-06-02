import { Textarea } from "@/components/ui/textarea";

export default function MarkdownEditor({
  content,
  setContent,
}: {
  content: string;
  setContent: (val: string) => void;
}) {
  return (
    <Textarea
      className="min-h-[400px] font-mono"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Write in Markdown..."
    />
  );
}
