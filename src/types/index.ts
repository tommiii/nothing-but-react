export interface Publication {
  id: string;
  name: string;
  created_on: string;
  modified_on: string;
  category?: string;
  status?: string;
}

export type Filter = { field: string; value: string; type: "like" | "eq" };

export type Direction = "ASC" | "DESC";

export type OrderBy = {
  field: string;
  type: "field";
  direction: "ASC" | "DESC";
};

export interface APIData {
  itemsCount: number;
  pagesCount: number;
  currentPage: number;
  pageSize: number;
  publications: Publication[];
}

export type APIFilters = {
  page: number;
  limit: number;
  filter?: Filter[];
  "order-by"?: OrderBy[];
};
