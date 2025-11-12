import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as cartApi from "../../../api/cartApi";
import { toast } from "react-toastify";
import { useCartStore } from "../../../store/cartStore";
import type { CartItem } from "../../../store/cartStore";

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const getCartState = () => useCartStore.getState().cartItems;
  const setCartState = (items: CartItem[]) => useCartStore.setState({ cartItems: items });

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity?: number }) => {
      const q = quantity ?? 1;
      return cartApi.addToCart({ product_id: id, quantity: q });
    },
    onMutate: async ({ id, quantity = 1 }: { id: number; quantity?: number }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = getCartState();
      const exists = previousCart.find((it) => it.id === id);
      let next: CartItem[];
      if (exists) {
        next = previousCart.map((it) => (it.id === id ? { ...it, quantity: it.quantity + quantity } : it));
      } else {
        next = [...previousCart, { id, name: "", price: 0, quantity }];
      }
      setCartState(next);
      return { previousCart, existed: Boolean(exists) };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) setCartState(context.previousCart as CartItem[]);
      toast.error("Failed to add to cart");
    },
    onSuccess: (_data, _vars, context) => {
      // If item already existed we treat this as a quantity update and skip the "Added to cart" toast
      if (!context?.existed) {
        toast.success("Added to cart");
      }
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

export default useAddToCart;
