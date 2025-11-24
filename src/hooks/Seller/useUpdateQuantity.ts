// hooks/Seller/useUpdateQuantity.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductStock } from "../../api/sellerApi";
import { toast } from "react-toastify";
import { showToast } from "../../components/toastManager";

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateProductStock(id, { quantity }),
    onSuccess: (_, variables) => {
      const { id } = variables;
      showToast("Quantity updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["SellerProducts"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: () => {
      toast.error("Failed to update quantity!");
    },
  });
};
