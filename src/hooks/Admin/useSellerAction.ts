import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { toggleSellerBlockStatus, updateSellerStatus } from "../../api/adminApi";
import type { Seller } from "../../types/admin";
import type { AxiosError } from "axios";
import { useState } from "react";

interface ApiError {
  message?: string;
  detail?: string;
}

interface ToastContext {
  toastId: string | number;
}

export const useSellerActions = () => {
  const queryClient = useQueryClient();
  const [mutatingId, setMutatingId] = useState<number | null>(null);

  // -------------------- APPROVE SELLER --------------------
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
      const msg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to approve seller.";
      toast.update(context?.toastId ?? "", {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

  // -------------------- REJECT SELLER --------------------
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
      const msg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to reject seller.";
      toast.update(context?.toastId ?? "", {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });

  // -------------------- BLOCK / UNBLOCK SELLER --------------------
  const toggleBlockSeller = useMutation<
    Seller,
    AxiosError<ApiError>,
    number,
    ToastContext
  >({
    mutationFn: async (id) => {
      setMutatingId(id); // <-- REQUIRED for loader
      return toggleSellerBlockStatus(id);
    },
    onMutate: () => {
      const toastId = toast.loading("Updating block status...");
      return { toastId };
    },
    onSuccess: (data, _id, context) => {
      if (!context) return;

      toast.update(context.toastId, {
        render: `Seller "${data.email}" has been ${
          data.is_blocked ? "blocked" : "unblocked"
        }.`,
        type: data.is_blocked ? "warning" : "success",
        isLoading: false,
        autoClose: 2000,
      });

      queryClient.invalidateQueries({ queryKey: ["sellers"] });
    },
    onError: (error, _id, context) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update block status.";
      toast.update(context?.toastId ?? "", {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
    onSettled: () => {
      setMutatingId(null); // <-- Reset loader
    },
  });

  return {
    approveSeller,
    rejectSeller,
    toggleBlockSeller,
    mutatingId, // <-- NOW AVAILABLE for loader
  };
};
