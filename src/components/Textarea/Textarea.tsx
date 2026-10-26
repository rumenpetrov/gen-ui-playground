export const Texarea = (props) => {
  const { children, ...rest } = props;

  return (
    <textarea
      {...rest}
      className="textarea w-full min-h-40 bg-base-100 border-base-content/20"
    >
      {children}
    </textarea>
  );
};

export default Texarea;
