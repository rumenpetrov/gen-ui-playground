import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { StatOUID } from "../Stat";

export const Stats = ({ children }: { children: any }) => {
  return (
    <div className="stats shadow border border-base-content/15 bg-base-200/50">
      {children}
    </div>
  );
};

export const StatsOUID = defineComponent({
  name: "Stats",
  description: "A parent that holds multiple Stat components.",
  props: z.object({
    children: z.array(StatOUID.ref).describe("List of child Stat components"),
  }),
  component: ({ props, renderNode }) => (
    <Stats>{renderNode(props.children)}</Stats>
  ),
});

export default Stats;
