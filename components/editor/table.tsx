import { Extension } from "@tiptap/core";
import { Table as BaseTable } from "@tiptap/extension-table";
import { TableRow as BaseTableRow } from "@tiptap/extension-table-row";
import { TableCell as BaseTableCell } from "@tiptap/extension-table-cell";
import { TableHeader as BaseTableHeader } from "@tiptap/extension-table-header";

export const CustomTable = BaseTable.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "table-wrapper",
      },
    };
  },
});

export const TableRow = BaseTableRow.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "table-row",
      },
    };
  },
});

export const TableHeader = BaseTableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "table-header",
      },
    };
  },
});

export const TableCell = BaseTableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: "table-cell",
      },
    };
  },
});
