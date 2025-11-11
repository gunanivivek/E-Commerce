import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as cartApi from "../../../api/cartApi";
import { toast } from "react-toastify";
import { useCartStore } from "../../../store/cartStore";

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      return cartApi.applyCoupon(code);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      // no optimistic discount calculation - keep it simple and refetch after
      return {};
    },
    onError: () => {
      toast.error("Failed to apply coupon");
    },
    onSuccess: () => {
      toast.success("Coupon applied");
    },
    onSettled: () => {
      try {
        useCartStore.getState().fetchCart();
      } catch {
        // ignore
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export default useApplyCoupon;
