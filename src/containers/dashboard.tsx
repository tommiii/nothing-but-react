import { FC, useState, useCallback } from "react";
import ReactJson from "react-json-view";
import { Modal } from "react-responsive-modal";
import { useGetPublicationsQuery, useGetPublicationQuery } from "../api/hooks";
import { entriesPerPageOptions } from "../constants";
import { APIData, APIFilters, Direction, Publication } from "../types";
import {
  Grid,
  Select,
  Input,
  Pagination,
  Filters,
  OrdersBy,
} from "../components";
import logo from "../assets/logo.png";

import "react-responsive-modal/styles.css";
import { debounce } from "lodash";

const Dashboard: FC = () => {
  const [APIFilters, setAPIFilters] = useState<APIFilters>({
    page: 1,
    limit: 5,
  });
  const [currentPublicationId, setCurrentPublicationId] = useState<string>();
  const [isModalOpen, setModalOpen] = useState(false);
  const [APIData, setAPIData] = useState<APIData>();

  const { error: publicationsError, isLoading: loadingPublications } =
    useGetPublicationsQuery(APIFilters, {
      onSuccess: (data) => {
        //TODO check data when 0
        setAPIData({
          publications: data?._embedded?.edition as Publication[],
          itemsCount: data?.total_items,
          pagesCount: data?.page_count,
          currentPage: data?.page,
          pageSize: data?.page_size,
        });
      },
    });

  const {
    data: publicationData,
    error: publicationError,
    isLoading: loadingPublication,
  } = useGetPublicationQuery(currentPublicationId as string, {
    onSuccess: () => setModalOpen(true),
    disabled: !currentPublicationId,
  });

  const isLoading = loadingPublications || loadingPublication;

  const handleFilterChange = useCallback(
    (filter: { field: string; value: string }) => {
      setAPIFilters((prev) => ({
        ...prev,
        filter: [
          ...(prev.filter || []),
          {
            field: filter.field,
            type: "like",
            value: `%${filter.value}%`,
          },
        ],
      }));
    },
    []
  );

  const handleOrderByChange = useCallback(
    (orderBy: { field: string; direction: string }) => {
      setAPIFilters((prev) => ({
        ...prev,
        "order-by": [
          ...(prev?.["order-by"] || []),
          {
            field: orderBy.field,
            type: "field",
            direction: orderBy.direction as Direction,
          },
        ],
      }));
    },
    []
  );

  const handlePaginationChange = (newPage: number) => {
    setAPIFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleEntriesPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setAPIFilters((prev) => ({
      ...prev,
      limit: Number(e.target.value),
    }));
  };

  const handleSearchInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAPIFilters((prev) => ({
        ...prev,
        filter: [
          {
            field: "name",
            type: "like",
            value: `%${e.target.value}%`,
          },
        ],
      }));
    },
    1000
  );

  const currentAPIFilters = APIFilters.filter?.filter(
    (item) => item.field !== "name"
  );

  if (publicationsError || publicationError) {
    return (
      <div className="text-red-500">
        Something went wrong loading the data. Try again
      </div>
    );
  }

  return (
    <>
      <header className="flex bg-white p-4 shadow-md">
        <img
          width="100px"
          height="90px"
          src={logo}
          alt="Logo"
          className="App-logo"
        />
        <span className="my-auto ml-3 text-lg font-semibold text-gray-600">
          Publications Dashboard
        </span>
      </header>
      <div className="p-5">
        <div className="rounded-xl p-5 bg-white shadow-md">
          {isLoading && (
            <div className="text-gray-500 text-2xl">Loading data...</div>
          )}

          <div className="rounded-lg bg-white p-5 shadow-md">
            <Input
              placeholder="Search by name..."
              onChange={handleSearchInputChange}
            />

            <Filters
              className="mt-5"
              onFilterAdd={handleFilterChange}
              onFilterRemove={(removed) => {
                setAPIFilters((prev) => ({
                  ...prev,
                  filter: prev.filter?.filter(
                    (item) =>
                      item.value !== removed.value ||
                      item.field !== removed.field
                  ),
                }));
              }}
              filtersApplied={currentAPIFilters}
            />

            <OrdersBy
              className="mt-5"
              onOrderByAdd={handleOrderByChange}
              onOrderByRemove={(removed) => {
                setAPIFilters((prev) => ({
                  ...prev,
                  "order-by": prev["order-by"]?.filter(
                    (item) =>
                      item.field !== removed.field ||
                      item.direction !== removed.direction
                  ),
                }));
              }}
              ordersByApplied={APIFilters["order-by"]}
            />
          </div>

          <div className="mt-10 rounded-lg bg-white">
            <Grid
              list={APIData?.publications}
              onClick={(id) => {
                if (currentPublicationId === id) {
                  setModalOpen(true);
                } else {
                  setCurrentPublicationId(id);
                }
              }}
            />
            <div className="mt-5 flex justify-between items-center">
              <div className="flex items-center">
                <Select
                  id="entries-per-page-select"
                  options={entriesPerPageOptions}
                  label="Entries per page:"
                  defaultValue={String(APIData?.pageSize)}
                  onChange={handleEntriesPerPageChange}
                />
                <span className="ml-3 text-gray-500">
                  of {APIData?.itemsCount} items
                </span>
              </div>
              <Pagination
                key={`${APIData?.currentPage}-${APIData?.pagesCount}`}
                pagesCount={APIData?.pagesCount}
                currentPage={APIData?.currentPage}
                onChange={handlePaginationChange}
              />
            </div>
          </div>
          <Modal open={isModalOpen} onClose={() => setModalOpen(false)} center>
            <ReactJson src={publicationData} />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
