import { create } from "zustand";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  stock: number;
  images?: string[];
  slug: string;
  image: string;
  is_active: boolean;
  created_at: string;
  rating?: number;
}

interface ProductStore {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  wishlist: [],

  addToWishlist: (product) =>
    set((state) =>
      state.wishlist.some((p) => p.id === product.id)
        ? state
        : { wishlist: [...state.wishlist, product] }
    ),

  removeFromWishlist: (id) =>
    set((state) => ({ wishlist: state.wishlist.filter((p) => p.id !== id) })),
}));
