import type { ButtonHTMLAttributes } from "react";

export const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { children, ...rest } = props;

  return (
    <button {...rest} className="btn btn-primary">
      {children}
    </button>
  );
};

export default Button;
