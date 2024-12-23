import { FC, useState, useCallback, useMemo } from "react";
import Input from "../input/input";
import Select from "../select/select";
import { filtersOptions, filterTypeOptions } from "../../constants";
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

const renderFilterValue = (filter: Filter) => {
  return filter.type === "like" ? filter.value.slice(1, -1) : filter.value;
};

const Filters: FC<Props> = ({
  onFilterAdd,
  onFilterRemove,
  className,
  filtersApplied = [],
}) => {
  const [filterDraft, setFilterDraft] = useState<Filter>({
    field: filtersOptions[0].value,
    value: "",
    type: "like",
  });

  const currentFiltersAppliedField = useMemo(
    () => filtersApplied.map((filter) => filter.field),
    [filtersApplied]
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

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterDraft((prev) => ({
        ...prev,
        type: e.target.value as "like" | "eq",
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

  const disabled =
    !filterDraft.value ||
    filterDraft.field === "placeholder" ||
    currentFiltersAppliedField.includes(filterDraft.field);

  return (
    <div className={className}>
      <div className="flex flex-wrap">
        <Select
          id="select-filters-id"
          data-testid="select-filters-test-id"
          className="w-full sm:w-auto"
          options={filtersOptions.filter(
            (filterOption) =>
              !currentFiltersAppliedField.includes(filterOption.value)
          )}
          label="Select filter:"
          defaultValue={filterDraft.field}
          onChange={handleFieldChange}
        />
        <Select
          id="select-filter-type-id"
          data-testid="select-filter-type-test-id"
          className="w-full sm:w-auto sm:ml-3 sm:mt-0 mt-3"
          options={filterTypeOptions}
          label="type:"
          defaultValue={filterDraft.type}
          onChange={handleTypeChange}
        />
        <Input
          id="input-filters-id"
          data-testid="input-filters-test-id"
          className="w-full sm:w-auto sm:ml-3 sm:mt-0 mt-3"
          placeholder="Filter value..."
          value={filterDraft.value}
          onChange={handleValueChange}
        />
        <Button
          id="apply-filter-button"
          data-testid="apply-filter-button-test-id"
          className="w-full sm:w-auto ml-auto sm:mt-0 mt-3"
          disabled={disabled}
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
              {`${filterApplied.field}[${
                filterApplied.type
              }]='${renderFilterValue(filterApplied)}'`}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filters;
