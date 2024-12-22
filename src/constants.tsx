export const entriesPerPageOptions = [
  { value: 5, displayValue: "5" },
  { value: 10, displayValue: "10" },
  { value: 15, displayValue: "15" },
  { value: 20, displayValue: "20" },
  { value: 25, displayValue: "25" },
];

export const filtersOptions = [
  { value: "placeholder", displayValue: "Select a category" },
  { value: "status", displayValue: "Status" },
  { value: "category", displayValue: "Category" },
  { value: "created_on", displayValue: "Created" },
  { value: "modified_on", displayValue: "Modified" },
];

export const filterTypeOptions = [
  { value: "placeholder", displayValue: "Select a type" },
  { value: "like", displayValue: "Like/Contain" },
  { value: "eq", displayValue: "Equal" },
];

export const orderByOptions = [
  ...filtersOptions,
  { value: "name", displayValue: "Name" },
];

export const orderByDirectionOptions = [
  { value: "ASC", displayValue: "ASC" },
  { value: "DESC", displayValue: "DESC" },
];
