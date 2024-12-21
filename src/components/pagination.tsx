import { FC } from "react";
import Button from "./button";

interface Props {
  currentPage?: number;
  pagesCount?: number;
  onChange: (newPage: number) => void;
  className?: string;
}

const Pagination: FC<Props> = ({
  currentPage = 1,
  pagesCount,
  className,
  onChange,
}) => {
  const disableNextPage = currentPage === pagesCount;
  const disablePreviousPage = currentPage === 1;

  return (
    <div className={className}>
      <div className="inline-flex">
        <Button
          disabled={disablePreviousPage}
          onClick={() => {
            onChange(currentPage - 1);
          }}
        >
          Prev
        </Button>

        <p className="font-medium text-gray-500 my-auto mx-2">
          Page {currentPage} of {pagesCount}
        </p>

        <Button
          disabled={disableNextPage}
          onClick={() => {
            onChange(currentPage + 1);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
