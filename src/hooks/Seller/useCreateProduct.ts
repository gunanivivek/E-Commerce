/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../api/sellerApi";
import { toast } from "react-toastify";

export const useCreateProduct = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_data) => {
      toast.success("Product created successfully!");

      queryClient.invalidateQueries({ queryKey: ["products"] });

      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create product");
    },
  });
};
