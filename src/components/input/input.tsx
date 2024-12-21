import { FC, ChangeEvent, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input: FC<Props> = ({
  placeholder,
  onChange,
  className,
  value,
  ...props
}) => {
  return (
    <div className={className}>
      <input
        value={value}
        onChange={onChange}
        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring"
        type="text"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default Input;
