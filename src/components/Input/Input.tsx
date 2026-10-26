import type { InputHTMLAttributes } from "react";

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className="input w-full bg-base-100 border-base-content/20"
    />
  );
};

export default Input;
