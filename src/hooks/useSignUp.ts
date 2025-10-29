import { useMutation } from "@tanstack/react-query";
import type { SellerSignupRequest, SignupRequest, SignupResponse } from "../types/auth";
import { signupUser, signupSeller } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import type { AxiosError } from "axios";

export const useSignUp = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: async (data) => {
      try {
        // Choose correct API based on role
        if (data.role === "customer") {
          return await signupUser(data);
        } else {
          return await signupSeller(data as SellerSignupRequest);
        }
      } catch (err: unknown) {
        let errorMessage = "Something went wrong. Please try again.";

        const axiosError = err as AxiosError<{
          status?: string;
          message?: string;
          detail?: string | { msg?: string }[];
        }>;

        if (axiosError.response?.data) {
          const { message, detail } = axiosError.response.data;

          if (message) {
            // Case: custom backend message
            errorMessage = message;
          } else if (Array.isArray(detail)) {
            // Case: FastAPI validation error (detail is an array)
            // Example: [{ msg: "value is not a valid phone number", loc: ["body","phone"] }]
            errorMessage = detail[0]?.msg || errorMessage;
          } else if (typeof detail === "string") {
            // Case: simple string detail
            errorMessage = detail;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        throw new Error(errorMessage);
      }
    },

    onSuccess: (data) => {
      setUser({
        user: data.user,
        message: data.message || "Signup successful!",
      });
    },

    onError: (error) => {
      setUser({
        user: null,
        message: error.message,
      });
    },
  });
};
