import { FC, useState, useMemo, useCallback } from "react";
import Select from "../select/select";
import { orderByDirectionOptions, orderByOptions } from "../../constants";
import Button from "../button/button";
import Badge from "../badge/badge";
import { Direction, OrderBy } from "../../types";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface Props {
  onOrderByAdd: (orderBy: OrderBy) => void;
  onOrderByRemove: (orderBy: OrderBy) => void;
  className?: string;
  disabled?: boolean;
  ordersByApplied?: OrderBy[];
}

const OrdersBy: FC<Props> = ({
  onOrderByAdd,
  onOrderByRemove,
  className,
  ordersByApplied = [],
}) => {
  const [orderByDraft, setOrderByDraft] = useState<OrderBy>({
    field: orderByOptions[0].value,
    type: "field",
    direction: "ASC",
  });

  const currentOrderByAppliedField = useMemo(
    () => ordersByApplied.map((orderBy) => orderBy.field),
    [ordersByApplied]
  );

  const filteredOrderByOptions = useMemo(
    () =>
      orderByOptions.filter(
        (orderByOption) =>
          !currentOrderByAppliedField.includes(orderByOption.value)
      ),
    [currentOrderByAppliedField]
  );

  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setOrderByDraft((prev) => ({
        ...prev,
        field: e.target.value,
        type: "field",
      }));
    },
    []
  );

  const handleDirectionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setOrderByDraft((prev) => ({
        ...prev,
        direction: e.target.value as Direction,
      }));
    },
    []
  );

  const handleApply = useCallback(() => {
    if (orderByDraft.field && orderByDraft.direction) {
      onOrderByAdd(orderByDraft);
      setOrderByDraft((prev) => ({ ...prev, field: orderByOptions[0].value }));
    }
  }, [orderByDraft, onOrderByAdd]);

  const handleRemove = (orderBy: OrderBy) => {
    onOrderByRemove(orderBy);
  };

  const disabled = !orderByDraft.field || orderByDraft.field === "placeholder";

  return (
    <div className={className}>
      <label className="font-medium text-gray-500">Order by:</label>
      <div className="flex flex-wrap">
        <Select
          id="select-order-by-id"
          data-testid="select-order-by-test-id"
          className="w-full md:w-auto"
          options={filteredOrderByOptions}
          defaultValue={orderByDraft.field}
          onChange={handleFieldChange}
          aria-label="Select field to order by"
          fullWidth
        />
        <Select
          id="select-direction-id"
          data-testid="select-direction-test-id"
          className="w-full md:w-auto md:ml-3 md:mt-0 mt-3"
          options={orderByDirectionOptions}
          defaultValue={orderByDraft.direction}
          onChange={handleDirectionChange}
          aria-label="Select direction for ordering"
          fullWidth
        />
        <Button
          disabled={disabled}
          data-testid="apply-order-by-button-test-id"
          className="w-full md:w-auto ml-auto md:mt-0 mt-3"
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap">
        {ordersByApplied.map((orderByApplied) => {
          const tooltipId = `${orderByApplied.field}-${orderByApplied.direction}`;
          return (
            <div key={`${tooltipId}-key`}>
              <span data-tooltip-id={tooltipId}>
                <Badge
                  key={orderByApplied.field}
                  className="mx-1 cursor-pointer"
                  onClick={() => handleRemove(orderByApplied)}
                >
                  {`${orderByApplied.field}='${orderByApplied.direction}'`}
                </Badge>
              </span>
              <ReactTooltip id={tooltipId} place="bottom" content="Remove" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersBy;
