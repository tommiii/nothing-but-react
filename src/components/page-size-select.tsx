import { FC } from "react";

interface Props {
  pageSize: number;
  onChange: (newSize: string) => void;
}

const PageSizeSelect: FC<Props> = ({ pageSize, onChange }) => {
  return (
    <>
      <div className="mt-auto">
        <label
          htmlFor="entries"
          className="text-sm font-medium text-gray-900 mr-2"
        >
          Entries per page:
        </label>
        <select
          id="entries"
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
          onChange={(e) => {
            onChange(e.target.value);
          }}
          defaultValue={pageSize}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
        </select>
      </div>
    </>
  );
};

export default PageSizeSelect;
