export const Button = (props) => {
  const { children, ...rest } = props;

  return (
    <button {...rest} className="btn btn-primary">
      {children}
    </button>
  );
};

export default Button;
