import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./input";

describe("Input Component", () => {
  it("should render with placeholder text", () => {
    render(<Input placeholder="Enter your name" onChange={() => {}} />);

    expect(screen.getByPlaceholderText(/Enter your name/i)).toBeInTheDocument();
  });

  it("should call onChange handler when value is changed", () => {
    const mockOnChange = jest.fn();
    render(<Input placeholder="Type something" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(/Type something/i);
    fireEvent.change(input, { target: { value: "Test input" } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it("should display the correct value from the value prop", () => {
    render(
      <Input placeholder="Enter text" value="Test value" onChange={() => {}} />
    );

    expect(screen.getByDisplayValue(/Test value/i)).toBeInTheDocument();
  });

  it("should apply custom className correctly", () => {
    render(
      <Input
        placeholder="Custom class"
        className="custom-class"
        onChange={() => {}}
      />
    );

    const inputElement = screen
      .getByPlaceholderText(/Custom class/i)
      .closest("div");
    expect(inputElement).toHaveClass("custom-class");
  });
});
