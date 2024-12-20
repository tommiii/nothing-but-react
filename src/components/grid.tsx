import { FC } from "react";
import classNames from "classnames";
import { Publication } from "../types";

interface Props {
  list: Publication[] | undefined;
  onClick: (id: string) => void;
}

const Grid: FC<Props> = ({ list = [], onClick }) => {
  return (
    <div className="flex flex-col">
      {list.map((item, index) => (
        <div
          className={classNames(
            "grid grid-cols-4 gap-4 border border-l-8 border-l-secondary shadow-xl rounded-lg p-3 text-sm first-mt-5",
            { "mt-5": index > 0 }
          )}
        >
          <div>
            <span className="font-semibold">Name:</span> {item.name}
          </div>
          <div>
            <span className="font-semibold">Status</span>
          </div>
          <div>
            <span className="font-semibold">Category</span>
          </div>
          <div className="text-center">
            <span className="font-semibold">Actions</span>
          </div>
          <div>
            <span className="font-semibold">Created:</span> {item.created_on}
          </div>
          <div>
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
              {item.status || "N/A"}
            </span>
          </div>

          <div>
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              {item.category || "N/A"}
            </span>
          </div>
          <div className="text-center">
            <button
              onClick={() => {
                onClick(item.id);
              }}
              className="bg-primary hover:bg-tertiary text-white font-bold py-2 px-4 rounded-full"
            >
              View
            </button>
          </div>
          <div>
            <span className="font-semibold">Modified:</span> {item.modified_on}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Grid;
