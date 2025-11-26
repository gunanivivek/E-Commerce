import { create } from "zustand";

interface Store {
  cartCount: number;
  wishlistCount: number;
  isLoggedIn: boolean;
  setCartCount: (count: number) => void;
  setWishlistCount: (count: number) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  cartCount: 0,
  wishlistCount: 0,
  isLoggedIn: Boolean(localStorage.getItem('authToken')),
  setCartCount: (count: number) => set({ cartCount: count }),
  setWishlistCount: (count: number) => set({ wishlistCount: count }),
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
}));
