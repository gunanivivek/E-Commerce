import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as cartApi from "../../api/cartApi";
import { toast } from "react-toastify";
import type {
  AddToCartRequest,
  AddToCartResponse,
  CartResponse,
  ClearCartResponse,
  RemoveFromCartRequest,
  RemoveFromCartResponse,
  UpdateCartQuantityRequest,
  UpdateCartQuantityResponse,
} from "../../types/cart";
import { useAuthStore } from "../../store/authStore";
import { showToast } from "../../components/toastManager";

// ---------------------- useCart Hook ----------------------
export const useCart = (enabled: boolean) => {
  const user = useAuthStore((state) => state.user);
  return useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!user) {
        throw new Error("Please login to add items in the cart");
      }
      const data = await cartApi.getCart();

      return {
        items: Array.isArray(data.items) ? data.items : [],
        subtotal: Number(data.subtotal ?? 0),
        discount: Number(data.discount ?? 0),
        total: Number(data.total ?? 0),
        coupon: data.coupon ?? null,
        message: data.message,
      };
    },
    enabled,
  });
};

// ---------------------- useAddToCart Hook ----------------------
export const useAddToCart = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  return useMutation<AddToCartResponse, Error, AddToCartRequest>({
    mutationFn: async (payload) => {
      if (!user) {
        throw new Error("Please login to add items in the cart");
      }
      return await cartApi.addToCart(payload);
    },
    onSuccess: (data) => {
      showToast(data.message || "Item added to cart", "success");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add item to cart");
    },
  });
};

export const useUpdateCart = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  return useMutation<
    UpdateCartQuantityResponse,
    Error,
    UpdateCartQuantityRequest
  >({
    mutationFn: async (payload) => {
      if (!user) {
        throw new Error("Please login to update items in the cart");
      }
      return await cartApi.updateCartQuantity(payload);
    },
    onSuccess: (data) => {
      showToast(data.message || "Cart updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update cart");
    },
  });
};

// ---------------------- Remove Item from Cart ----------------------
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation<RemoveFromCartResponse, Error, RemoveFromCartRequest>({
    mutationFn: cartApi.removeFromCart,
    onSuccess: (data) => {
      showToast(data.message || "Item removed from cart", "success");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to remove item");
    },
  });
};

// ---------------------- Clear Cart ----------------------
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation<ClearCartResponse, Error>({
    mutationFn: cartApi.clearCart,
    onSuccess: (data) => {
      showToast(data.message || "Cart cleared", "success");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to clear cart");
    },
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => cartApi.applyCoupon(code),

    onSuccess: (updatedCart) => {
      if (updatedCart.message === null) {
        showToast("Coupon applied successfully", "success");
      } else {
        showToast(updatedCart.message, "error");
      }

      // Replace cart data directly for fast UI update
      queryClient.setQueryData(["cart"], updatedCart);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Invalid or expired coupon");
    },
  });
};

export const useApplicableCoupons = () => {
  return useQuery({
    queryKey: ["applicableCoupons"],
    queryFn: cartApi.getApplicableCoupons,
  });
};
