import { create } from "zustand";

interface Store {
  cartCount: number;
  isLoggedIn: boolean;
  setCartCount: (count: number) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  cartCount: 0,
  isLoggedIn: Boolean(localStorage.getItem('authToken')),
  setCartCount: (count: number) => set({ cartCount: count }),
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
}));
