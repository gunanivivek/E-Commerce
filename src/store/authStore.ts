import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: string | null;
  role: "buyer" | "seller" | null;
  setAuth: (token: string, user: string, role: "buyer" | "seller") => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: localStorage.getItem("user") || null,
  role: (localStorage.getItem("role") as "buyer" | "seller") || null,
  setAuth: (token, user, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
    localStorage.setItem("role", role);
    set({ token, user, role });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    set({ token: null, user: null, role: null });
  },
}));
