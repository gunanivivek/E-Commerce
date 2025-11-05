import { create } from "zustand";
import { useCartStore } from "./cartStore";

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
  cart: Product[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  cart: [],
  wishlist: [],
  addToCart: (product) =>
    set((state) => {
      // also add to the centralized cartStore used by the Cart page
      try {
        useCartStore.getState().addItem({
          id: product.id,
          name: product.name,
          price: product.discount_price ?? product.price,
          quantity: 1,
          image: product.image,
        });
      } catch {
        // ignore if cartStore not available for some reason
      }

      return state.cart.some((p) => p.id === product.id)
        ? state
        : { cart: [...state.cart, product] };
    }),
  removeFromCart: (id) =>
    set((state) => ({ cart: state.cart.filter((p) => p.id !== id) })),
  addToWishlist: (product) =>
    set((state) =>
      state.wishlist.some((p) => p.id === product.id)
        ? state
        : { wishlist: [...state.wishlist, product] }
    ),
  removeFromWishlist: (id) =>
    set((state) => ({ wishlist: state.wishlist.filter((p) => p.id !== id) })),
}));
