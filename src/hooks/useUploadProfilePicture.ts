import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { uploadProfilePicture } from "../api/adminApi";
import { useAuthStore } from "../store/authStore";
import type { AxiosError } from "axios";

interface ApiError {
  message?: string;
}

interface UploadResponse {
  message: string;
  image_url: string;
}

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation<UploadResponse, AxiosError<ApiError>, FormData>({
    mutationFn: (formData) => uploadProfilePicture(formData),

    onSuccess: (data) => {
      toast.success(data.message || "Profile picture updated successfully!");
      console.log("✅ Uploaded Image URL:", data.image_url);

      // 🟢 Update local user state and localStorage
      if (user) {
        const updatedUser = { ...user, profile_picture: data.image_url };
        setUser({ user: updatedUser, message: "Profile picture updated" });
      }

      // Optional: refetch any user-related queries
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },

    onError: (error) => {
      const msg = error.response?.data?.message || "Image upload failed!";
      toast.error(msg);
      console.error("❌ Upload error:", msg);
    },
  });
  
};
