// TableExtensions.ts - Complete table setup with all required extensions
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";

// Configure the table extensions
export const TableExtensions = [
  Table.configure({
    resizable: true,
    HTMLAttributes: {},
    handleWidth: 5,
    cellMinWidth: 25,
    lastColumnResizable: true,
    allowTableNodeSelection: false,
  }),
  TableRow.configure({
    HTMLAttributes: {},
  }),
  TableHeader.configure({
    HTMLAttributes: {},
  }),
  TableCell.configure({
    HTMLAttributes: {},
  }),
];

// TableToolbar.tsx - Comprehensive table toolbar component
import React from "react";
import { Editor } from "@tiptap/react";
import {
  Table as TableIcon,
  Plus,
  Minus,
  RotateCcw,
  Merge,
  Split,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TableToolbarProps {
  editor: Editor;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const isInTable = editor.isActive("table");

  const insertTable = (
    rows: number = 3,
    cols: number = 3,
    withHeaderRow: boolean = true
  ) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();
  };

  const insertTableSizes = [
    { label: "2x2", rows: 2, cols: 2 },
    { label: "3x3", rows: 3, cols: 3 },
    { label: "4x4", rows: 4, cols: 4 },
    { label: "5x5", rows: 5, cols: 5 },
    { label: "3x5", rows: 3, cols: 5 },
    { label: "5x3", rows: 5, cols: 3 },
  ];

  return (
    <div className="flex items-center gap-1 p-2 border-b bg-gray-50/50">
      {/* Insert Table Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <TableIcon className="w-4 h-4" />
            Insert Table
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuItem onClick={() => insertTable(3, 3, true)}>
            <Grid3x3 className="w-4 h-4 mr-2" />
            Quick Table (3x3)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Settings className="w-4 h-4 mr-2" />
              Custom Size
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {insertTableSizes.map((size) => (
                <DropdownMenuItem
                  key={size.label}
                  onClick={() => insertTable(size.rows, size.cols, true)}
                >
                  {size.label} Table
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => insertTable(3, 3, false)}>
                3x3 (No Header)
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      {isInTable && (
        <>
          <Separator orientation="vertical" className="h-6" />

          {/* Column Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              title="Add Column Before"
            >
              <ChevronLeft className="w-4 h-4" />
              <Plus className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="Add Column After"
            >
              <Plus className="w-3 h-3" />
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              title="Delete Column"
              className="text-red-600 hover:text-red-700"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Row Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              title="Add Row Above"
            >
              <ChevronUp className="w-4 h-4" />
              <Plus className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="Add Row Below"
            >
              <Plus className="w-3 h-3" />
              <ChevronDown className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="Delete Row"
              className="text-red-600 hover:text-red-700"
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Cell Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().mergeCells().run()}
              title="Merge Cells"
              disabled={!editor.can().mergeCells()}
            >
              <Merge className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().splitCell().run()}
              title="Split Cell"
              disabled={!editor.can().splitCell()}
            >
              <Split className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Header Controls */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <MoreHorizontal className="w-4 h-4" />
                More
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              >
                Toggle Header Row
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeaderColumn().run()
                }
              >
                Toggle Header Column
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleHeaderCell().run()}
              >
                Toggle Header Cell
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => editor.chain().focus().fixTables().run()}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Fix Tables
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Table
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Navigation Controls */}
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().goToPreviousCell().run()}
              title="Previous Cell"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().goToNextCell().run()}
              title="Next Cell"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

// TableStyles.css - Enhanced table styling
export const tableStyles = `
  .ProseMirror {
    table {
      border-collapse: collapse;
      table-layout: fixed;
      width: 100%;
      margin: 1rem 0;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    table td,
    table th {
      min-width: 1em;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;
      background-color: white;
    }

    table th {
      font-weight: 600;
      text-align: left;
      background-color: #f8fafc;
      border-bottom: 2px solid #e2e8f0;
    }

    table .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(59, 130, 246, 0.1);
      border: 2px solid #3b82f6;
      pointer-events: none;
    }

    table .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #3b82f6;
      pointer-events: none;
    }

    table p {
      margin: 0;
    }

    /* Hover effects */
    table tr:hover td {
      background-color: #f8fafc;
    }

    table th:hover {
      background-color: #f1f5f9;
    }

    /* Focus styles */
    table td:focus,
    table th:focus {
      outline: 2px solid #3b82f6;
      outline-offset: -2px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      table {
        font-size: 0.875rem;
      }
      
      table td,
      table th {
        padding: 6px 8px;
        min-width: 80px;
      }
    }
  }

  /* Table resize handle styling */
  .tableWrapper {
    overflow-x: auto;
    padding: 1rem 0;
  }

  .resize-cursor {
    cursor: ew-resize;
  }
`;

// Complete Editor Setup Example
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

export const TableEditor: React.FC = () => {
  const editor = useEditor({
    extensions: [StarterKit, ...TableExtensions],
    content: `
      <h2>Table Example</h2>
      <p>Here's an example with a table:</p>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Team</th>
          </tr>
          <tr>
            <td>Alice Johnson</td>
            <td>Developer</td>
            <td>Frontend</td>
          </tr>
          <tr>
            <td>Bob Smith</td>
            <td>Designer</td>
            <td>UI/UX</td>
          </tr>
          <tr>
            <td>Carol Davis</td>
            <td>Manager</td>
            <td>Product</td>
          </tr>
        </tbody>
      </table>
      <p>Click in the table to see all the table controls!</p>
    `,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none",
      },
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto border rounded-lg overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: tableStyles }} />
      <TableToolbar editor={editor!} />
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TableEditor;
