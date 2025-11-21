import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { changePassword } from "../api/authApi";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../types/auth";
import { toast } from "react-toastify";

export const useChangePassword = () => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordRequest>({
    mutationFn: async (data) => {
      try {
        return await changePassword(data);
      } catch (error: unknown) {
        let errorMessage = "Something went wrong. Please try again.";

        if (error instanceof Error) {
          const axiosError = error as AxiosError<{
            detail?: string;
            message?: string;
          }>;
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
    
      console.log("✅ Password change successful:", data.message);
    },

    onError: (error) => {
      // toast.error(error.message);
      console.error("❌ Password change failed:", error.message);
    },
  });
};
