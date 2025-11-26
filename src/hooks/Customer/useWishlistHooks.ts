// src/hooks/wishlistHooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as wishlistApi from "../../api/wishlistApi";
import type {
  AddWishlistRequest,
  RemoveWishlistRequest,

} from "../../types/wishlist";
import { showToast } from "../../components/toastManager";
import { useAuthStore } from "../../store/authStore";

export function useGetWishlist(enabled: boolean) {
   const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getWishlist,
    enabled: enabled && !!user,
  });
}

export function useAddWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AddWishlistRequest) => wishlistApi.addToWishlist(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      showToast(data.message || "Item added to wishlist", "success");
    },
  });
}

export function useRemoveWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ product_id }: RemoveWishlistRequest) =>
      wishlistApi.removeFromWishlist(product_id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      showToast(data.message || "Item removed from wishlist", "success");
    },
  });
}

export function useClearWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.clearWishlist,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      showToast(data.message || "Wishlist cleared", "success");
    },
  });
}
