import type { SelectHTMLAttributes } from "react";

export const Select = (props: SelectHTMLAttributes<HTMLSelectElement>) => {
  const { children, ...rest } = props;

  return (
    <select
      {...rest}
      className="select w-full bg-base-100 border-base-content/20"
    >
      {children}
    </select>
  );
};

export default Select;
