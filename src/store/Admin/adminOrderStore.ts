import { create } from "zustand";
import type { Order } from "../../types/admin";

interface AdminOrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;

  setOrders: (orders: Order[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAdminOrderStore = create<AdminOrderState>((set) => ({
  orders: [],
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
