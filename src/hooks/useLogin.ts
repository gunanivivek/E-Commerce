import { useMutation } from "@tanstack/react-query";
import type { LoginRequest, LoginResponse } from "../types/auth";
import { loginUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const setAuthUser = useAuthStore((state) => state.setUser);
 
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data) => {
 
      setAuthUser({ email: data.user.email, role: data.user.role });
    },
  });
};
