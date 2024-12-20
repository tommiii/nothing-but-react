/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./axios-instance";
import qs from "qs";

interface Options<ResponseType = any, RequestType = any, ErrorType = any> {
  onSuccess?: (responseData: ResponseType, requestData?: RequestType) => void;
  onError?: (error: ErrorType) => void;
  disabled?: boolean;
}

const getUrlWithQueryParameters = ({
  baseUrl,
  queryParameters,
}: {
  baseUrl: string;
  queryParameters?: Record<string, string | number | undefined>;
}): string => {
  if (!baseUrl || typeof baseUrl !== "string") {
    throw new Error(
      `base url was missing or of wrong format "baseUrl": ${JSON.stringify(
        baseUrl
      )}`
    );
  }

  const parsed = qs.stringify(queryParameters as Record<string, any>);

  if (parsed !== "") {
    return baseUrl + "?" + parsed;
  }
  return baseUrl;
};

const useGetPublicationsQuery = (
  filters?: Record<string, string | number | undefined>,
  options?: Options
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["publications", { filters }],
    queryFn: async () => {
      const url = getUrlWithQueryParameters({
        baseUrl: "magazine/edition",
        queryParameters: filters,
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
