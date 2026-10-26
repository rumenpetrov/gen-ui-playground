import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { TableHeadOUID } from "../TableHead";
import { TableBodyOUID } from "../TableBody";

export const Table = ({ children }: { children: any }) => {
  return (
    <div className="overflow-x-auto rounded-box border border-base-content/15">
      <table className="table table-zebra">{children}</table>
    </div>
  );
};

export const TableOUID = defineComponent({
  name: "Table",
  description: "A data table containing TableHead and TableBody sections.",
  props: z.object({
    children: z
      .array(z.union([TableHeadOUID.ref, TableBodyOUID.ref]))
      .describe("TableHead and TableBody sections"),
  }),
  component: ({ props, renderNode }) => (
    <Table>{renderNode(props.children)}</Table>
  ),
});

export default Table;
