import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const Stat = ({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) => {
  return (
    <div className="stat">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-desc">{description}</div>
    </div>
  );
};

export const StatOUID = defineComponent({
  name: "Stat",
  description: "Displays a key metric with a title, value and description",
  props: z.object({
    title: z.string(),
    value: z.string(),
    description: z.string(),
  }),
  component: ({ props }) => <Stat {...props} />,
});

export default Stat;
