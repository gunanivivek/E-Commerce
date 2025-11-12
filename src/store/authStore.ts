import { create } from "zustand";
import { logoutUser } from "../api/authApi";

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

  // ✅ New: update only parts of the user safely
  updateUser: (updatedData: Partial<User>) => void;

  // ✅ Existing API for login/set user
  setUser: (data: { user: User | null; message: string | null }) => void;

  logout: () => void;
  clearAuth: () => void;
}

const storedAuth = localStorage.getItem("authData");
const initialState = storedAuth
  ? JSON.parse(storedAuth)
  : { user: null, message: null };

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialState.user,
  message: initialState.message,

  // ✅ For login or initial auth set
  setUser: (data) => {
    set({ user: data.user, message: data.message });
    localStorage.setItem("authData", JSON.stringify(data));
  },

  // ✅ For profile updates (merge safely)
  updateUser: (updatedData) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const newUser = { ...currentUser, ...updatedData };
    set({ user: newUser });
    localStorage.setItem(
      "authData",
      JSON.stringify({ user: newUser, message: get().message })
    );
  },

  logout: () => {
    set({ user: null, message: null });
    localStorage.removeItem("authData");
    logoutUser();
  },

  clearAuth: () => {
    set({ user: null, message: null });
    localStorage.removeItem("authData");
  },
}));
