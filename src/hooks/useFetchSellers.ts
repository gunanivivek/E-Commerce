import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSellers } from "../api/adminApi";
import { useAdminStore } from "../store/adminStore";
import type { AxiosError } from "axios";
import type { Seller } from "../types/admin";

export const useFetchSellers = () => {
  const { setSellers, setError, setLoading } = useAdminStore();

  const query = useQuery<Seller[], AxiosError>({
    queryKey: ["sellers"],
    queryFn: async () => {
      try {
        const sellers = await getAllSellers();
        return sellers;
      } catch (err: unknown) {
        let errorMessage = "Failed to fetch sellers";

        const axiosError = err as AxiosError<{
          detail?: string | { msg?: string }[];
        }>;

        if (axiosError.response?.data?.detail) {
          const { detail } = axiosError.response.data;

          if (Array.isArray(detail)) {
            // FastAPI validation error → extract readable message
            errorMessage = detail[0]?.msg || errorMessage;
          } else if (typeof detail === "string") {
            // Simple string message
            errorMessage = detail;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        throw new Error(errorMessage);
      }
    },
    retry: false,
  });


  useEffect(() => {
    setLoading(query.isFetching);

    if (query.isSuccess && query.data) {
      setSellers(query.data);
      setError(null);
    } else if (query.isError && query.error) {
      const axiosError = query.error as AxiosError<{
        detail?: string | { msg?: string }[];
      }>;

      let errorMessage = "Failed to fetch sellers";
      if (axiosError.response?.data?.detail) {
        const { detail } = axiosError.response.data;
        if (Array.isArray(detail)) {
          errorMessage = detail[0]?.msg || errorMessage;
        } else if (typeof detail === "string") {
          errorMessage = detail;
        }
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      setError(errorMessage);
    }
  }, [
    query.isFetching,
    query.isSuccess,
    query.isError,
    query.data,
    query.error,
    setSellers,
    setError,
    setLoading,
  ]);

  return query;
};
