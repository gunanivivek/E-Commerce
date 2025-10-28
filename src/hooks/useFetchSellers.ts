import { useQuery } from "@tanstack/react-query";
import { getAllSellers } from "../api/adminApi";
import { useAdminStore } from "../store/adminStore";
import type { AxiosError } from "axios";
import type { Seller, ErrorResponse } from "../types/admin";

export const useFetchSellers = () => {
  const { setSellers, setError, setLoading } = useAdminStore();

  return useQuery<Seller[], AxiosError<ErrorResponse>>({
    queryKey: ["sellers"],
    queryFn: async () => {
      try {
        setLoading(true);
        const sellers = await getAllSellers();
        setSellers(sellers);
        setError(null);
        return sellers;
      } catch (error: unknown) {
        let errorMessage = "Failed to fetch sellers";

        if (error instanceof Error) {
          const axiosError = error as AxiosError<{ detail?: string }>;
          if (axiosError.response?.data?.detail) {
            errorMessage = axiosError.response.data.detail;
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });
};
