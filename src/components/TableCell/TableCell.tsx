import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const TableCell = ({ text }: { text: string }) => {
  return <td>{text}</td>;
};

export const TableCellOUID = defineComponent({
  name: "TableCell",
  description: "A standard table data cell (td).",
  props: z.object({
    text: z.string().describe("Cell text or value"),
  }),
  component: ({ props }) => <TableCell {...props} />,
});

export default TableCell;
