/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./axios-instance";
import * as qs from "qs";
import { APIFilters } from "../types";

interface Options<ResponseType = any, RequestType = any, ErrorType = any> {
  onSuccess?: (responseData: ResponseType, requestData?: RequestType) => void;
  onError?: (error: ErrorType, requestData?: RequestType) => void;
  disabled?: boolean;
}

const getUrlWithQueryParameters = ({
  baseUrl,
  queryParameters,
}: {
  baseUrl: string;
  queryParameters?: APIFilters;
}): string => {
  if (!baseUrl || typeof baseUrl !== "string") {
    throw new Error(
      `base url was missing or of wrong format "baseUrl": ${JSON.stringify(
        baseUrl
      )}`
    );
  }

  const stringified = qs.stringify(queryParameters as Record<string, any>);

  if (stringified !== "") {
    return baseUrl + "?" + stringified;
  }
  return baseUrl;
};

const useGetPublicationsQuery = (
  APIfilters?: APIFilters,
  options?: Options
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["publications", { APIfilters }],
    queryFn: async () => {
      const url = getUrlWithQueryParameters({
        baseUrl: "magazine/edition",
        queryParameters: APIfilters,
      });

      return axiosInstance
        .get(url)
        .then(({ data }) => {
          if (options?.onSuccess) {
            options?.onSuccess(data);
          }
          queryClient.setQueryData(["publications"], data);
          return data;
        })
        .catch((error) => {
          if (options?.onError) {
            options?.onError(error);
          }
          throw error;
        });
    },
  });

  return query;
};

const useGetPublicationQuery = (id: string, options?: Options) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["publication", id],
    enabled: !options?.disabled,
    queryFn: async () => {
      const url = `magazine/edition/${id}`;

      return axiosInstance
        .get(url)
        .then(({ data }) => {
          queryClient.setQueryData(["publication"], id);
          if (options?.onSuccess) {
            options?.onSuccess(data);
          }
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  return query;
};

export { useGetPublicationsQuery, useGetPublicationQuery };
