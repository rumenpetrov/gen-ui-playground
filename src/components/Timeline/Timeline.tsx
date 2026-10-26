import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { TimelineItemOUID } from "../TimelineItem";

export const Timeline = ({ children }: { children: any }) => {
  return (
    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
      {children}
    </ul>
  );
};

export const TimelineOUID = defineComponent({
  name: "Timeline",
  description:
    "A vertical timeline that holds multiple TimelineItem components.",
  props: z.object({
    children: z
      .array(TimelineItemOUID.ref)
      .describe("List of child TimelineItem components"),
  }),
  component: ({ props, renderNode }) => (
    <Timeline>{renderNode(props.children)}</Timeline>
  ),
});

export default Timeline;
