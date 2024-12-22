import { render, screen, fireEvent } from "@testing-library/react";
import OrdersBy from "./orders-by";
import { orderByOptions } from "../../constants";
import { OrderBy } from "../../types";

const mockOnOrderByAdd = jest.fn();
const mockOnOrderByRemove = jest.fn();

const field = "category";
const anotherField = "status";
const placeholderValue = orderByOptions[0].value;

describe("OrdersBy Component", () => {
  beforeEach(() => {
    mockOnOrderByAdd.mockClear();
    mockOnOrderByRemove.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render", () => {
    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
      />
    );
    expect(screen.getByLabelText("Select order by:")).toBeInTheDocument();
    expect(screen.getByLabelText("Direction:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apply/i })).toBeInTheDocument();
  });

  it("should initialize with the first field and direction", () => {
    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
      />
    );
    expect(screen.getByLabelText("Select order by:")).toHaveValue(
      placeholderValue
    );
    expect(screen.getByLabelText("Direction:")).toHaveValue("ASC");
  });

  it("should update draft state when selecting a field", () => {
    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
      />
    );
    const selectField = screen.getByLabelText("Select order by:");
    fireEvent.change(selectField, {
      target: { value: field },
    });

    expect(selectField).toHaveValue(field);
  });

  it("should update draft direction when selecting a direction", () => {
    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
      />
    );
    const selectDirection = screen.getByLabelText("Direction:");
    fireEvent.change(selectDirection, { target: { value: "DESC" } });

    expect(selectDirection).toHaveValue("DESC");
  });

  it("should call onOrderByAdd when the apply button is clicked", () => {
    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
      />
    );
    const selectField = screen.getByLabelText("Select order by:");
    const selectDirection = screen.getByLabelText("Direction:");

    fireEvent.change(selectField, {
      target: { value: field },
    });
    fireEvent.change(selectDirection, { target: { value: "DESC" } });

    const applyButton = screen.getByRole("button", { name: /apply/i });
    fireEvent.click(applyButton);

    expect(mockOnOrderByAdd).toHaveBeenCalledWith({
      field,
      type: "field",
      direction: "DESC",
    });
  });

  it("should not call onOrderByAdd when the apply button is clicked without a valid selection", () => {
    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
      />
    );
    const selectField = screen.getByLabelText("Select order by:");
    const applyButton = screen.getByRole("button", { name: /apply/i });

    fireEvent.change(selectField, {
      target: { value: placeholderValue },
    });

    fireEvent.click(applyButton);
    expect(mockOnOrderByAdd).not.toHaveBeenCalled();
  });

  it("should render applied orders in badges", () => {
    const ordersByApplied: OrderBy[] = [
      { field, type: "field", direction: "ASC" },
      { field: anotherField, type: "field", direction: "DESC" },
    ];

    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
        ordersByApplied={ordersByApplied}
      />
    );

    // Check that the badges are rendered for applied orders
    expect(screen.getByText(`${field}='ASC'`)).toBeInTheDocument();
    expect(screen.getByText(`${anotherField}='DESC'`)).toBeInTheDocument();
  });

  it("should call onOrderByRemove when a badge is clicked", () => {
    const ordersByApplied: OrderBy[] = [
      { field, type: "field", direction: "ASC" },
      { field: anotherField, type: "field", direction: "DESC" },
    ];

    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
        ordersByApplied={ordersByApplied}
      />
    );

    const badge = screen.getByText(`${field}='ASC'`);
    fireEvent.click(badge);

    expect(mockOnOrderByRemove).toHaveBeenCalledWith({
      field,
      type: "field",
      direction: "ASC",
    });
  });

  it("should disable apply button when no field is selected", () => {
    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
      />
    );
    const applyButton = screen.getByRole("button", { name: /apply/i });

    // Apply button should be disabled when the default field is selected
    expect(applyButton).toBeDisabled();

    const selectField = screen.getByLabelText("Select order by:");
    fireEvent.change(selectField, {
      target: { value: field },
    });

    // Apply button should be enabled after selecting a valid field
    expect(applyButton).toBeEnabled();
  });
});
