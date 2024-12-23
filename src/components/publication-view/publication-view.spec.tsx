import { render, screen } from "@testing-library/react";
import PublicationView from "./publication-view";
import { Publication } from "../../types";

const mockPublication: Publication = {
  id: "1",
  name: "Test Publication",
  identifier: "test-identifier",
  uid: "12345",
  is_visible: true,
  status: "Published",
  category: "Science",
  created_on: "2023-12-01",
  modified_on: "2023-12-10",
  _links: {
    self: { href: "https://example.com/self" },
    next: { href: "https://example.com/next" },
  },
};

const publicationWithFourIncompleteField: Publication = {
  ...mockPublication,
  status: undefined,
  category: undefined,
  created_on: "",
  modified_on: "",
};

describe("PublicationView Component", () => {
  it("should render the publication name correctly", () => {
    render(<PublicationView publication={mockPublication} />);
    expect(screen.getByText("Test Publication:")).toBeInTheDocument();
  });

  it("should render all publication details", () => {
    render(<PublicationView publication={mockPublication} />);
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("Test Publication")).toBeInTheDocument();

    expect(screen.getByText("Identifier:")).toBeInTheDocument();
    expect(screen.getByText("test-identifier")).toBeInTheDocument();

    expect(screen.getByText("UID:")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();

    expect(screen.getByText("Visible:")).toBeInTheDocument();
    expect(screen.getByText("true")).toBeInTheDocument();

    expect(screen.getByText("Status:")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();

    expect(screen.getByText("Category:")).toBeInTheDocument();
    expect(screen.getByText("Science")).toBeInTheDocument();

    expect(screen.getByText("Created:")).toBeInTheDocument();
    expect(screen.getByText("2023-12-01")).toBeInTheDocument();

    expect(screen.getByText("Modified:")).toBeInTheDocument();
    expect(screen.getByText("2023-12-10")).toBeInTheDocument();
  });

  it("should render links correctly", () => {
    render(<PublicationView publication={mockPublication} />);
    const selfLink = screen.getByText("self");
    const nextLink = screen.getByText("next");

    expect(selfLink).toBeInTheDocument();
    expect(selfLink.closest("a")).toHaveAttribute(
      "href",
      "https://example.com/self"
    );

    expect(nextLink).toBeInTheDocument();
    expect(nextLink.closest("a")).toHaveAttribute(
      "href",
      "https://example.com/next"
    );
  });

  it("should render 'N/A' for missing fields", () => {
    render(
      <PublicationView publication={publicationWithFourIncompleteField} />
    );
    expect(screen.getAllByText("N/A").length).toBe(4);
  });

  it("handles empty links gracefully", () => {
    const noLinksPublication: Publication = {
      ...mockPublication,
      _links: {},
    };

    render(<PublicationView publication={noLinksPublication} />);
    expect(screen.getByText("Links:")).toBeInTheDocument();
    expect(
      screen.queryByText(/https:\/\/example\.com/)
    ).not.toBeInTheDocument();
  });
});
