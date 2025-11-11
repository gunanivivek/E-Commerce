import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as cartApi from "../../../api/cartApi";
import { useCartStore } from "../../../store/cartStore";
import type { CartItem } from "../../../store/cartStore";

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  const getCartState = () => useCartStore.getState().cartItems;
  const setCartState = (items: CartItem[]) => useCartStore.setState({ cartItems: items });

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      // call API wrapper (cartApi.updateCart expects { product_id, quantity })
      return cartApi.updateCart({ product_id: id, quantity });
    },
    onMutate: async (updatedItem: { id: number; quantity: number }) => {
      // cancel any react-query refetches (may be unused in this repo)
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      // snapshot current cart from zustand
      const previousCart = getCartState();

      // optimistic update in zustand store
      const next = previousCart.map((it) =>
        it.id === updatedItem.id ? { ...it, quantity: updatedItem.quantity } : it
      );
      setCartState(next);

      return { previousCart };
    },
    onError: (_error, _vars, context) => {
      // rollback to previous state
      if (context?.previousCart) {
        setCartState(context.previousCart as CartItem[]);
      }
      // cancel any pending success toast for this product (if scheduled)
      // no toast for update failures per UX decision
    },
    onSuccess: () => {
      // no success toast for quantity updates per UX decision
    },
    onSettled: () => {
      // ensure server and UI are in sync: fetch fresh cart via cart store
      try {
        useCartStore.getState().fetchCart();
      } catch {
        // fail silently
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export default useUpdateCartQuantity;
