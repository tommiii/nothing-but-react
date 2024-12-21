import { FC } from "react";

interface Props {
  options: { value: string | number; displayValue: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  defaultValue?: string | number;
  label?: string;
  className?: string;
}

const Select: FC<Props> = ({
  options,
  defaultValue,
  label,
  onChange,
  className,
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor="entries" className="font-medium text-gray-500 mr-2">
          {label}
        </label>
      )}
      <select
        id="entries"
        className="shadow text-center appearance-none border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring cursor-pointer"
        onChange={onChange}
        defaultValue={defaultValue}
      >
        {options.map((option) => (
          <option
            key={option.value}
            disabled={option.value === "placeholder"}
            value={option.value}
          >
            {option.displayValue}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
