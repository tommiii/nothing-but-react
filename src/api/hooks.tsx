import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useCustomQuery = () => {
  const queryClient = useQueryClient();

  const cityQuery = useQuery({
    queryKey: ["custom"],
    queryFn: async () => {
      const url = "";

      return axios
        .get(url)
        .then(({ data }) => {
          queryClient.setQueryData(["custom"], data);
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
      return axios
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

export { useCustomQuery, useCustomMutation };
