import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as cartApi from "../../../api/cartApi";
import { toast } from "react-toastify";
import { useCartStore } from "../../../store/cartStore";
import type { CartItem } from "../../../store/cartStore";

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const getCartState = () => useCartStore.getState().cartItems;
  const setCartState = (items: CartItem[]) => useCartStore.setState({ cartItems: items });

  return useMutation({
    mutationFn: async () => {
      return cartApi.clearCart();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = getCartState();
      setCartState([]);
      return { previousCart };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) setCartState(context.previousCart as CartItem[]);
      toast.error("Failed to clear cart");
    },
    onSuccess: () => {
      toast.success("Cart cleared");
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

export default useClearCart;
