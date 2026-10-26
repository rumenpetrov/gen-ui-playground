import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { TableRowOUID } from "../TableRow";

export const TableBody = ({ children }: { children: any }) => {
  return <tbody>{children}</tbody>;
};

export const TableBodyOUID = defineComponent({
  name: "TableBody",
  description: "The table body section (tbody) containing data TableRow components.",
  props: z.object({
    children: z.array(TableRowOUID.ref).describe("Body TableRow components"),
  }),
  component: ({ props, renderNode }) => (
    <TableBody>{renderNode(props.children)}</TableBody>
  ),
});

export default TableBody;
