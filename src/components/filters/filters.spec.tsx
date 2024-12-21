import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Filters from "./filters";
import { filtersOptions } from "../../constants";
import { Filter } from "../../types";

const mockOnFilterAdd = jest.fn();
const mockOnFilterRemove = jest.fn();

const renderFilters = (filtersApplied: Filter[] = []) => {
  render(
    <Filters
      onFilterAdd={mockOnFilterAdd}
      onFilterRemove={mockOnFilterRemove}
      filtersApplied={filtersApplied}
    />
  );
};

describe("Filters Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component", () => {
    renderFilters();
    screen.getByLabelText(/select filter/i);
    screen.getByPlaceholderText(/filter value/i);
    screen.getByRole("button", { name: /apply/i });
  });

  it("should apply a filter when the apply button is clicked", async () => {
    renderFilters();

    const select = screen.getByLabelText(/select filter/i);
    const input = screen.getByPlaceholderText(/filter value/i);
    const applyButton = screen.getByRole("button", { name: /apply/i });

    fireEvent.change(select, { target: { value: filtersOptions[1].value } });
    fireEvent.change(input, { target: { value: "Test Value" } });

    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockOnFilterAdd).toHaveBeenCalledWith({
        field: filtersOptions[1].value,
        value: "Test Value",
      });
    });

    expect(input).toHaveValue("");
  });

  it("should remove a filter when a badge is clicked", async () => {
    const appliedFilters: Filter[] = [
      { field: filtersOptions[1].value, value: '"Test Filter"' },
    ];

    renderFilters(appliedFilters);

    const badge = screen.getByText(`${filtersOptions[1].value}='Test Filter'`);

    fireEvent.click(badge);

    await waitFor(() => {
      expect(mockOnFilterRemove).toHaveBeenCalledWith({
        field: filtersOptions[1].value,
        value: '"Test Filter"',
      });
    });
  });

  it("should disable the apply button when no value is entered", () => {
    renderFilters();

    const applyButton = screen.getByRole("button", { name: /apply/i });
    const input = screen.getByPlaceholderText(/filter value/i);

    expect(applyButton).toBeDisabled();

    fireEvent.change(input, { target: { value: "Test Value" } });
    expect(applyButton).not.toBeDisabled();

    fireEvent.change(input, { target: { value: "" } });
    expect(applyButton).toBeDisabled();
  });

  it("should display applied filters as badges", () => {
    const appliedFilters: Filter[] = [
      { field: filtersOptions[0].value, value: '"Test Filter 1"' },
      { field: filtersOptions[1].value, value: '"Test Filter 2"' },
    ];

    renderFilters(appliedFilters);

    appliedFilters.forEach((filter) => {
      expect(
        screen.getByText(`${filter.field}='${filter.value.slice(1, -1)}'`)
      ).toBeInTheDocument();
    });
  });

  it("should only show available filter options in the Select component", () => {
    const appliedFilters: Filter[] = [
      { field: filtersOptions[0].value, value: '"Test Filter 1"' },
    ];

    renderFilters(appliedFilters);
    const options = screen.getAllByRole("option");
    const optionValues = options.map(
      (option) => (option as HTMLOptionElement).value
    );

    expect(optionValues.length).toBe(filtersOptions.length - 1);
    expect(optionValues).not.toContain(filtersOptions[0].value);
  });
});
