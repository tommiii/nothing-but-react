import { FC } from "react";

interface Props {
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string | number;
  className?: string;
}

const Input: FC<Props> = ({
  placeholder,
  defaultValue,
  onChange,
  className,
}) => {
  return (
    <div className={className}>
      <input
        defaultValue={defaultValue}
        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring"
        type="text"
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
