import { useMutation } from "@tanstack/react-query";
import type { LoginRequest, LoginResponse } from "../types/auth";
import { loginUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import { showToast } from "../components/toastManager";

export const useLogin = () => {
  const setAuthUser = useAuthStore((state) => state.setUser);

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (data) => {
      try {
        return await loginUser(data);
      } catch (error: unknown) {
        let errorMessage = "Something went wrong. Please try again.";

        if (error instanceof Error) {
          const axiosError = error as AxiosError<{ detail?: string; message?: string }>;
          if (axiosError.response?.data?.detail) {
            errorMessage = axiosError.response.data.detail;
          } else if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          } else {
            errorMessage = error.message;
          }
        }

        throw new Error(errorMessage);
      }
    },

    onSuccess: (data) => {
      setAuthUser({
        user: data.user,
        message: data.message || "Login successful",
      });
      showToast("Login successful!", "success");
    },

    onError: (error) => {
      toast.error(error.message); 
      setAuthUser({
        user: null,
        message: null, 
      });
    },
  });
};
