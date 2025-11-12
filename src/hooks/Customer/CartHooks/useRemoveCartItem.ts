import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as cartApi from "../../../api/cartApi";
import { toast } from "react-toastify";
import { useCartStore } from "../../../store/cartStore";
import type { CartItem } from "../../../store/cartStore";

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const getCartState = () => useCartStore.getState().cartItems;
  const setCartState = (items: CartItem[]) => useCartStore.setState({ cartItems: items });

  return useMutation({
    mutationFn: async (id: number) => {
      return cartApi.removeFromCart(id);
    },
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = getCartState();
      const next = previousCart.filter((it) => it.id !== id);
      setCartState(next);
      return { previousCart };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) setCartState(context.previousCart as CartItem[]);
      toast.error("Failed to remove item from cart");
    },
    onSuccess: () => {
      toast.success("Item removed from cart");
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

export default useRemoveCartItem;
