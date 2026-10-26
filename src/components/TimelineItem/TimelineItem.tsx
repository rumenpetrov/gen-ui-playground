import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const TimelineItem = ({
  time,
  title,
  description,
}: {
  time: string;
  title: string;
  description: string;
}) => {
  return (
    <li className="group">
      <hr className="group-first:hidden" />
      <div className="timeline-middle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="mb-10 timeline-end md:group-odd:timeline-start md:group-odd:text-end">
        <time className="font-mono italic">{time}</time>
        <div className="text-lg font-black">{title}</div>
        {description}
      </div>
      <hr className="group-last:hidden" />
    </li>
  );
};

export const TimelineItemOUID = defineComponent({
  name: "TimelineItem",
  description:
    "A single event in a Timeline with a time/date label, title, and description.",
  props: z.object({
    time: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  component: ({ props }) => <TimelineItem {...props} />,
});

export default TimelineItem;
