import API from "./axiosInstance";
import type { Review } from "../types/review";

export const fetchReviews = async (productId: string | number): Promise<Review[]> => {
  const path = `products/${productId}/reviews`;

  const normalize = (data: { average_rating?: number; reviews?: Review[] } | Review[] | unknown): Review[] => {
    if (Array.isArray(data)) return data as Review[];
    if (data && typeof data === "object") {
      const maybeObj = data as { reviews?: Review[] };
      if (Array.isArray(maybeObj.reviews)) return maybeObj.reviews;
    }
    return [];
  };

  try {
    const res = await API.get<{ average_rating?: number; reviews?: Review[] } | Review[]>(path);
    return normalize(res.data);
  } catch (err: unknown) {
    const lastErr = err as { response?: { status?: number }; message?: string };
    const status = lastErr?.response?.status;

    // If server rejects the method (405) try a set of fallback GET URL patterns used by some backends
    const fallbackPaths = [
      path + "/",
      `reviews?product_id=${productId}`,
      `products/reviews?product_id=${productId}`,
      `product-reviews?product_id=${productId}`,
      `products/${productId}/reviews/list`,
    ];

    // Try the fallback paths sequentially and return on first success
    if (status === 405) {
      for (const p of fallbackPaths) {
        try {
          // use get without typing the response precisely to avoid strict mismatches
          const r = await API.get<{ average_rating?: number; reviews?: Review[] } | Review[]>(p);
          console.info(`fetchReviews: succeeded with fallback path: ${p}`);
          return normalize(r.data);
        } catch (e) {
          console.warn(`fetchReviews: fallback ${p} failed`, e);
          // continue to next fallback
        }
      }
    }

    // If none of the fallbacks succeeded, log and rethrow the original error so calling code can handle it.
    console.error("fetchReviews error", err);
    throw err;
  }
};

// backward-compatible alias used in some pages
export const getProductReviews = fetchReviews;

export default {
  fetchReviews,
  getProductReviews,
};

export const createReview = async (
  productId: string | number,
  payload: { rating?: number; comment?: string; author?: string }
): Promise<Review> => {
  const path = `products/${productId}/reviews`;
  const res = await API.post<Review>(path, payload);
  return res.data;
};
