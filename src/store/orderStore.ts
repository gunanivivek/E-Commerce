import { create } from "zustand";
import type { Order } from "../types/order";

interface OrderStore {
  orders: Order[];
  selectedOrder: Order | null;

  setOrders: (data: Order[]) => void;
  setSelectedOrder: (data: Order | null) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  selectedOrder: null,

  setOrders: (data) => set({ orders: data }),
  setSelectedOrder: (data) => set({ selectedOrder: data }),
}));
