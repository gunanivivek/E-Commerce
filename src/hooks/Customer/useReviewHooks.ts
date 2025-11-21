import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as reviewApi from "../../api/reviewApi";
import type { CreateReviewBody } from "../../api/reviewApi";
import { toast } from "react-toastify";

// GET reviews
export const useReviews = (productId?: string | number) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => {
      if (!productId) throw new Error("Product ID missing");
      return reviewApi.getProductReviews(productId);
    },
    enabled: !!productId,
  });
};


// Create review for a specific product
export const useCreateReview = (productId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewBody) => {
      if (!productId) throw new Error("Missing product id");
      return reviewApi.createProductReview(productId, payload);
    },
    onSuccess: () => {
      toast.success("Review added successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
    onError: (err: unknown) => {
      const message =
        typeof err === "string"
          ? err
          : err instanceof Error
          ? err.message
          : "Failed to add review";
      toast.error(message);
    },
  });
};

// ---- Summarize Reviews ----
export const useSummarizeReviews = (productId?: string | number) => {
  return useQuery({
    queryKey: ["summarize-reviews", productId],
    queryFn: () => {
      if (!productId) throw new Error("Missing product id");
      return reviewApi.summarizeProductReviews(productId);
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 mins cache
  });
};
