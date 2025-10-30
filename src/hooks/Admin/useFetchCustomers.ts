import { useQuery } from "@tanstack/react-query";
import { getAllCustomers } from "../../api/adminApi";
import { useAdminStore } from "../../store/adminStore";
import type { AxiosError } from "axios";
import type { Customer } from "../../types/admin";

export const useFetchCustomers = () => {
  const { setCustomers, setError, setLoading } = useAdminStore();

  return useQuery<Customer[], AxiosError>({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        setLoading(true);
        const customers = await getAllCustomers();
        setCustomers(customers);
        setError(null);
        return customers;
      } catch (err: unknown) {
        let errorMessage = "Failed to fetch customers";

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

        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });
};
