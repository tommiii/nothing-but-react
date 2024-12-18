import { FC } from "react";
import styles from "./table.module.css";

interface Data {
  id: string;
  name: string;
  created: string;
  modified: string;
  category?: string;
}

interface Props {
  data: Data[];
  hideColumns?: string[];
  columnsSearch?: string[] | "all";
}

const Table: FC<Props> = ({
  data,
  hideColumns = [],
  // columnsSearch = "all",
}) => {
  console.log(data);

  console.log(import.meta.env);

  const columnNames = Object.keys(data?.[0] || {});

  return (
    <>
      <table className={styles.tableClass}>
        <thead>
          <tr className={styles.trClass}>
            {columnNames.map(
              (columnName) =>
                !hideColumns.includes(columnName) && (
                  <th key={columnName} className={styles.thClass}>
                    <button>
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
                    />
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody>
          {data?.map(({ id, name, created, modified }) => (
            <tr key={id} className={styles.trClass}>
              <td className={styles.tdClass}>{name}</td>
              <td className={styles.tdClass}>{created}</td>
              <td className={styles.tdClass}>{modified}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <label
          htmlFor="entries"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Entries per page
        </label>
        <select
          id="entries"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring mt-2"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
        </select>
      </div>
    </>
  );
};

export default Table;
