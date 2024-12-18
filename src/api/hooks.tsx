import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./axios-instance";

const useGetProjectsQuery = () => {
  const queryClient = useQueryClient();

  const cityQuery = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const url = "magazine/title?page=1&limit=20";

      return axiosInstance
        .get(url)
        .then(({ data }) => {
          queryClient.setQueryData(["projects"], data);
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  return cityQuery;
};

const useCustomMutation = () => {
  const deleteCityMutation = useMutation({
    mutationFn: async () => {
      const url = "";
      return axiosInstance
        .delete(url)
        .then(({ data }) => {
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
  });

  return deleteCityMutation;
};

export { useGetProjectsQuery, useCustomMutation };
