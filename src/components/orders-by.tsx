import { FC, useState } from "react";
import Select from "./select";
import { orderByDirectionOptions, orderByOptions } from "../constants";
import Button from "./button";
import Badge from "./badge";
import { Direction, OrderBy } from "../types";

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

  const currentOrderByAppliedField = ordersByApplied.map(
    (orderByApplied) => orderByApplied.field
  );

  return (
    <div className={className}>
      <div className="flex flex-wrap">
        <Select
          className="w-full sm:w-auto"
          options={orderByOptions.filter(
            (orderByOption) =>
              !currentOrderByAppliedField.includes(orderByOption.value)
          )}
          label="Select order by:"
          defaultValue={orderByDraft.field}
          onChange={(e) => {
            setOrderByDraft((prev) => ({
              ...prev,
              type: "field",
              field: e.target.value,
            }));
          }}
        />
        <Select
          className="w-full sm:w-auto sm:ml-3 sm:mt-0 mt-3"
          options={orderByDirectionOptions}
          label="direction:"
          defaultValue={orderByDraft.direction}
          onChange={(e) => {
            setOrderByDraft((prev) => ({
              ...prev,
              direction: e.target.value as Direction,
            }));
          }}
        />
        <Button
          disabled={orderByOptions[0].value === orderByDraft.field}
          className="w-full sm:w-auto ml-auto sm:mt-0 mt-3"
          onClick={() => {
            if (orderByDraft.field && orderByDraft.direction) {
              onOrderByAdd(orderByDraft);
            }
          }}
        >
          Apply
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap">
        {ordersByApplied.map((orderByApplied) => (
          <Badge
            key={orderByApplied.field}
            className="mx-1"
            onClick={() => {
              onOrderByRemove(orderByApplied);
            }}
          >
            {`${orderByApplied.field}='${orderByApplied.direction}'`}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default OrdersBy;
