import { create } from "zustand";

interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: "admin" | "customer" | "seller";
  profile_picture: string | null;
  is_active: boolean;
  is_blocked: boolean;
}

interface AuthState {
  user: User | null;
  message: string | null;
  setUser: (data: { user: User | null; message: string | null }) => void;
  logout: () => void;
  clearAuth: () => void;
}


const storedAuth = localStorage.getItem("authData");
const initialState = storedAuth
  ? JSON.parse(storedAuth)
  : { user: null, message: null };

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user,
  message: initialState.message,

  setUser: (data) => {
    set({ user: data.user, message: data.message });

    localStorage.setItem("authData", JSON.stringify(data));
  },

  logout: () => {
    set({ user: null, message: null });
    localStorage.removeItem("authData");
  },
  clearAuth: () => {
    set({ user: null, message: null });
    localStorage.removeItem("authData");
  },
}));
