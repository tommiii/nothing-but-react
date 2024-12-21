import { render, screen, fireEvent } from "@testing-library/react";
import Select from "./select";

const options = [
  { value: "1", displayValue: "Option 1" },
  { value: "2", displayValue: "Option 2" },
  { value: "3", displayValue: "Option 3" },
];

describe("Select component", () => {
  it("should render the label when provided", () => {
    render(
      <Select options={options} onChange={jest.fn()} label="Choose an option" />
    );

    const label = screen.getByText(/choose an option/i);
    expect(label).toBeInTheDocument();
  });

  it("should not render the label when not provided", () => {
    render(<Select options={options} onChange={jest.fn()} />);

    const label = screen.queryByText(/choose an option/i);
    expect(label).toBeNull();
  });

  it("should render the correct options", () => {
    render(<Select options={options} onChange={jest.fn()} />);

    const optionElements = screen.getAllByRole("option");
    expect(optionElements).toHaveLength(options.length);

    options.forEach((option, index) => {
      expect(optionElements[index]).toHaveTextContent(option.displayValue);
    });
  });

  it("should set the default value correctly", () => {
    render(<Select options={options} onChange={jest.fn()} defaultValue="2" />);

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toHaveValue("2");
  });

  it("should call onChange when an option is selected", () => {
    const handleChange = jest.fn();
    render(<Select options={options} onChange={handleChange} />);

    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "3" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    const event = handleChange.mock.calls[0][0];
    expect(event.target.value).toBe("3");
  });

  it("should apply custom className correctly", () => {
    const { container } = render(
      <Select options={options} onChange={jest.fn()} className="custom-class" />
    );
    const divElement = container.firstChild;
    expect(divElement).toHaveClass("custom-class");
  });
});
