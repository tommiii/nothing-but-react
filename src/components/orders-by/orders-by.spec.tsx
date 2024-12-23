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

    const selectField = screen.getByTestId("select-order-by-test-id");
    const selectDirection = screen.getByTestId("select-direction-test-id");
    const applyButton = screen.getByTestId("apply-order-by-button-test-id");

    expect(selectField).toBeInTheDocument();
    expect(selectDirection).toBeInTheDocument();
    expect(applyButton).toBeInTheDocument();
  });

  it("should initialize with the first field and direction", () => {
    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
      />
    );

    const selectField = screen.getByTestId("select-order-by-test-id");
    const selectDirection = screen.getByTestId("select-direction-test-id");

    expect(selectField).toHaveValue(placeholderValue);
    expect(selectDirection).toHaveValue("ASC");
  });

  it("should update draft state when selecting a field", () => {
    render(
      <OrdersBy
        onOrderByAdd={mockOnOrderByAdd}
        onOrderByRemove={mockOnOrderByRemove}
      />
    );
    const selectField = screen.getByTestId("select-order-by-test-id");
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
    const selectDirection = screen.getByTestId("select-direction-test-id");
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
    const selectField = screen.getByTestId("select-order-by-test-id");
    const selectDirection = screen.getByTestId("select-direction-test-id");

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
    const selectField = screen.getByTestId("select-order-by-test-id");
    const applyButton = screen.getByTestId("apply-order-by-button-test-id");

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
    const applyButton = screen.getByTestId("apply-order-by-button-test-id");

    expect(applyButton).toBeDisabled();

    const selectField = screen.getByTestId("select-order-by-test-id");
    fireEvent.change(selectField, {
      target: { value: field },
    });

    expect(applyButton).toBeEnabled();
  });
});
