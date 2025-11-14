import API from "./axiosInstance";
import type { Review } from "../types/review";

// Fetch reviews for a productId
export const fetchReviews = async (productId: string | number): Promise<Review[]> => {
  const path = `products/${productId}/reviews`;
  const res = await API.get<Review[]>(path);
  return Array.isArray(res.data) ? res.data : [];
};

export const getProductReviews = fetchReviews;

// Create a review for a product
export const createReview = async (
  productId: string | number,
  payload: { rating?: number; comment?: string; author?: string }
): Promise<Review> => {
  const path = `products/${productId}/reviews`;
  const res = await API.post<Review>(path, payload);
  return res.data;
};

export default {
  fetchReviews,
  getProductReviews,
  createReview,
};
