import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "./dashboard";
import { useGetPublicationsQuery, useGetPublicationQuery } from "../api/hooks";

jest.mock("../api/hooks");

describe("Dashboard Component", () => {
  const mockGetPublications = useGetPublicationsQuery as jest.Mock;
  const mockGetPublication = useGetPublicationQuery as jest.Mock;

  const mockPublicationData = {
    id: "1",
    name: "Publication 1",
    content: "Detailed content here.",
    created_on: "2023-01-01",
    modified_on: "2023-01-02",
    _links: {
      self: { href: "https://example.com/self" },
      next: { href: "https://example.com/next" },
    },
    uid: "12345",
    is_visible: true,
  };

  const mockPublicationsData = {
    _embedded: {
      edition: [
        {
          id: "1",
          name: "Publication 1",
          created_on: "2023-01-01",
          modified_on: "2023-01-02",
          status: "open",
          category: "movie",
        },
        {
          id: "2",
          name: "Publication 2",
          created_on: "2023-02-01",
          modified_on: "2023-02-02",
          status: "open",
          category: "movie",
        },
        {
          id: "3",
          name: "Publication 3",
          created_on: "2023-03-01",
          modified_on: "2023-03-02",
          status: "open",
          category: "movie",
        },
      ],
    },
    total_items: 2,
    page_count: 2,
    page: 1,
    page_size: 10,
  };

  beforeEach(() => {
    mockGetPublications
      .mockImplementationOnce((_, options) => {
        options?.onSuccess(mockPublicationsData);
        return {
          isLoading: true,
          error: null,
        };
      })
      .mockReturnValue({
        isLoading: false,
        error: null,
      });

    mockGetPublication.mockReturnValue({
      data: mockPublicationData,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    expect(screen.getByTestId("spinner-test-id")).toBeInTheDocument();
  });

  it("should handle a successful publications fetch", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      mockPublicationsData._embedded.edition.forEach(
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
  });

  it("should open the modal when a publication is clicked", async () => {
    render(<Dashboard />);

    mockGetPublication
      .mockImplementationOnce((_, options) => {
        options?.onSuccess();
        return {
          isLoading: true,
          error: null,
        };
      })
      .mockReturnValue({
        data: mockPublicationData,
        isLoading: false,
        error: null,
      });

    fireEvent.click(screen.getByTestId("button-1"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("should update the API filters when a filter is added", async () => {
    render(<Dashboard />);

    const select = screen.getByTestId("select-filters-test-id");
    const input = screen.getByTestId("input-filters-test-id");
    const applyButton = screen.getByTestId("apply-filter-button-test-id");

    fireEvent.change(select, { target: { value: "status" } });
    fireEvent.change(input, { target: { value: "Draft" } });
    fireEvent.click(applyButton);

    expect(mockGetPublications.mock.calls[2][0]).toEqual(
      expect.objectContaining({
        page: 1,
        limit: 10,
        filter: [{ field: "status", type: "like", value: "%Draft%" }],
      })
    );
  });

  it("should handle pagination correctly", async () => {
    render(<Dashboard />);

    const paginationButton = screen.getByText("Next");
    fireEvent.click(paginationButton);

    expect(mockGetPublications.mock.calls[2][0]).toEqual(
      expect.objectContaining({ page: 2 })
    );
  });

  it("should handle error states", async () => {
    mockGetPublications
      .mockImplementationOnce((_, options) => {
        options?.onError();
        return {
          isLoading: true,
          error: null,
        };
      })
      .mockReturnValue({
        isLoading: false,
        error: "Some Error",
      });

    render(<Dashboard />);

    expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
  });

  it("should update the entries per page correctly", async () => {
    render(<Dashboard />);

    const select = screen.getByLabelText(/Entries per page:/i);
    fireEvent.change(select, { target: { value: "10" } });

    expect(mockGetPublications.mock.calls[2][0]).toEqual(
      expect.objectContaining({ limit: 10 })
    );
  });
});
