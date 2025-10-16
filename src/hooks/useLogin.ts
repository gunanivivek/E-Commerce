import { useMutation } from "@tanstack/react-query";
import type { LoginRequest, LoginResponse } from "../types/auth";
import { loginUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.access_token, data.user.email );
    },
  });
};
