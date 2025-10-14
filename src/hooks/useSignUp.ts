import { useMutation } from "@tanstack/react-query";
import type { SignupRequest, SignupResponse } from "../types/auth";
import { signupUser } from "../api/authApi"; // your API call
import { useAuthStore } from "../store/authStore";


export const useSignUp = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signupUser,
    onSuccess: (data) => {
      // Save token & user info in Zustand store
      setAuth(data.access_token, data.email, data.role);
    },
  });
};
