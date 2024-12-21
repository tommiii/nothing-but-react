import { render, screen, fireEvent } from "@testing-library/react";
import Badge from "./badge";

describe("Badge Component", () => {
  it("should render with children", () => {
    render(<Badge>Test Badge</Badge>);
    const badge = screen.getByText("Test Badge");
    expect(badge).toBeInTheDocument();
  });

  it('should apply the correct color classes based on the "color" prop', () => {
    const { rerender } = render(<Badge color="red">Red Badge</Badge>);
    const badge = screen.getByText("Red Badge");
    expect(badge).toHaveClass("bg-red-50 text-red-700 ring-red-700/10");

    rerender(<Badge color="green">Green Badge</Badge>);
    expect(badge).toHaveClass("bg-green-50 text-green-700 ring-green-700/10");
  });

  it("should trigger the onClick handler when not disabled and clicked", () => {
    const handleClick = jest.fn();
    render(<Badge onClick={handleClick}>Click Me</Badge>);

    const badge = screen.getByText("Click Me");
    fireEvent.click(badge);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not trigger the onClick handler when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Badge disabled onClick={handleClick}>
        Disabled Badge
      </Badge>
    );

    const badge = screen.getByText("Disabled Badge");
    fireEvent.click(badge);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should have the correct class when disabled", () => {
    render(<Badge disabled>Disabled Badge</Badge>);
    const badge = screen.getByText("Disabled Badge");
    expect(badge).toHaveClass("cursor-not-allowed opacity-50");
  });

  it("should apply a custom className prop", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    const badge = screen.getByText("Custom Badge");
    expect(badge).toHaveClass("custom-class");
  });

  it('should not have onClick and role="button" when no onClick handler is passed', () => {
    render(<Badge>Non-clickable Badge</Badge>);
    const badge = screen.getByText("Non-clickable Badge");
    expect(badge).not.toHaveAttribute("role");
    expect(badge).not.toHaveClass("cursor-pointer");
  });

  it("should set aria-disabled to true when disabled", () => {
    render(<Badge disabled>Disabled Badge</Badge>);
    const badge = screen.getByText("Disabled Badge");
    expect(badge).toHaveAttribute("aria-disabled", "true");
  });
});
