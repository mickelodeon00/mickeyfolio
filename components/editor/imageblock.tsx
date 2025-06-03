import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";

const imageProperties = [
  { label: "Cover - Full Width", style: "w-full object-cover aspect-video" },
  { label: "Default", style: "w-auto h-auto max-w-full" },
  { label: "4:3 Ratio", style: "w-full aspect-[4/3] object-contain" },
  { label: "16:9 Ratio", style: "w-full aspect-[16/9] object-contain" },
];

const ImageComponent = (props: any) => {
  const { node, updateAttributes } = props;
  const { src, alt, className } = node.attrs;
  const [open, setOpen] = useState(false);

  const setStyle = (style: string) => {
    updateAttributes({ className: style });
  };

  return (
    <NodeViewWrapper className="relative rounded-lg">
      <img src={src} alt={alt} className={`${className} rounded-lg`} />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="absolute top-0 right-0 z-20 bg-blue-600 hover:bg-blue-700  text-white px-2 py-1 rounded-bl-lg rounded-tr-md shadow-lg  group-hover:opacity-100 transition-all duration-200 transform hover:scale-105 flex items-center gap-1 text-xs font-medium"
            contentEditable={false}
          >
            <span>Style</span>
            {open ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
          {/* <button className="absolute top-0 right-0 z-10 bg-white p-1 rounded shadow">
            <span className="text-xs font-medium px-1">Style</span>
          </button> */}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          {imageProperties.map((prop) => (
            <DropdownMenuItem
              key={prop.label}
              onClick={() => setStyle(prop.style)}
              className="cursor-pointer "
            >
              {prop.label}
            </DropdownMenuItem>
          ))}
          {/* <DropdownMenuItem
            onClick={() => setStyle("w-full object-cover aspect-video")}
          >
            Cover - Full Width
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setStyle("w-auto h-auto max-w-full")}
          >
            Default
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setStyle("w-full aspect-[4/3] object-contain")}
          >
            4:3 Ratio
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setStyle("w-full aspect-[16/9] object-contain")}
          >
            16:9 Ratio
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </NodeViewWrapper>
  );
};

export const CustomImage = Node.create({
  name: "customImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      className: {
        default: "w-full object-cover aspect-video",
      },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addCommands() {
    return {
      setImage:
        (options: { src: string; alt?: string; className?: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },
});
