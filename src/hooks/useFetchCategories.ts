import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "../api/categoryApi";
import type { Category } from "../types/category";
import type { AxiosError } from "axios";
import { useCategoryStore } from "../store/categoryStore";
import { toast } from "react-toastify";

interface ApiError {
  message?: string;
  detail?: string;
}

export const useFetchCategories = () => {
  const { setCategories } = useCategoryStore();

  const query = useQuery<Category[], AxiosError<ApiError>>({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: 1,
  });

  // ✅ Sync fetched data into Zustand
  useEffect(() => {
    if (query.data) {
      setCategories(query.data);
    }
  }, [query.data, setCategories]);

  // ✅ Optional error toast
  useEffect(() => {
    if (query.isError && query.error) {
      const msg =
        query.error.response?.data?.message ||
        query.error.response?.data?.detail ||
        query.error.message ||
        "Failed to fetch categories!";
      toast.error(msg);
    }
  }, [query.isError, query.error]);

  return query; // still return full query object
};
