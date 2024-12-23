import { render, screen, fireEvent } from "@testing-library/react";
import PublicationsGrid from "./publications-grid";

describe("Grid component", () => {
  const mockOnClick = jest.fn();

  const publications = [
    {
      id: "1",
      name: "Publication 1",
      status: "Published",
      category: "Tech",
      created_on: "2024-01-01",
      modified_on: "2024-01-10",
    },
    {
      id: "2",
      name: "Publication 2",
      status: "Draft",
      category: "Business",
      created_on: "2024-02-01",
      modified_on: "2024-02-10",
    },
  ];

  it("should render 'No publications available' when list is empty", () => {
    render(<PublicationsGrid list={[]} onClick={mockOnClick} />);
    expect(screen.getByText(/No publications available/i)).toBeInTheDocument();
  });

  it("should render publication details correctly", () => {
    render(<PublicationsGrid list={publications} onClick={mockOnClick} />);

    publications.forEach(
      ({ id, name, status, category, created_on, modified_on }) => {
        const publicationRow = screen.getByTestId(`row-${id}`);

        expect(publicationRow).toHaveTextContent(name);
        expect(publicationRow).toHaveTextContent(`Status: ${status}`);
        expect(publicationRow).toHaveTextContent(`Category: ${category}`);
        expect(publicationRow).toHaveTextContent(`Created: ${created_on}`);
        expect(publicationRow).toHaveTextContent(`Modified: ${modified_on}`);
      }
    );
  });

  it("should click 'View' button and trigger onClick with correct id", () => {
    render(<PublicationsGrid list={publications} onClick={mockOnClick} />);

    publications.forEach((publication) => {
      fireEvent.click(screen.getByTestId(`button-${publication.id}`));
      expect(mockOnClick).toHaveBeenCalledWith(publication.id);
    });
  });

  it("should render N/A for missing status or category", () => {
    const publicationsWithMissingData = [
      {
        id: "3",
        name: "Publication 3",
        status: undefined,
        category: undefined,
        created_on: "2024-03-01",
        modified_on: "2024-03-10",
      },
    ];

    render(
      <PublicationsGrid
        list={publicationsWithMissingData}
        onClick={mockOnClick}
      />
    );

    const publicationRow = screen.getByTestId(
      `row-${publicationsWithMissingData[0].id}`
    );
    expect(publicationRow).toHaveTextContent("Status: N/A");
    expect(publicationRow).toHaveTextContent("Category: N/A");
  });
});
