import { FC, useState, useCallback } from "react";
import ReactJson from "react-json-view";
import { Modal } from "react-responsive-modal";
import { useGetPublicationsQuery, useGetPublicationQuery } from "../api/hooks";
import { entriesPerPageOptions } from "../constants";
import { APIData, APIFilters, Direction, Filter, Publication } from "../types";
import {
  Grid,
  Select,
  Input,
  Pagination,
  Filters,
  OrdersBy,
} from "../components";
import { ToastContainer, toast } from "react-toastify";
import { Collapse } from "@kunukn/react-collapse";

import logo from "../assets/logo.png";

import { debounce } from "lodash";

const Dashboard: FC = () => {
  const [APIFilters, setAPIFilters] = useState<APIFilters>({
    page: 1,
    limit: 10,
  });
  const [currentPublicationId, setCurrentPublicationId] = useState<string>();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCollapseOpen, setCollapseOpen] = useState(false);
  const [APIData, setAPIData] = useState<APIData>();

  const { isLoading: loadingPublications } = useGetPublicationsQuery(
    APIFilters,
    {
      onSuccess(data) {
        setAPIData({
          publications: data?._embedded?.edition as Publication[],
          itemsCount: data?.total_items,
          pagesCount: data?.page_count,
          currentPage: data?.page,
          pageSize: data?.page_size,
        });
      },
      onError() {
        toast.error(
          <span>
            Something went wrong! <a href=".">Reload!</a>
          </span>
        );
        setAPIData(undefined);
      },
    }
  );

  const { data: publicationData, isLoading: loadingPublication } =
    useGetPublicationQuery(currentPublicationId as string, {
      onSuccess: () => setModalOpen(true),
      onError() {
        toast.error(
          <span>
            Something went wrong! <a href=".">Reload!</a>
          </span>
        );
        setCurrentPublicationId(undefined);
      },
      disabled: !currentPublicationId,
    });

  const isLoading = loadingPublications || loadingPublication;

  const handleFilterAdd = useCallback((filter: Filter) => {
    const value = filter.type === "like" ? `%${filter.value}%` : filter.value;
    setAPIFilters((prev) => ({
      ...prev,
      page: 1,
      filter: [
        ...(prev.filter || []),
        {
          field: filter.field,
          type: filter.type,
          value,
        },
      ],
    }));
  }, []);

  const handleFilterRemove = useCallback((filter: Filter) => {
    setAPIFilters((prev) => ({
      ...prev,
      page: 1,
      filter: prev.filter?.filter(
        (item) => item.value !== filter.value || item.field !== filter.field
      ),
    }));
  }, []);

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

  return (
    <>
      <header className="flex bg-white sticky top-0 z-10 p-4 shadow-md">
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
        {isLoading && (
          <div
            data-testid="spinner-test-id"
            className="animate-spin ml-auto my-auto rounded-full h-6 w-6 border-4 border-primary border-t-transparent"
          ></div>
        )}
      </header>
      <div className="p-5">
        <div className="rounded-xl p-5 bg-white shadow-md">
          <div className="flex">
            <Input
              placeholder="Search by name..."
              onChange={handleSearchInputChange}
              className="w-full"
            />
            <svg
              className="cursor-pointer my-auto text-primary fill-current"
              onClick={() => setCollapseOpen((prev) => !prev)}
              width="30"
              height="15"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z" />
            </svg>
          </div>
          <Collapse isOpen={isCollapseOpen}>
            <div className="rounded-lg bg-white p-5 shadow-md">
              <Filters
                className="mt-5"
                onFilterAdd={handleFilterAdd}
                onFilterRemove={handleFilterRemove}
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
          </Collapse>
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
              disableInteraction={isLoading}
            />
            <div className="mt-5 flex flex-wrap sm:justify-between justify-center text-center items-center">
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
          <ToastContainer data-testid="error-toast-test-id" theme="colored" />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
