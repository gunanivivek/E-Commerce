import { create } from "zustand";
import type { Address } from "../types/Address";


interface AddressStore {
  addresses: Address[];
  selectedAddress: Address | null;

  setAddresses: (data: Address[]) => void;
  setSelectedAddress: (data: Address | null) => void;
}

export const useAddressStore = create<AddressStore>((set) => ({
  addresses: [],
  selectedAddress: null,

  setAddresses: (data) => set({ addresses: data }),
  setSelectedAddress: (data) => set({ selectedAddress: data }),
}));
