import classNames from "classnames";
import { FC } from "react";

interface Props {
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  // color?:
  //   | "gray"
  //   | "red"
  //   | "yellow"
  //   | "green"
  //   | "blue"
  //   | "indigo"
  //   | "purple"
  //   | "pink";
}

const Budge: FC<Props> = ({ className, children, onClick = () => {} }) => {
  return (
    <div onClick={onClick} className={className}>
      <span
        className={classNames(
          "inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10",
          { "cursor-pointer": !!onClick }
        )}
      >
        {children}
      </span>
    </div>
  );
};

export default Budge;
