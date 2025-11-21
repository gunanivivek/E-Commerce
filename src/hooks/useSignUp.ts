import { useMutation } from "@tanstack/react-query";
import type { SellerSignupRequest, SignupRequest, SignupResponse } from "../types/auth";
import { signupUser, signupSeller } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

export const useSignUp = () => {
  const setAuthUser = useAuthStore((state) => state.setUser);

  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: async (data) => {
      try {
        const response =
          data.role === "customer"
            ? await signupUser(data)
            : await signupSeller(data as SellerSignupRequest);

        // -----------------------------
        // FIX: Normalize API response
        // -----------------------------
        // If backend returns only the user object → wrap it
        if (response && !("user" in response)) {
          return {
            user: response,
            message: "Signup successful",
          } as SignupResponse;
        }

        return response;
      } catch (err: unknown) {
        let errorMessage = "Something went wrong. Please try again.";

        const axiosError = err as AxiosError<{
          message?: string;
          detail?: string | { msg?: string }[];
        }>;

        if (axiosError.response?.data) {
          const { message, detail } = axiosError.response.data;

          if (message) errorMessage = message;
          else if (Array.isArray(detail)) errorMessage = detail[0]?.msg || errorMessage;
          else if (typeof detail === "string") errorMessage = detail;
        }

        throw new Error(errorMessage);
      }
    },

    onSuccess: (data, variables) => {
      if (variables.role === "customer") {
        // CUSTOMER → STORE EXACTLY LIKE LOGIN
        setAuthUser({
          user: data.user,
          message: data.message,
        });

        toast.success("Signup successful!");
        return;
      }

      // SELLER FLOW
      toast.info(
        "Your account is under approval. You will receive an email once approved."
      );

      setAuthUser({
        user: data.user,
        message: "",
      });
    },

    onError: (error) => {
      toast.error(error.message);
      setAuthUser({
        user: null,
        message: error.message,
      });
    },
  });
};
