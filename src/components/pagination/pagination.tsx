import { FC } from "react";
import Button from "../button/button";

interface Props {
  currentPage?: number;
  pagesCount?: number;
  onChange: (newPage: number) => void;
  className?: string;
  prevText?: string;
  nextText?: string;
}

const Pagination: FC<Props> = ({
  currentPage = 1,
  pagesCount = 1,
  className,
  onChange,
  prevText = "Prev",
  nextText = "Next",
}) => {
  const disablePreviousPage = currentPage === 1 || !currentPage;
  const disableNextPage = currentPage === pagesCount || !pagesCount;

  const handlePrevClick = () => {
    if (!disablePreviousPage) {
      onChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (!disableNextPage) {
      onChange(currentPage + 1);
    }
  };

  return (
    <div className={className}>
      <div className="inline-flex items-center">
        <Button
          disabled={disablePreviousPage}
          onClick={handlePrevClick}
          aria-label="Go to previous page"
        >
          {prevText}
        </Button>

        <p className="font-medium text-gray-500 my-auto mx-2">
          Page {currentPage} of {pagesCount}
        </p>

        <Button
          disabled={disableNextPage}
          onClick={handleNextClick}
          aria-label="Go to next page"
        >
          {nextText}
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
