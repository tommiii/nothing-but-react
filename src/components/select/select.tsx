import classNames from "classnames";
import { FC, SelectHTMLAttributes } from "react";

interface Option {
  value: string | number;
  displayValue: string;
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: string | number;
  label?: string;
  className?: string;
  fullWidth?: boolean;
}

const Select: FC<Props> = ({
  options,
  defaultValue,
  label,
  onChange,
  className,
  fullWidth = false,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={props?.id} className="font-medium text-gray-500 mr-2">
          {label}
        </label>
      )}
      <select
        {...props}
        id={props?.id}
        className={classNames(
          "shadow text-center appearance-none border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring cursor-pointer",
          { "w-full": fullWidth }
        )}
        onChange={onChange}
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.displayValue}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
