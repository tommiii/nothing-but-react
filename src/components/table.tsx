import { FC } from "react";
import styles from "./table.module.css";
import Pagination from "./pagination";
import PageSizeSelect from "./page-size-select";
import debounce from "lodash.debounce";

export interface Data {
  id: string;
  name: string;
  created: string;
  modified: string;
  category?: string;
}

interface Props {
  data: Data[] | undefined;
  hideColumns?: string[];
  extraCols?: { name: string; render?: JSX.Element }[];
  dataCols: ({ displayName: string; propertyName: string } | string)[];
  columnsSearch?: string[] | "all";
  filters: Record<string, string | number | undefined> | object;
  onFilterChange: (
    filters: Record<string, string | number | undefined> | object
  ) => void;
  itemsCount: number;
  pagesCount: number;
  currentPage: number;
  pageSize: number;
}

const Table: FC<Props> = ({
  data = [],
  hideColumns = [],
  extraCols = [],
  dataCols,
  onFilterChange = () => null,
  pagesCount,
  currentPage,
  pageSize,
  filters,
}) => {
  // const columnNames = Object.keys(data?.[0] || {});

  return (
    <div className="flex flex-col">
      <table className={styles.tableClass}>
        <thead>
          <tr className={styles.trClass}>
            {dataCols.map((column) => {
              const columnName =
                typeof column === "string" ? column : column?.displayName;
              const propertyName =
                typeof column === "string" ? column : column?.propertyName;
              const currentFilter = filters?.filter?.find(
                (item) => item.field === propertyName
              );
              const currentOrder = filters?.["order-by"]?.find(
                (item) => item.field === propertyName
              )?.direction;
              const sanitizedFilterValue = (currentFilter?.value || "")?.slice(
                1,
                -1
              ); // remove %%

              console.log({ currentOrder, propertyName });
              return (
                !hideColumns.includes(columnName) && (
                  <th key={columnName} className={styles.thClass}>
                    <button
                      onClick={() => {
                        onFilterChange({
                          "order-by": [
                            {
                              field: propertyName,
                              type: "field",
                              direction:
                                currentOrder === "ASC" ? "DESC" : "ASC",
                            },
                          ],
                        });
                      }}
                    >
                      <span className="flex items-center capitalize">
                        {columnName}
                        <svg
                          className="w-4 h-4 ms-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m8 15 4 4 4-4m0-6-4-4-4 4"
                          ></path>
                        </svg>
                      </span>
                    </button>
                    <input
                      className={styles.inputClass}
                      id={columnName}
                      type="text"
                      defaultValue={sanitizedFilterValue}
                      onChange={debounce((e) => {
                        onFilterChange({
                          filter: [
                            {
                              field: columnName,
                              type: "like",
                              value: `%${e.target.value}%`,
                            },
                          ],
                        });
                      }, 1000)}
                    />
                  </th>
                )
              );
            })}
            {extraCols.map((extraCol) => (
              <th key={extraCol.name} className={styles.thClass}>
                <span className="flex items-center capitalize">
                  {extraCol.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index} className={styles.trClass}>
              {dataCols.map((column, index) => {
                const columnName =
                  typeof column === "string" ? column : column?.displayName;
                const propertyValue =
                  typeof column === "string" ? column : column?.propertyName;
                return (
                  !hideColumns.includes(columnName) && (
                    <td key={index} className={styles.tdClass}>
                      {item[`${propertyValue}`]}
                    </td>
                  )
                );
              })}
              {extraCols.map((extraCol) => (
                <th key={extraCol.name} className={styles.thClass}>
                  <span className="flex items-center capitalize">
                    {extraCol?.render(item.id)}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between">
        <PageSizeSelect
          key={pageSize}
          pageSize={pageSize}
          onChange={(newLimit) => {
            onFilterChange({ limit: newLimit });
          }}
        />
        <Pagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          onChange={(newPage) => {
            onFilterChange({ page: newPage });
          }}
        />
      </div>
    </div>
  );
};

export default Table;
