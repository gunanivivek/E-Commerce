import { create } from "zustand";
import type { AdminState } from "../types/admin";

export const useAdminStore = create<AdminState>((set) => ({
  sellers: [],
  customers: [],
  loading: false,
  error: null,

  // ✅ Sellers
  setSellers: (sellersOrUpdater) =>
    set((state) => ({
      sellers:
        typeof sellersOrUpdater === "function"
          ? sellersOrUpdater(state.sellers)
          : sellersOrUpdater,
    })),

  // ✅ Customers
  setCustomers: (customersOrUpdater) =>
    set((state) => ({
      customers:
        typeof customersOrUpdater === "function"
          ? customersOrUpdater(state.customers)
          : customersOrUpdater,
    })),

  // ✅ Loading + Error handling
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // ✅ Clear all data
  clearAdminData: () =>
    set({
      sellers: [],
      customers: [],
      error: null,
      loading: false,
    }),
}));
