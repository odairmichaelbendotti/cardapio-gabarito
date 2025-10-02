const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className="bg-white text-md px-2 py-[10px] rounded-md outline-none w-[350px]"
    />
  );
};

export default Input;
