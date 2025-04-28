import { useQuery } from "@tanstack/vue-query";
import { apiGet } from "./axios-client";

const DEFAULT_QUERY_OPTIONS = {
  retry: 1,
  refetchOnWindowFocus: false,
};

const basePath = "/api/sales-reps";

export const useGetSalesReps = (query = {}) => {
  return useQuery({
    ...DEFAULT_QUERY_OPTIONS,
    queryKey: ["salesReps", query],
    queryFn: async ({ queryKey }) => {
      const [_key, queryParams] = queryKey;
      const response = await apiGet(basePath, queryParams);
      return response;
    },
  });
};
