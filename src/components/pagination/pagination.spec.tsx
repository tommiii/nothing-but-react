import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./pagination";

describe("Pagination Component", () => {
  it("should render correctly with default props", () => {
    render(<Pagination onChange={jest.fn()} />);

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(screen.getByText("Prev")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("should disable the 'Prev' button on the first page", () => {
    render(<Pagination currentPage={1} pagesCount={3} onChange={jest.fn()} />);

    const prevButton = screen.getByText("Prev");
    expect(prevButton).toBeDisabled();
  });

  it("should disable the 'Next' button on the last page", () => {
    render(<Pagination currentPage={3} pagesCount={3} onChange={jest.fn()} />);

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("should call the onChange function with the next page when 'Next' is clicked", () => {
    const onChangeMock = jest.fn();
    render(
      <Pagination currentPage={1} pagesCount={3} onChange={onChangeMock} />
    );

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(onChangeMock).toHaveBeenCalledWith(2);
  });

  it("should call the onChange function with the previous page when 'Prev' is clicked", () => {
    const onChangeMock = jest.fn();
    render(
      <Pagination currentPage={2} pagesCount={3} onChange={onChangeMock} />
    );

    const prevButton = screen.getByText("Prev");
    fireEvent.click(prevButton);

    expect(onChangeMock).toHaveBeenCalledWith(1);
  });

  it("should not change the page when 'Prev' is clicked on the first page", () => {
    const onChangeMock = jest.fn();
    render(
      <Pagination currentPage={1} pagesCount={3} onChange={onChangeMock} />
    );

    const prevButton = screen.getByText("Prev");
    fireEvent.click(prevButton);

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it("should not change the page when 'Next' is clicked on the last page", () => {
    const onChangeMock = jest.fn();
    render(
      <Pagination currentPage={3} pagesCount={3} onChange={onChangeMock} />
    );

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it("should display the correct page number and total pages", () => {
    render(<Pagination currentPage={2} pagesCount={5} onChange={jest.fn()} />);

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("should apply the custom className to the pagination container", () => {
    const { container } = render(
      <Pagination
        currentPage={2}
        pagesCount={5}
        onChange={jest.fn()}
        className="custom-class"
      />
    );
    const paginationDiv = container?.firstChild;
    expect(paginationDiv).toHaveClass("custom-class");
  });

  it("should render custom text for 'Prev' and 'Next' buttons when provided", () => {
    render(
      <Pagination
        currentPage={2}
        pagesCount={5}
        onChange={jest.fn()}
        prevText="Previous"
        nextText="Next Page"
      />
    );

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next Page")).toBeInTheDocument();
  });
});
