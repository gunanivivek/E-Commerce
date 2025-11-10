import { create } from "zustand";
import type { AdminState } from "../types/admin";

export const useAdminStore = create<AdminState>((set) => ({
  sellers: [],
  customers: [],
  loading: false,
  error: null,

  setSellers: (sellersOrUpdater) =>
    set((state) => ({
      sellers:
        typeof sellersOrUpdater === "function"
          ? sellersOrUpdater(state.sellers)
          : sellersOrUpdater,
    })),


  setCustomers: (customersOrUpdater) =>
    set((state) => ({
      customers:
        typeof customersOrUpdater === "function"
          ? customersOrUpdater(state.customers)
          : customersOrUpdater,
    })),


  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),


  clearAdminData: () =>
    set({
      sellers: [],
      customers: [],
      error: null,
      loading: false,
    }),
}));
