import { useMutation } from "@tanstack/react-query";
import type { LoginRequest, LoginResponse } from "../types/auth";
import { loginUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const setAuthUser = useAuthStore((state) => state.setUser);

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data) => {

      setAuthUser({
        user: data.user,
        message: data.message,
      });
    },
  });
};
