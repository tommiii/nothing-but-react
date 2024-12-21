import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./button";

const mockOnClick = jest.fn();

describe("Button Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render with children text", () => {
    render(<Button onClick={mockOnClick}>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", () => {
    render(<Button onClick={mockOnClick}>Click Me</Button>);

    const button = screen.getByText("Click Me");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", () => {
    render(
      <Button onClick={mockOnClick} disabled>
        Click Me
      </Button>
    );

    const button = screen.getByText("Click Me");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(0);
  });

  it("should apply 'disabled' attribute when disabled is true", () => {
    render(
      <Button onClick={mockOnClick} disabled>
        Click Me
      </Button>
    );
    const button = screen.getByText("Click Me");
    expect(button).toBeDisabled();
  });

  it("should apply custom className", () => {
    render(
      <Button onClick={mockOnClick} className="custom-class">
        Click Me
      </Button>
    );
    const button = screen.getByText("Click Me");
    expect(button).toHaveClass("custom-class");
  });

  it("applies aria-label if provided", () => {
    render(
      <Button onClick={mockOnClick} ariaLabel="close">
        Click Me
      </Button>
    );
    const button = screen.getByLabelText("close");
    expect(button).toBeInTheDocument();
  });

  it("applies aria-disabled when disabled", () => {
    render(
      <Button onClick={mockOnClick} disabled>
        Click Me
      </Button>
    );
    const button = screen.getByText("Click Me");
    expect(button).toHaveAttribute("aria-disabled", "true");
  });

  it("does not fire onClick when disabled", () => {
    render(
      <Button onClick={mockOnClick} disabled>
        Click Me
      </Button>
    );
    const button = screen.getByText("Click Me");
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("applies correct class names when disabled", () => {
    render(
      <Button onClick={mockOnClick} disabled>
        Click Me
      </Button>
    );
    const button = screen.getByText("Click Me");
    expect(button).toHaveClass("cursor-not-allowed opacity-50");
  });

  it("does not apply 'cursor-not-allowed' or 'opacity-50' when not disabled", () => {
    render(<Button onClick={mockOnClick}>Click Me</Button>);
    const button = screen.getByText("Click Me");
    expect(button).not.toHaveClass("cursor-not-allowed");
    expect(button).not.toHaveClass("opacity-50");
  });
});
