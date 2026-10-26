import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const TableHeader = ({ text }: { text: string }) => {
  return <th>{text}</th>;
};

export const TableHeaderOUID = defineComponent({
  name: "TableHeader",
  description: "A table column header cell (th).",
  props: z.object({
    text: z.string().describe("Header column label"),
  }),
  component: ({ props }) => <TableHeader {...props} />,
});

export default TableHeader;
