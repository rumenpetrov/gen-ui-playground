import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { TableRowOUID } from "../TableRow";

export const TableHead = ({ children }: { children: any }) => {
  return <thead>{children}</thead>;
};

export const TableHeadOUID = defineComponent({
  name: "TableHead",
  description: "The table header section (thead) containing header TableRow components.",
  props: z.object({
    children: z.array(TableRowOUID.ref).describe("Header TableRow components"),
  }),
  component: ({ props, renderNode }) => (
    <TableHead>{renderNode(props.children)}</TableHead>
  ),
});

export default TableHead;
