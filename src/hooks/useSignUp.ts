import { useMutation } from "@tanstack/react-query";
import type {SellerSignupRequest, SignupRequest, SignupResponse } from "../types/auth";
import { signupUser, signupSeller } from "../api/authApi"; 
import { useAuthStore } from "../store/authStore";


export const useSignUp = () => {
  const setSignupAuth = useAuthStore((state) => state.setSignupAuth);

  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: (data) => {
      if (data.role === "buyer") {
        return signupUser(data);
      } else {
        return signupSeller(data as SellerSignupRequest);
      }
    },
    onSuccess: (data) => {
      setSignupAuth(data.access_token, data.email, data.role);
    },
  });
};
