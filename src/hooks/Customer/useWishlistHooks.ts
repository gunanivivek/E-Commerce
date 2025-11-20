// src/hooks/wishlistHooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as wishlistApi from "../../api/wishlistApi";
import type {
  AddWishlistRequest,
  RemoveWishlistRequest,

} from "../../types/wishlist";

export function useGetWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getWishlist,
  });
}

export function useAddWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AddWishlistRequest) => wishlistApi.addToWishlist(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

export function useRemoveWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ product_id }: RemoveWishlistRequest) =>
      wishlistApi.removeFromWishlist(product_id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

export function useClearWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: wishlistApi.clearWishlist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
