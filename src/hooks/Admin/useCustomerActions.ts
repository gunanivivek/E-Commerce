// src/hooks/Admin/useCustomerActions.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { useAdminStore } from "../../store/adminStore";
import type { Customer } from "../../types/admin";
import type { AxiosError } from "axios";
import { updateCustomerStatus } from "../../api/customerApi";

interface ApiError {
  message?: string;
  detail?: string;
}

export const useCustomerActions = () => {
  const queryClient = useQueryClient();
  const { setCustomers } = useAdminStore();

  const { mutate: toggleBlockCustomer, isPending } = useMutation<
    Customer,
    AxiosError<ApiError>,
    { id: number; is_blocked: boolean }
  >({
    mutationFn: ({ id, is_blocked }) => updateCustomerStatus(id, is_blocked),

    onSuccess: (updatedCustomer) => {
      // update state immediately
      setCustomers((prev) =>
        prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
      );

      toast.success(
        updatedCustomer.is_blocked
          ? "Customer account blocked successfully."
          : "Customer account unblocked successfully."
      );

      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },

    onError: (error) => {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update customer status.";
      toast.error(errorMsg);
    },
  });

  return { toggleBlockCustomer, isPending };
};
