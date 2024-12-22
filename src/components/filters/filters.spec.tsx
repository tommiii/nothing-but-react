import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import Filters from "./filters";
import { filtersOptions } from "../../constants";
import { Filter } from "../../types";

const mockOnFilterAdd = jest.fn();
const mockOnFilterRemove = jest.fn();

const field = "category";
const anotherField = "status";

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

    fireEvent.change(select, { target: { value: field } });
    fireEvent.change(input, { target: { value: "Test Value" } });

    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockOnFilterAdd).toHaveBeenCalledWith({
        field,
        value: "Test Value",
        type: "like",
      });
    });

    expect(input).toHaveValue("");
  });

  it("should remove a filter when a badge is clicked", async () => {
    const appliedFilters: Filter[] = [
      { field, value: '"Test Filter"', type: "like" },
    ];

    renderFilters(appliedFilters);

    const badge = screen.getByText(`${field}[like]='Test Filter'`);

    fireEvent.click(badge);

    await waitFor(() => {
      expect(mockOnFilterRemove).toHaveBeenCalledWith({
        field,
        value: '"Test Filter"',
        type: "like",
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
      {
        field,
        value: "%Test Filter 1%",
        type: "like",
      },
      {
        field: anotherField,
        value: "Test Filter 2",
        type: "eq",
      },
    ];

    renderFilters(appliedFilters);

    appliedFilters.forEach((filter) => {
      const expectedValue =
        filter.type === "like" ? filter.value.slice(1, -1) : filter.value;
      expect(
        screen.getByText(`${filter.field}[${filter.type}]='${expectedValue}'`)
      ).toBeInTheDocument();
    });
  });

  it("should only show available filter options in the Select component", () => {
    const appliedFilters: Filter[] = [
      {
        field,
        value: '"Test Filter 1"',
        type: "like",
      },
    ];

    renderFilters(appliedFilters);
    const select = screen.getByTestId("select-filters-test-id");
    const options = within(select).getAllByRole("option");
    const optionValues = options.map(
      (option) => (option as HTMLOptionElement).value
    );

    expect(optionValues.length).toBe(filtersOptions.length - 1);
    expect(optionValues).not.toContain(field);
  });
});
