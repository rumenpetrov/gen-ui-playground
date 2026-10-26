import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { TableHeaderOUID } from "../TableHeader";
import { TableCellOUID } from "../TableCell";

export const TableRow = ({ children }: { children: any }) => {
  return <tr className="hover:bg-base-300">{children}</tr>;
};

export const TableRowOUID = defineComponent({
  name: "TableRow",
  description: "A table row (tr) containing TableHeader or TableCell children.",
  props: z.object({
    children: z
      .array(z.union([TableHeaderOUID.ref, TableCellOUID.ref]))
      .describe("List of TableHeader or TableCell components in this row"),
  }),
  component: ({ props, renderNode }) => (
    <TableRow>{renderNode(props.children)}</TableRow>
  ),
});

export default TableRow;
