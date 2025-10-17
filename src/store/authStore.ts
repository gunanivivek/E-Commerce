import { create } from "zustand";

interface User {
  email: string;
  role: "customer" | "seller";
}



interface AuthState {
  user: User | null;          
  setUser: (user: User) => void;
  logout: () => void;        
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // initial state
 
  // Set user info
  setUser: (user: User) => set({ user }),
 
  // Clear user info
  logout: () => set({ user: null }),
}));