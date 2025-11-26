import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductStatus } from "../../api/adminApi";
import { toast } from "react-toastify";
import { useAdminProductStore } from "../../store/Admin/adminProductStore";
import type { AxiosError } from "axios";
import { useState } from "react";

export const useProductStatusActions = () => {
  const queryClient = useQueryClient();
  const { updateProductStatusLocal } = useAdminProductStore();

  const [loadingId, setLoadingId] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: "approved" | "rejected";
    }) => {
      setLoadingId(id);
      return updateProductStatus(id, status);
    },

    onMutate: () => {
      const toastId = toast.loading("Updating product status...");
      return { toastId };
    },

    onSuccess: async (_data, variables, context) => {
      if (context?.toastId) {
        toast.update(context.toastId, {
          render: `Product ${variables.status} successfully`,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }


      updateProductStatusLocal(variables.id, variables.status);

    
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({queryKey: ["products"]});
    },

    onError: (error: AxiosError<{ detail?: string }>, _variables, context) => {
      if (context?.toastId) {
        toast.update(context.toastId, {
          render:
            error.response?.data?.detail ||
            error.message ||
            "Failed to update product status",
          type: "error",
          isLoading: false,
          autoClose: 2500,
        });
      }
    },

    onSettled: () => {
      setLoadingId(null);
    },
  });

  return {
    approveProduct: (id: number) => mutation.mutate({ id, status: "approved" }),
    rejectProduct: (id: number) => mutation.mutate({ id, status: "rejected" }),
    loadingId,
  };
};
