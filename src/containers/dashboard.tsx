import { FC, useState } from "react";
import { useGetPublicationsQuery, useGetPublicationQuery } from "../api/hooks";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import ReactJson from "react-json-view";
import Grid from "../components/grid";
import debounce from "lodash.debounce";
import Select from "../components/select";
import { entriesPerPageOptions } from "../constants";
import Input from "../components/input";
import logo from "../assets/logo.png";
import Pagination from "../components/pagination";
import { APIData, APIFilters, Publication } from "../types";
import Filters from "../components/filters";
import OrdersBy from "../components/orders-by";

const Dashboard: FC = () => {
  const [APIFilters, setAPIFilters] = useState<APIFilters>({
    page: 1,
    limit: 5,
  });

  console.log({ APIFilters });

  const [currentPublicationId, setCurrentPublicationId] = useState<string>();
  const [isOpen, setModalOpen] = useState(false);
  const [APIData, setAPIData] = useState<APIData>();

  const { error: publicationsError, isLoading: loadingPublications } =
    useGetPublicationsQuery(APIFilters, {
      onSuccess: (data) => {
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
    onSuccess: () => {
      setModalOpen(true);
    },
    disabled: !currentPublicationId,
  });

  if (publicationsError || publicationError) {
    return <>Something went wrong loading the data. Try again</>;
  }

  const isLoading = loadingPublications || loadingPublication;

  return (
    <>
      <header className="flex bg-white">
        <img
          width="100px"
          height="90px"
          src={logo}
          alt="Logo"
          className="App-logo"
        />
        <span className="my-auto ml-3 font-medium text-gray-500">
          Publications Dashboard
        </span>
      </header>
      <div className="flex flex-col  p-5">
        <div className="rounded-xl p-5">
          <div className="text-gray-500 text-2xl ">
            {isLoading && "(loading data...)"}
          </div>

          <div className="rounded-lg bg-white p-5">
            <Input
              placeholder="Search by name..."
              onChange={debounce((e) => {
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
              }, 1000)}
            />

            <div className="flex">
              <Filters
                className="mt-5 w-full"
                onFilterAdd={({ value, field }) => {
                  setAPIFilters((prev) => ({
                    ...prev,
                    filter: [
                      ...(prev.filter || []),
                      {
                        field,
                        type: "like",
                        value: `%${value}%`,
                      },
                    ],
                  }));
                }}
                onFilterRemove={({ value, field }) => {
                  setAPIFilters((prev) => ({
                    ...prev,
                    filter: prev.filter?.filter(
                      (item) => item.value !== value || item.field !== field
                    ),
                  }));
                }}
                filtersApplied={APIFilters.filter}
              />
            </div>
            <div className="flex">
              <OrdersBy
                className="mt-5 w-full"
                onOrderByAdd={({ field, direction }) => {
                  setAPIFilters((prev) => ({
                    ...prev,
                    "order-by": [
                      ...(prev?.["order-by"] || []),
                      {
                        field,
                        type: "field",
                        direction,
                      },
                    ],
                  }));
                }}
                onOrderByRemove={({ direction, field }) => {
                  setAPIFilters((prev) => ({
                    ...prev,
                    "order-by": prev?.[`order-by`]?.filter(
                      (item) =>
                        item.field !== field || item.direction !== direction
                    ),
                  }));
                }}
                ordersByApplied={APIFilters?.["order-by"]}
              />
            </div>
          </div>
          <div className="rounded-lg mt-5 bg-white flex flex-col p-5">
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
            <div className="mt-5 flex justify-between">
              <div className="flex">
                <Select
                  options={entriesPerPageOptions}
                  label="Entries per page:"
                  defaultValue={APIData?.pageSize}
                  onChange={(e) => {
                    setAPIFilters((prev) => ({
                      ...prev,
                      limit: Number(e.target.value),
                    }));
                  }}
                />
                <span className="my-auto ml-3 font-medium text-gray-500">
                  of {APIData?.itemsCount} items
                </span>
              </div>
              <Pagination
                key={`${APIData?.currentPage}-${APIData?.pagesCount}`}
                pagesCount={APIData?.pagesCount}
                currentPage={APIData?.currentPage}
                onChange={(newPage) => {
                  setAPIFilters((prev) => ({
                    ...prev,
                    page: newPage,
                  }));
                }}
              />
            </div>
          </div>
          <Modal
            open={isOpen}
            onClose={() => {
              setModalOpen((prev) => !prev);
            }}
            center
          >
            <ReactJson src={publicationData} />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
