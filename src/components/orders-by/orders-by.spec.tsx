import { render, screen, fireEvent } from "@testing-library/react";
import OrdersBy from "./orders-by";
import { orderByOptions } from "../../constants";
import { OrderBy } from "../../types";

const mockOnOrderByAdd = jest.fn();
const mockOnOrderByRemove = jest.fn();

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
      orderByOptions[0].value
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
      target: { value: orderByOptions[1].value },
    });

    expect(selectField).toHaveValue(orderByOptions[1].value);
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

    // Change the field and direction
    fireEvent.change(selectField, {
      target: { value: orderByOptions[1].value },
    });
    fireEvent.change(selectDirection, { target: { value: "DESC" } });

    const applyButton = screen.getByRole("button", { name: /apply/i });
    fireEvent.click(applyButton);

    expect(mockOnOrderByAdd).toHaveBeenCalledWith({
      field: orderByOptions[1].value,
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
      target: { value: orderByOptions[0].value },
    }); // Keep it as default

    fireEvent.click(applyButton);
    expect(mockOnOrderByAdd).not.toHaveBeenCalled();
  });

  it("should render applied orders in badges", () => {
    const ordersByApplied: OrderBy[] = [
      { field: "field1", type: "field", direction: "ASC" },
      { field: "field2", type: "field", direction: "DESC" },
    ];

    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
        ordersByApplied={ordersByApplied}
      />
    );

    // Check that the badges are rendered for applied orders
    expect(screen.getByText("field1='ASC'")).toBeInTheDocument();
    expect(screen.getByText("field2='DESC'")).toBeInTheDocument();
  });

  it("should call onOrderByRemove when a badge is clicked", () => {
    const ordersByApplied: OrderBy[] = [
      { field: "field1", type: "field", direction: "ASC" },
      { field: "field2", type: "field", direction: "DESC" },
    ];

    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
        ordersByApplied={ordersByApplied}
      />
    );

    const badge = screen.getByText("field1='ASC'");
    fireEvent.click(badge);

    expect(mockOnOrderByRemove).toHaveBeenCalledWith({
      field: "field1",
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
      target: { value: orderByOptions[1].value },
    });

    // Apply button should be enabled after selecting a valid field
    expect(applyButton).toBeEnabled();
  });
});
