import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductStatus } from "../../api/adminApi";
import { toast } from "react-toastify";
import { useAdminProductStore } from "../../store/Admin/adminProductStore";
import type { AxiosError } from "axios";

export const useProductStatusActions = () => {
  const queryClient = useQueryClient();
  const { updateProductStatusLocal } = useAdminProductStore();

  const mutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "approved" | "rejected";
    }) => updateProductStatus(id, status),

    onMutate: () => {
      // ✅ Show loading & store toast ID
      const toastId = toast.loading("Updating product status...");
      return { toastId }; // pass to next callbacks
    },

    onSuccess: (_data, variables, context) => {
      //  Close or update loading toast
      toast.update(context?.toastId, {
        render: `Product ${variables.status} successfully`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Update store instantly
      updateProductStatusLocal(variables.id, variables.status);

      //  Refetch product list
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: (error: AxiosError<{ detail?: string }>, _variables, context) => {
      const msg =
        error.response?.data?.detail ||
        error.message ||
        "Failed to update product status";

      if (context?.toastId) {
        toast.update(context.toastId, {
          render: msg,
          type: "error",
          isLoading: false,
          autoClose: 2500,
        });
      } else {
        toast.error(msg);
      }
    },
  });

  return {
    approveProduct: (id: number) => mutation.mutate({ id, status: "approved" }),
    rejectProduct: (id: number) => mutation.mutate({ id, status: "rejected" }),
    isPending: mutation.isPending,
  };
};
