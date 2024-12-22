import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "./dashboard";
import { useGetPublicationsQuery, useGetPublicationQuery } from "../api/hooks";
import { APIData } from "../types";

jest.mock("../api/hooks");

describe("Dashboard Component", () => {
  const mockGetPublications = useGetPublicationsQuery as jest.Mock;
  const mockGetPublication = useGetPublicationQuery as jest.Mock;

  const mockPublicationsData: APIData = {
    itemsCount: 10,
    pagesCount: 2,
    currentPage: 1,
    pageSize: 5,
    publications: [
      {
        id: "1",
        name: "Publication 1",
        created_on: "2023-01-01",
        modified_on: "2023-01-02",
      },
      {
        id: "2",
        name: "Publication 2",
        created_on: "2023-02-01",
        modified_on: "2023-02-02",
      },
      {
        id: "3",
        name: "Publication 3",
        created_on: "2023-03-01",
        modified_on: "2023-03-02",
      },
      {
        id: "4",
        name: "Publication 4",
        created_on: "2023-04-01",
        modified_on: "2023-04-02",
      },
      {
        id: "5",
        name: "Publication 5",
        created_on: "2023-05-01",
        modified_on: "2023-05-02",
      },
    ],
  };

  const mockPublicationData = {
    id: "1",
    name: "Publication 1",
    content: "Detailed content here.",
    created_on: "2023-01-01",
    modified_on: "2023-01-02",
  };

  beforeEach(() => {
    mockGetPublications.mockReturnValue({
      data: mockPublicationsData,
      isLoading: false,
      error: null,
    });

    mockGetPublication.mockReturnValue({
      data: mockPublicationData,
      isLoading: false,
      error: null,
    });
  });

  it("should render the component correctly", async () => {
    render(<Dashboard />);

    expect(screen.getByText(/Publications Dashboard/i)).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Search by name.../i)
    ).toBeInTheDocument();

    mockGetPublications.mockReturnValueOnce({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<Dashboard />);

    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
  });

  it("should handle a successful publications fetch", async () => {
    render(<Dashboard />);

    // Check if publications are rendered correctly
    await waitFor(() => {
      expect(screen.getByText("Publication 1")).toBeInTheDocument();
      expect(screen.getByText("Publication 2")).toBeInTheDocument();
      expect(screen.getByText("Publication 3")).toBeInTheDocument();
      expect(screen.getByText("Publication 4")).toBeInTheDocument();
      expect(screen.getByText("Publication 5")).toBeInTheDocument();
    });
  });

  it("should open the modal when a publication is clicked", async () => {
    render(<Dashboard />);

    // Click on the first publication
    fireEvent.click(screen.getByText("Publication 1"));

    // Check if the modal is open and contains the correct content
    expect(screen.getByText("Detailed content here.")).toBeInTheDocument();
  });

  it("should close the modal when the close button is clicked", async () => {
    render(<Dashboard />);

    // Open the modal first
    fireEvent.click(screen.getByText("Publication 1"));

    // Click on the close button of the modal
    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    // Check if the modal is closed
    expect(
      screen.queryByText("Detailed content here.")
    ).not.toBeInTheDocument();
  });

  it("should update the API filters when a filter is added", async () => {
    render(<Dashboard />);

    // Mock adding a filter
    const mockSetAPIFilters = jest.fn();
    mockGetPublications.mockImplementationOnce(() => ({
      data: mockPublicationsData,
      isLoading: false,
      error: null,
    }));

    // Simulate a filter action
    fireEvent.change(screen.getByPlaceholderText(/Search by name.../i), {
      target: { value: "Publication 1" },
    });

    // Debounce input is invoked - wait for the filter update
    await waitFor(() =>
      expect(mockSetAPIFilters).toHaveBeenCalledWith({
        page: 1,
        limit: 5,
        filter: [{ field: "name", type: "like", value: "%Publication 1%" }],
      })
    );
  });

  it("should handle pagination correctly", async () => {
    render(<Dashboard />);

    // Check pagination and simulate page change
    const paginationButton = screen.getByText("Next");
    fireEvent.click(paginationButton);

    // Check that the page was updated (this test depends on your pagination logic)
    expect(mockGetPublications).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2, // Page 2 should be passed after clicking next
      })
    );
  });

  it("should handle error states", async () => {
    // Simulate error in fetching publications
    mockGetPublications.mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: { message: "Error fetching publications" },
    });

    render(<Dashboard />);

    // Expect an error message to be shown
    expect(
      screen.getByText(/Something went wrong loading the data. Try again/i)
    ).toBeInTheDocument();
  });

  it("should update the entries per page correctly", async () => {
    render(<Dashboard />);

    // Change the entries per page
    const select = screen.getByLabelText(/Entries per page:/i);
    fireEvent.change(select, { target: { value: "10" } });

    // Check if the API filter is updated correctly
    expect(mockGetPublications).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 10, // Verify limit changed
      })
    );
  });
});
