import { FC, useCallback } from "react";
import classNames from "classnames";
import { Publication } from "../../types";
import { Button } from "../button";

interface Props {
  list: Publication[] | undefined;
  onClick: (id: string) => void;
}

const renderStatus = (status?: string) => (
  <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
    {status ?? "N/A"}
  </span>
);

const renderCategory = (category?: string) => (
  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
    {category ?? "N/A"}
  </span>
);

const Grid: FC<Props> = ({ list = [], onClick }) => {
  const handleClick = useCallback(
    (id: string) => {
      onClick(id);
    },
    [onClick]
  );

  if (!list?.length)
    return <p className="text-center">No publications available.</p>;

  return (
    <div className="flex flex-col space-y-4">
      {list.map((item, index) => (
        <div
          key={item.id}
          className={classNames(
            "grid grid-cols-4 gap-4 border-l-8 border-l-secondary border shadow-xl rounded-lg p-3 text-sm",
            index > 0 && "mt-5"
          )}
          data-testid={`row-${item.id}`}
        >
          <div>
            <span className="font-semibold">Name:</span> {item.name}
          </div>
          <div>
            <span className="font-semibold">Status:</span>{" "}
            {renderStatus(item.status)}
          </div>
          <div>
            <span className="font-semibold">Category:</span>{" "}
            {renderCategory(item.category)}
          </div>
          <div className="ml-auto row-span-2 my-auto">
            <Button
              id={item.id}
              aria-label={`View publication ${item.name || "Unnamed"}`}
              onClick={() => handleClick(item.id)}
            >
              View
            </Button>
          </div>
          <div>
            <span className="font-semibold">Created:</span>{" "}
            {item.created_on || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Modified:</span>{" "}
            {item.modified_on || "N/A"}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Grid;
