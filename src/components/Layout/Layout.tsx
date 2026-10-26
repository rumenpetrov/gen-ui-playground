import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { StatsOUID } from "../Stats";
import { TableOUID } from "../Table";
import { TimelineOUID } from "../Timeline";

export const Layout = ({ children }: { children: any }) => {
  return <div className="flex flex-col gap-6 my-4">{children}</div>;
};

export const LayoutOUID = defineComponent({
  name: "Layout",
  description:
    "Root layout container that holds Stats, Table, and/or Timeline components.",
  props: z.object({
    children: z
      .array(z.union([StatsOUID.ref, TableOUID.ref, TimelineOUID.ref]))
      .describe("Top-level UI blocks (Stats, Table, or Timeline)"),
  }),
  component: ({ props, renderNode }) => (
    <Layout>{renderNode(props.children)}</Layout>
  ),
});

export default Layout;
