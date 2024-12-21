import { FC } from "react";
import classNames from "classnames";

interface Props {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: FC<Props> = ({
  onClick,
  className,
  disabled = false,
  children,
}) => {
  return (
    <button
      className={classNames(
        "bg-primary hover:bg-tertiary text-white font-bold py-2 px-4 rounded-full",
        className,
        { "cursor-not-allowed": disabled }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
