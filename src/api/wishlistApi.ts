import API from "./axiosInstance";
import type {
  WishlistOut,
  AddWishlistRequest,
  AddWishlistResponse,
} from "../types/wishlist";

// ✅ Fetch entire wishlist
export const getWishlist = async (): Promise<WishlistOut> => {
  // Primary route
  try {
    const res = await API.get<WishlistOut>("wishlist/");
    return res.data;
  } catch (err) {
    // Try a few common alternate GET routes if server uses a different naming convention
    const tryPaths = ["wishlist", "wishlists/", "wishlists", "user/wishlist/"];
    for (const p of tryPaths) {
      try {
        const res = await API.get<WishlistOut>(p);
        return res.data;
      } catch {
        // ignore and try next
      }
    }
    // no fallback matched — rethrow original error
    throw err;
  }
};

// ✅ Add product to wishlist
export const addToWishlist = async (
  payload: AddWishlistRequest
): Promise<AddWishlistResponse> => {
  try {
    const res = await API.post<AddWishlistResponse>("wishlist/", payload);
    return res.data;
  } catch (err) {
    // Some backends expect POST /wishlist/ instead of /wishlist/add
    let respStatus: number | undefined;
    if (typeof err === "object" && err !== null && "response" in err) {
      const r = (err as { response?: { status?: number } }).response;
      respStatus = r?.status;
    }
    if (respStatus === 405 || respStatus === 404) {
      const fallback = await API.post<AddWishlistResponse>("wishlist/", payload);
      return fallback.data;
    }
    throw err;
  }
};

// ✅ Remove product from wishlist
export const removeFromWishlist = async (
  productId: number
): Promise<AddWishlistResponse> => {
  try {
    const res = await API.delete<AddWishlistResponse>(
      `wishlist/${productId}`
    );
    return res.data;
  } catch (err) {
    // fallback: DELETE /wishlist/{id}
    let respStatus: number | undefined;
    if (typeof err === "object" && err !== null && "response" in err) {
      const r = (err as { response?: { status?: number } }).response;
      respStatus = r?.status;
    }
    if (respStatus === 405 || respStatus === 404) {
      const fallback = await API.delete<AddWishlistResponse>(`wishlist/${productId}`);
      return fallback.data;
    }
    throw err;
  }
};

// ✅ Clear all wishlist items
export const clearWishlist = async (): Promise<WishlistOut> => {
  try {
    const res = await API.delete<WishlistOut>("wishlist/clear");
    return res.data;
  } catch (err) {
    let respStatus: number | undefined;
    if (typeof err === "object" && err !== null && "response" in err) {
      const r = (err as { response?: { status?: number } }).response;
      respStatus = r?.status;
    }
    if (respStatus === 405 || respStatus === 404) {
      const fallback = await API.delete<WishlistOut>("wishlist/");
      return fallback.data;
    }
    throw err;
  }
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
