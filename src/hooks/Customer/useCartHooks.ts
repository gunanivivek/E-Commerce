/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/Customer/CartHooks/useCartHooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as cartApi from "../../api/cartApi"
import { toast } from "react-toastify";
import type { AddToCartRequest, AddToCartResponse, CartResponse, ClearCartResponse, RemoveFromCartRequest, RemoveFromCartResponse, UpdateCartQuantityRequest, UpdateCartQuantityResponse } from "../../types/cart";

// ---------------------- useCart Hook ----------------------
export const useCart = (enabled: boolean) => {
  return useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const data = await cartApi.getCart();

      return {
        items: Array.isArray(data.items) ? data.items : [],
        subtotal: Number(data.subtotal ?? 0),
        discount: Number(data.discount ?? 0),
        total: Number(data.total ?? 0),
        coupon: data.coupon ?? null,
      };
    },
    staleTime: 1000 * 60 * 2, // cache for 2 minutes
    refetchOnWindowFocus: false, // prevent flicker on tab change
    enabled,
  });
};

// ---------------------- useAddToCart Hook ----------------------
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation<AddToCartResponse, Error, AddToCartRequest>({
    mutationFn: async (payload) => {
      return await cartApi.addToCart(payload);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Item added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add item to cart");
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateCartQuantityResponse, Error, UpdateCartQuantityRequest>({
    mutationFn: async (payload) => {
      return await cartApi.updateCartQuantity(payload);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Cart updated successfully");
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
      toast.success(data.message || "Item removed from cart");
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
      toast.success(data.message || "Cart cleared");
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
      toast.success("Coupon applied successfully!");

      // Replace cart data directly for fast UI update
      queryClient.setQueryData(["cart"], updatedCart);
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Invalid or expired coupon");
    },
  });
};
