import { FC } from "react";
import classNames from "classnames";

interface ButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
}

const Button: FC<ButtonProps> = ({
  onClick,
  className,
  disabled = false,
  children,
  ariaLabel,
}) => {
  const buttonClassNames = classNames(
    "bg-primary hover:bg-tertiary text-white font-bold py-2 px-4 rounded-full",
    className,
    {
      "cursor-not-allowed opacity-50": disabled,
    }
  );

  return (
    <button
      className={buttonClassNames}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
