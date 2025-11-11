import { create } from "zustand";
import { toast } from "react-toastify";
import type { Product } from "./useProductStore";

interface WishlistState {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
}

// Wishlist is intentionally NOT persisted to localStorage.
// Keeping wishlist in-memory avoids stale client-side state and
// ensures server (if implemented) can be the single source of truth.
export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],

  addToWishlist: (product) => {
    const { wishlist } = get();
    if (wishlist.some((p) => p.id === product.id)) return; // avoid duplicates
    set({ wishlist: [...wishlist, product] });
    try {
      toast.success("Added to wishlist");
    } catch {
      // ignore toast errors
    }
  },

  removeFromWishlist: (id) => {
    set({ wishlist: get().wishlist.filter((p) => p.id !== id) });
    try {
      toast.success("Removed from wishlist");
    } catch {
      // ignore
    }
  },

  clearWishlist: () => set({ wishlist: [] }),
}));
