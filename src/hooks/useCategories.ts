import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import type { Category } from "../types/category";
import { getAllCategories } from "../api/categoryApi";

interface ApiError {
  message?: string;
  detail?:string;
}

export const useCategories = () => {
  const query = useQuery<Category[], AxiosError<ApiError>>({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });


  if (query.error) {
    const msg =
      query.error.response?.data?.message ||
       query.error.response?.data?.detail ||
      query.error.message ||
      "Failed to fetch categories!";
    toast.error(msg);
    console.error("❌ Category fetch error:", msg);
  }

  return query;
};
