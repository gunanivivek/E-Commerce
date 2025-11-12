/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateProduct } from "../../api/sellerApi";
import type { ViewProduct } from "../../types/seller";

/**
 * useUpdateProduct — React Query hook for updating a product
 * Handles FormData (name, price, description, stock, category_id, images)
 */
export const useUpdateProduct = (productId: number | null) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormData): Promise<ViewProduct> => {
      if (!productId) throw new Error("Product ID is missing");
      return await updateProduct(productId, formData);
    },
    onSuccess: () => {
      toast.success("✅ Product updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (productId) queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.detail ||
        error.message ||
        "❌ Failed to update product. Try again.";
      toast.error(msg);
    },
  });

  return mutation;
};
