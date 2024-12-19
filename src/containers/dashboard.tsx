import { FC, useState } from "react";
import { useGetPublicationsQuery, useGetPublicationQuery } from "../api/hooks";
import Table, { Data } from "../components/table";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import ReactJson from "react-json-view";

const Dashboard: FC = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const [currentPublication, setCurrentPublication] = useState<string>();
  const [isOpen, setModalOpen] = useState(false);
  const [tableData, setDataTable] = useState<Data[]>();

  const {
    data,
    error: publicationsError,
    isLoading: loadingPublications,
  } = useGetPublicationsQuery(filters, {
    onSuccess: (data) => {
      setDataTable(data?._embedded?.edition);
    },
  });
  const {
    data: publicationData,
    error: publicationError,
    isLoading: loadingPublication,
  } = useGetPublicationQuery(currentPublication as string, {
    onSuccess: () => {
      setModalOpen(true);
    },
    disabled: !currentPublication,
  });

  const itemsCount = data?.total_items;
  const pagesCount = data?.page_count;
  const currentPage = data?.page;
  const pageSize = data?.page_size;

  if (publicationsError || publicationError) {
    return <>Something went wrong loading the data. Try again</>;
  }

  const isLoading = loadingPublications || loadingPublication;

  return (
    <>
      <div className="flex flex-col p-5">
        <div className="flex">
          <div className="text-gray-500 text-2xl">
            Foleon Dashboard {isLoading && "(loading data...)"}
          </div>
        </div>
        <Table
          onFilterChange={(newFilter) => {
            setFilters((prev) => ({ ...prev, ...newFilter }));
          }}
          hideColumns={["id"]}
          data={tableData}
          filters={filters}
          itemsCount={itemsCount}
          pagesCount={pagesCount}
          currentPage={currentPage}
          pageSize={pageSize}
          dataCols={[
            "name",
            { displayName: "created", propertyName: "created_on" },
            { displayName: "modified", propertyName: "modified_on" },
            "category",
            "status",
          ]}
          extraCols={[
            {
              name: "Actions",
              render: (id: string) =>
                (
                  <button
                    onClick={() => {
                      setCurrentPublication(id);
                    }}
                  >
                    View
                  </button>
                ) as JSX.Element,
            },
          ]}
          onRowSelect={(id: string) => {
            setCurrentPublication(id);
          }}
        />
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
    </>
  );
};

export default Dashboard;
