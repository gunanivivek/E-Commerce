// src/store/reviewStore.ts
import { create } from "zustand";
import type { Review } from "../types/review";
import * as reviewApi from "../api/reviewApi";
import { toast } from "react-toastify";

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  fetchReviews: (productId: string | number) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  isLoading: false,

  fetchReviews: async (productId) => {
    try {
      set({ isLoading: true });
      const data = await reviewApi.fetchReviews(productId);
      set({ reviews: data, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      toast.error("Unable to load reviews");
      set({ isLoading: false });
    }
  },
}));
