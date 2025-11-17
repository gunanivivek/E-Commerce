// src/api/reviewApi.ts
import { getAPI } from "./axiosInstance";

// ---------------------- GET Product Reviews ----------------------
export const getProductReviews = async (
  productId: string | number,
  useAlt = true
) => {
  const client = getAPI(useAlt);
  const path = `products/${productId}/reviews`;
  const res = await client.get(path);
  const data = res.data;
  // normalize different backend response shapes to an array of reviews
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.reviews)) return d.reviews as unknown[];
    // some backends return { data: [...] }
    if (Array.isArray(d.data)) return d.data as unknown[];
  }
  return [];
};

// ---------------------- CREATE Review ----------------------------

export type CreateReviewBody = {
  rating: number | string;
  comment: string;
  author?: string | null;
};

export const createProductReview = async (
  productId: string | number,
  payload: CreateReviewBody,
  // default to alternate backend for reviews
  useAlt = true
) => {
  const client = getAPI(useAlt);
    // Use a single POST to the canonical product-level reviews endpoint.
    // Keep the body compatible with backends that expect `name` instead of `author`.
    const path = `products/${productId}/reviews`;
    const body: Record<string, unknown> = {
      rating: payload.rating,
      comment: payload.comment,
    };
    if (payload.author) body.name = payload.author;

    try {
      if (import.meta.env.DEV) console.debug("[reviewApi] POST", path, body);
      const res = await client.post(path, body, { headers: { "Content-Type": "application/json" } });
      return res.data;
    } catch (err: unknown) {
      // Normalize error for the hooks: include http status when available
      let details = "Failed to create review";
      if (err && typeof err === "object") {
        const maybeResponse = err as { response?: { status?: number; data?: unknown }; message?: unknown };
        const status = maybeResponse.response?.status;
        if (status) details = `Status ${status}`;
        else if (typeof maybeResponse.message === "string") details = maybeResponse.message;
      }
      throw new Error(`Create review failed: ${details}`);
    }
};
