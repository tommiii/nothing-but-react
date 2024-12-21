import { FC, useState } from "react";
import Input from "./input";
import Select from "./select";
import { filtersOptions } from "../constants";
import Button from "./button";
import Badge from "./badge";
import { Filter } from "../types";

interface Props {
  onFilterAdd: (filter: Filter) => void;
  onFilterRemove: (filter: Filter) => void;
  className?: string;
  disabled?: boolean;
  filtersApplied?: Filter[];
}

const Filters: FC<Props> = ({
  onFilterAdd,
  onFilterRemove,
  className,
  filtersApplied = [],
}) => {
  const [filterDraft, setFilterDraft] = useState<Filter>({
    field: filtersOptions[0].value,
    value: "",
  });

  const currentFiltersAppliedField = filtersApplied.map(
    (filterApplied) => filterApplied.field
  );

  return (
    <div className={className}>
      <div className={"flex flex-wrap"}>
        <Select
          className="w-full sm:w-auto"
          options={filtersOptions.filter(
            (filterOption) =>
              !currentFiltersAppliedField.includes(filterOption.value)
          )}
          label="Select filter:"
          defaultValue={filterDraft.field}
          onChange={(e) => {
            setFilterDraft((prev) => ({
              ...prev,
              field: e.target.value,
            }));
          }}
        />
        <Input
          className="w-full sm:w-auto sm:ml-3 sm:mt-0 mt-3"
          placeholder="filter value..."
          onChange={(e) => {
            setFilterDraft((prev) => ({
              ...prev,
              value: e.target.value,
            }));
          }}
        />
        <Button
          className="w-full sm:w-auto ml-auto sm:mt-0 mt-3"
          disabled={filtersOptions[0].value === filterDraft.field}
          onClick={() => {
            if (filterDraft.field && filterDraft.value) {
              onFilterAdd(filterDraft);
            }
          }}
        >
          Apply
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap">
        {filtersApplied.map((filterApplied) => (
          <Badge
            key={filterApplied.field}
            className="mx-1"
            onClick={() => {
              onFilterRemove(filterApplied);
            }}
          >
            {`${filterApplied.field}='${filterApplied.value.slice(1, -1)}'`}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default Filters;
