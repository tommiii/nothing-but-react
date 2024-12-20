import { FC } from "react";
import classNames from "classnames";

interface Props {
  currentPage: number;
  pagesCount: number;
  onChange: (newPage: number) => void;
  className?: string;
}

const Pagination: FC<Props> = ({
  currentPage,
  pagesCount,
  className,
  onChange,
}) => {
  const disableNextPage = currentPage === pagesCount;
  const disablePreviousPage = currentPage === 1;

  return (
    <div className={className}>
      <div className="inline-flex">
        <button
          className={classNames(
            "bg-primary hover:bg-tertiary text-white font-bold py-2 px-4 rounded-full",
            { "cursor-not-allowed": disablePreviousPage }
          )}
          disabled={disablePreviousPage}
          onClick={() => {
            onChange(currentPage - 1);
          }}
        >
          Prev
        </button>

        <p className="font-medium text-gray-500 my-auto mx-2">
          Page {currentPage} of {pagesCount}
        </p>

        <button
          className={classNames(
            "bg-primary hover:bg-tertiary text-white font-bold py-2 px-4 rounded-full",
            { "cursor-not-allowed": disableNextPage }
          )}
          disabled={disableNextPage}
          onClick={() => {
            onChange(currentPage + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
