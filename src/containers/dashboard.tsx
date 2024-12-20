import { FC, useState } from "react";
import { useGetPublicationsQuery, useGetPublicationQuery } from "../api/hooks";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import ReactJson from "react-json-view";
import Grid from "../components/grid";
import debounce from "lodash.debounce";
import Select from "../components/select";
import {
  entriesPerPageOptions,
  filtersOptions,
  orderByOptions,
} from "../constants";
import Input from "../components/input";
import logo from "../assets/logo.png";
import Pagination from "../components/pagination";
import { Publication } from "../types";

const Dashboard: FC = () => {
  const [APIFilters, setAPIFilters] = useState({ page: 1, limit: 5 });
  const [filterDraft, setFilterDraft] = useState<{
    name: string;
    value: string;
  }>({ name: filtersOptions[0].value, value: "" });
  const [currentPublicationId, setCurrentPublicationId] = useState<string>();
  const [isOpen, setModalOpen] = useState(false);
  const [publicationList, setPublicationList] = useState<Publication[]>();

  const {
    data: publicationsData,
    error: publicationsError,
    isLoading: loadingPublications,
  } = useGetPublicationsQuery(APIFilters, {
    onSuccess: (data) => {
      setPublicationList(data?._embedded?.edition);
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

  // const itemsCount = publicationsData?.total_items;
  const pagesCount = publicationsData?.page_count;
  const currentPage = publicationsData?.page;
  const pageSize = publicationsData?.page_size;

  if (publicationsError || publicationError) {
    return <>Something went wrong loading the data. Try again</>;
  }

  const isLoading = loadingPublications || loadingPublication;

  return (
    <>
      <header className="App-header">
        <img
          width="100px"
          height="90px"
          src={logo}
          alt="Logo"
          className="App-logo"
        />
      </header>
      <div className="flex flex-col bg-gray-100 p-5">
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
            <div className="mt-5 flex flex-col">
              <Select
                options={entriesPerPageOptions}
                label="Entries per page:"
                defaultValue={pageSize}
                onChange={(e) => {
                  setAPIFilters((prev) => ({
                    ...prev,
                    limit: Number(e.target.value),
                  }));
                }}
              />
              <div className="flex">
                <Select
                  className="mt-5"
                  options={filtersOptions}
                  label="Select filter:"
                  defaultValue={filterDraft.name}
                  onChange={(e) => {
                    setFilterDraft((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                />
                <Input
                  className="mt-auto ml-3"
                  placeholder="filter value..."
                  onChange={debounce((e) => {
                    setAPIFilters((prev) => ({
                      ...prev,
                      filter: [
                        {
                          field: filterDraft.name,
                          type: "like",
                          value: `%${e.target.value}%`,
                        },
                      ],
                    }));
                  }, 1000)}
                />
              </div>
              <div className="flex">
                <Select
                  className="mt-5"
                  options={filtersOptions}
                  label="Order by:"
                  defaultValue={filterDraft.name}
                  onChange={(e) => {
                    setFilterDraft((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                />
                <Select
                  className="mt-5 ml-3"
                  options={orderByOptions}
                  label="direction:"
                  defaultValue={filterDraft.value}
                  onChange={(e) => {
                    setAPIFilters((prev) => ({
                      ...prev,
                      "order-by": [
                        {
                          field: filterDraft.name,
                          type: "field",
                          direction: e.target.value,
                        },
                      ],
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="rounded-lg mt-5 bg-white flex flex-col p-5">
            <Grid
              list={publicationList}
              onClick={(id) => {
                setCurrentPublicationId(id);
              }}
            />
            <Pagination
              className="ml-auto mt-5"
              key={`${currentPage}-${pagesCount}`}
              pagesCount={pagesCount}
              currentPage={currentPage}
              onChange={(newPage) => {
                setAPIFilters((prev) => ({
                  ...prev,
                  page: newPage,
                }));
              }}
            />
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
