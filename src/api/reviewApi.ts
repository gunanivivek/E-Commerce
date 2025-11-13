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
  const status = (err as unknown as { response?: { status?: number } })?.response?.status;
    // If server rejects the method (common when trailing slash is required or router differs), retry with trailing slash
    if (status === 405) {
      try {
        const res2 = await API.get<{ average_rating?: number; reviews?: Review[] } | Review[]>(path + "/");
        return normalize(res2.data);
      } catch (err2) {
        // fall through to throw original error below
        console.error("fetchReviews retry with trailing slash failed", err2);
      }
    }

    // If the request failed due to an OPTIONS preflight returning 405, the browser network tab will show an OPTIONS request with 405.
    // Surface the error so calling code can inspect it.
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
