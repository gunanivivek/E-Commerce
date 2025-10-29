import { useQuery } from "@tanstack/react-query";
import { getAllSellers } from "../api/adminApi";
import { useAdminStore } from "../store/adminStore";
import type { AxiosError } from "axios";
import type { Seller } from "../types/admin";

export const useFetchSellers = () => {
  const { setSellers, setError, setLoading } = useAdminStore();

  return useQuery<Seller[], AxiosError>({
    queryKey: ["sellers"],
    queryFn: async () => {
      try {
        setLoading(true);
        const sellers = await getAllSellers();
        setSellers(sellers);
        setError(null);
        return sellers;
      } catch (err: unknown) {
        let errorMessage = "Failed to fetch sellers";

        const axiosError = err as AxiosError<{
          detail?: string | { msg?: string }[];
        }>;

        if (axiosError.response?.data?.detail) {
          const { detail } = axiosError.response.data;
          if (Array.isArray(detail)) {
            // Extract message from validation array
            errorMessage = detail[0]?.msg || errorMessage;
          } else if (typeof detail === "string") {
            errorMessage = detail;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });
};
