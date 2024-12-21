import { FC, useState, useCallback } from "react";
import Input from "../input/input";
import Select from "../select/select";
import { filtersOptions } from "../../constants";
import Button from "../button/button";
import Badge from "../badge/badge";
import { Filter } from "../../types";

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

  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterDraft((prev) => ({
        ...prev,
        field: e.target.value,
      }));
    },
    []
  );

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterDraft((prev) => ({
        ...prev,
        value: e.target.value,
      }));
    },
    []
  );

  const handleApplyFilter = useCallback(() => {
    if (filterDraft.field && filterDraft.value) {
      onFilterAdd(filterDraft);
      setFilterDraft((prev) => ({ ...prev, value: "" }));
    }
  }, [filterDraft, onFilterAdd]);

  const handleRemoveFilter = useCallback(
    (filter: Filter) => {
      onFilterRemove(filter);
    },
    [onFilterRemove]
  );

  return (
    <div className={className}>
      <div className="flex flex-wrap">
        <Select
          className="w-full sm:w-auto"
          options={filtersOptions.filter(
            (filterOption) =>
              !currentFiltersAppliedField.includes(filterOption.value)
          )}
          label="Select filter:"
          defaultValue={filterDraft.field}
          onChange={handleFieldChange}
        />
        <Input
          className="w-full sm:w-auto sm:ml-3 sm:mt-0 mt-3"
          placeholder="Filter value..."
          value={filterDraft.value}
          onChange={handleValueChange}
        />
        <Button
          className="w-full sm:w-auto ml-auto sm:mt-0 mt-3"
          disabled={
            !filterDraft.value ||
            currentFiltersAppliedField.includes(filterDraft.field)
          }
          onClick={handleApplyFilter}
        >
          Apply
        </Button>
      </div>

      {filtersApplied.length > 0 && (
        <div className="mt-3 flex flex-wrap">
          {filtersApplied.map((filterApplied) => (
            <Badge
              key={filterApplied.field}
              className="mx-1"
              onClick={() => handleRemoveFilter(filterApplied)}
            >
              {`${filterApplied.field}='${filterApplied.value.slice(1, -1)}'`}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filters;
