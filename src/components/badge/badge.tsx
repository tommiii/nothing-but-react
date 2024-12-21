import classNames from "classnames";
import { FC } from "react";

interface Props {
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  color?:
    | "gray"
    | "red"
    | "yellow"
    | "green"
    | "blue"
    | "indigo"
    | "purple"
    | "pink";
}

const Badge: FC<Props> = ({
  className,
  children,
  onClick,
  disabled = false,
  color = "purple",
}) => {
  const colorClasses = {
    gray: "bg-gray-50 text-gray-700 ring-gray-700/10",
    red: "bg-red-50 text-red-700 ring-red-700/10",
    yellow: "bg-yellow-50 text-yellow-700 ring-yellow-700/10",
    green: "bg-green-50 text-green-700 ring-green-700/10",
    blue: "bg-blue-50 text-blue-700 ring-blue-700/10",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-700/10",
    purple: "bg-purple-50 text-purple-700 ring-purple-700/10",
    pink: "bg-pink-50 text-pink-700 ring-pink-700/10",
  };

  const badgeClasses = classNames(
    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
    colorClasses[color],
    { "cursor-pointer": !!onClick && !disabled },
    { "cursor-not-allowed opacity-50": disabled },
    className
  );

  return (
    <div
      onClick={disabled ? undefined : onClick}
      role={onClick ? "button" : undefined}
      aria-disabled={disabled ? true : undefined}
      className={badgeClasses}
    >
      {children}
    </div>
  );
};

export default Badge;
