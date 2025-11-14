import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as reviewApi from "../../api/reviewApi";
import { toast } from "react-toastify";
import type { Review } from "../../types/review";

// Fetch reviews for a product using react-query
export const useReviews = (productId?: string | number) => {
  return useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      if (!productId) return [];
      const data = await reviewApi.fetchReviews(productId);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// Create review mutation. Pass productId when creating the hook so the mutation only needs the payload.
export const useCreateReview = (productId?: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, { rating?: number; comment?: string; author?: string }>(
    async (payload) => {
      if (!productId) throw new Error("Missing product id for creating review");
      return await reviewApi.createReview(productId, payload);
    },
    {
      onSuccess: () => {
        toast.success("Review added");
        queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      },
      onError: (err) => {
        toast.error(err.message || "Failed to add review");
      },
    }
  );
};
