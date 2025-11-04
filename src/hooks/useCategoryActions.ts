import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, deleteCategory, updateCategory } from "../api/categoryApi";
import type { AxiosError } from "axios";
import type { Category } from "../types/category";
import { toast } from "react-toastify";
import type { Id } from "react-toastify"; 

interface ToastContext {
  toastId: Id;
}


const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;

  const axiosError = error as AxiosError<{ message?: string; detail?: string }>;
  const responseData = axiosError?.response?.data;

  if (responseData?.message) return responseData.message;
  if (responseData?.detail) return responseData.detail;

  return "Something went wrong. Please try again.";
};

// ✅ Create Category Hook
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, unknown, FormData, ToastContext>({
    mutationFn: (formData) => createCategory(formData),

    onMutate: () => {
      const toastId = toast.loading("Creating category...");
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      if (!context) return;
      toast.update(context.toastId, {
        render: "Category created successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (error, _, context) => {
      if (!context) return;
      toast.update(context.toastId, {
        render: getErrorMessage(error),
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    },
  });
};

// ✅ Delete Category Hook
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, unknown, number, ToastContext>({
    mutationFn: (id) => deleteCategory(id),

    onMutate: () => {
      const toastId = toast.loading("Deleting category...");
      return { toastId };
    },

    onSuccess: (data, _, context) => {
      if (!context) return;
      toast.update(context.toastId, {
        render: data?.message || "Category deleted successfully 🗑️",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (error, _, context) => {
      if (!context) return;
      toast.update(context.toastId, {
        render: getErrorMessage(error),
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, unknown, { id: number; formData: FormData }, ToastContext>({
    mutationFn: ({ id, formData }) => updateCategory(id, formData),

    onMutate: () => {
      const toastId = toast.loading("Updating category...");
      return { toastId };
    },

    onSuccess: (_, __, context) => {
      if (!context) return;
      toast.update(context.toastId, {
        render: "Category updated successfully ✅",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: (error, _, context) => {
      if (!context) return;
      toast.update(context.toastId, {
        render: getErrorMessage(error),
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    },
  });
};
