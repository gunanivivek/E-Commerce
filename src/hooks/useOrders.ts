
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { getUserOrders, cancelOrder, downloadInvoice } from "../api/orderApi";
import { useOrderStore } from "../store/orderStore";
import type { Order } from "../types/order";

export const useOrders = () => {
  const queryClient = useQueryClient();
  const setOrders = useOrderStore((s) => s.setOrders);

  // Fetch Orders
  const { data, isLoading, isError, error, isSuccess } = useQuery<Order[], AxiosError<{ detail?: string }>>({
    queryKey: ["orders"],
    queryFn: getUserOrders,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setOrders(data || []);
    }
  }, [isSuccess, data, setOrders]);

  useEffect(() => {
    if (isError && error) {
      toast.error(error.response?.data?.detail || "Failed to load orders.");
    }
  }, [isError, error]);

  // CANCEL ORDER
  const cancelMutation = useMutation({
    mutationFn: (orderId: number) => cancelOrder(orderId),
   onMutate: () => {
  const toastId = toast.loading("Cancelling order...");
  return toastId;
},

    onSuccess: (_, __, context) => {
      if (context) {
        toast.update(context, { render: "Order cancelled successfully!", type: "success", isLoading: false, autoClose: 2000 });
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: AxiosError<{ detail?: string }>, __, context) => {
      if (context) {
        toast.update(context, {
          render: error.response?.data?.detail || "Failed to cancel order.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    },
  });

  // DOWNLOAD INVOICE
  const downloadInvoiceMutation = useMutation({
    mutationFn: downloadInvoice,
    onMutate: () => {
      const toastId = toast.loading("Preparing invoice...");
      return toastId;
    },
    onSuccess: (blob, orderId, context) => {
      const file = new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      a.click();
      if (context) {
        toast.update(context, { render: "Invoice downloaded successfully!", type: "success", isLoading: false, autoClose: 2000 });
      }
    },
    onError: (error: AxiosError<{ detail?: string }>, __, context) => {
      if (context) {
        toast.update(context, {
          render: error.response?.data?.detail || "Failed to download invoice.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    },
  });

  return {
    orders: data,
    isLoading,
    cancelMutation,
    downloadInvoiceMutation,
  };
};
