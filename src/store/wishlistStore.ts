import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./useProductStore";

interface WishlistState {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],

      addToWishlist: (product) => {
        const { wishlist } = get();
        if (wishlist.some((p) => p.id === product.id)) return; // avoid duplicates
        set({ wishlist: [...wishlist, product] });
      },

      removeFromWishlist: (id) => {
        set({ wishlist: get().wishlist.filter((p) => p.id !== id) });
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: "wishlist-storage",
    }
  )
);
