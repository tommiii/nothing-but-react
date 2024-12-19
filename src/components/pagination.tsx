import { FC } from "react";
import classNames from "classnames";

interface Props {
  currentPage: number;
  pagesCount: number;
  onChange: (newPage: number) => void;
}

const Pagination: FC<Props> = ({ currentPage, pagesCount, onChange }) => {
  const disableNextPage = currentPage === pagesCount;
  const disablePreviousPage = currentPage === 1;

  return (
    <>
      <div className="inline-flex">
        <button
          disabled={disablePreviousPage}
          className={classNames(
            "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded",
            { "cursor-not-allowed": disablePreviousPage }
          )}
          onClick={() => {
            onChange(currentPage - 1);
          }}
        >
          Prev
        </button>
        <p className="text-gray-500 my-auto mx-2">
          Page {currentPage} of {pagesCount}
        </p>
        <button
          disabled={disableNextPage}
          className={classNames(
            "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded",
            { "cursor-not-allowed": disableNextPage }
          )}
          onClick={() => {
            onChange(currentPage + 1);
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Pagination;
