import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateSellerStatus } from "../../api/adminApi";
import type { Seller } from "../../types/admin";
import type { AxiosError } from "axios";

interface ApiError {
  message?: string;
  detail?: string;
}

// ✅ ReactText replaced with string | number
interface ToastContext {
  toastId: string | number;
}

export const useSellerActions = () => {
  const queryClient = useQueryClient();

  // 🔹 Approve Seller
  const approveSeller = useMutation<
    Seller,
    AxiosError<ApiError>,
    number,
    ToastContext
  >({
    mutationFn: (id) => updateSellerStatus(id, "approved"),
    onMutate: () => {
      const toastId = toast.loading("Approving seller...");
      return { toastId };
    },
    onSuccess: (data, _id, context) => {
      if (!context) return;
      toast.update(context.toastId, {
        render: `Seller "${data.full_name}" approved successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
    },
    onError: (error, _id, context) => {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to approve seller.";
      if (context) {
        toast.update(context.toastId, {
          render: errorMsg,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.error(errorMsg);
      }
    },
  });

  // 🔹 Reject Seller
  const rejectSeller = useMutation<
    Seller,
    AxiosError<ApiError>,
    number,
    ToastContext
  >({
    mutationFn: (id) => updateSellerStatus(id, "rejected"),
    onMutate: () => {
      const toastId = toast.loading("Rejecting seller...");
      return { toastId };
    },
    onSuccess: (data, _id, context) => {
      if (!context) return;
      toast.update(context.toastId, {
        render: `Seller "${data.full_name}" rejected.`,
        type: "info",
        isLoading: false,
        autoClose: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
    },
    onError: (error, _id, context) => {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to reject seller.";
      if (context) {
        toast.update(context.toastId, {
          render: errorMsg,
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.error(errorMsg);
      }
    },
  });

  return { approveSeller, rejectSeller };
};
