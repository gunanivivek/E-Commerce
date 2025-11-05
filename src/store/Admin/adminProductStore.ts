// store/adminProductStore.ts
import { create } from "zustand";
import type { Product } from "../../types/admin";


interface AdminProductState {
  products: Product[];   // ✅ Match real Product type
  loading: boolean;
  error: string | null;

  setProducts: (products: Product[]) => void;
  updateProductStatusLocal: (productId: number, status: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAdminProductStore = create<AdminProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),

  updateProductStatusLocal: (productId, status) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, status } : p
      ),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
