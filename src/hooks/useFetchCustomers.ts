import { useQuery } from "@tanstack/react-query";
import { getAllCustomers } from "../api/adminApi";
import { useAdminStore } from "../store/adminStore";
import type { AxiosError } from "axios";
import type { Customer, ErrorResponse } from "../types/admin";

export const useFetchCustomers = () => {
  const { setCustomers, setError, setLoading } = useAdminStore();

  return useQuery<Customer[], AxiosError<ErrorResponse>>({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        setLoading(true);
        const customers = await getAllCustomers();
        setCustomers(customers);
        setError(null);
        return customers;
      } catch (error: unknown) {
        let errorMessage = "Failed to fetch customers";

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
