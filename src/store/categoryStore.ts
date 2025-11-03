import { toast } from "react-toastify";
import { getAllCategories } from "../api/categoryApi";
import type { Category } from "../types/category";
import type { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

interface ApiError {
  message?: string;
  detail?:string;
}

export const useCategories = () => {
  const query = useQuery<Category[], AxiosError<ApiError>>({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 5,
  });

  if (query.error) {
    const msg =
      query.error.response?.data?.message ||
      query.error.message ||
      "Failed to fetch categories!";
    toast.error(msg);
  }

  return query;
};
