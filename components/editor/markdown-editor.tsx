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
      className="h-full font-mono p-4 border rounded-md "
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Write in Markdown..."
    />
  );
}
