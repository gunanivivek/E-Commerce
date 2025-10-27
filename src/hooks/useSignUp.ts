import { useMutation } from "@tanstack/react-query";
import type { SellerSignupRequest, SignupRequest, SignupResponse } from "../types/auth";
import { signupUser, signupSeller } from "../api/authApi"; 
import { useAuthStore } from "../store/authStore";

export const useSignUp = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: (data) => {
      if (data.role === "customer") {
        return signupUser(data);
      } else {
        return signupSeller(data as SellerSignupRequest);
      }
    },
    onSuccess: (data) => {

      setUser({
        user: data.user,
        message: data.message,
      });
    },
  });
};
