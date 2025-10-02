type ButtonProps = {
  text: string;
  variant?: "default" | "outline";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ text, variant = "default", ...props }: ButtonProps) => {
  const buttonStyle = () => {
    if (variant === "default") {
      return "text-white w-full bg-[#C92A0E] py-2 rounded-md font-bold cursor-pointer hover:opacity-90 border-2 border-[#C92A0E]";
    } else {
      return "text-white w-full bg-[#161410] py-2 rounded-md font-bold cursor-pointer hover:opacity-90 border-2 border-[#C92A0E] hover:bg-[#C92A0E] cursor-pointer";
    }
  };

  return (
    <button {...props} className={buttonStyle()}>
      {text}
    </button>
  );
};

export default Button;
