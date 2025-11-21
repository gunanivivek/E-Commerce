import api from "./axiosInstance";
import type {
  WishlistOut,
  AddWishlistRequest,
  AddWishlistResponse,
  RemoveWishlistResponse,
  ClearWishlistResponse,
} from "../types/wishlist";

// ---------------------- GET WISHLIST ----------------------
export const getWishlist = async (): Promise<WishlistOut> => {
  const res = await api.get<WishlistOut>("/wishlist/");
  return res.data;
};

// ---------------------- ADD TO WISHLIST ----------------------
export const addToWishlist = async (
  payload: AddWishlistRequest
): Promise<AddWishlistResponse> => {
  const res = await api.post<AddWishlistResponse>("/wishlist/", payload);
  return res.data;
};

// ---------------------- REMOVE ONE ITEM ----------------------
export const removeFromWishlist = async (
  productId: number
): Promise<RemoveWishlistResponse> => {
  const res = await api.delete<RemoveWishlistResponse>(
    `/wishlist/${productId}`
  );
  return res.data;
};

// ---------------------- CLEAR ENTIRE WISHLIST ----------------------
export const clearWishlist = async (): Promise<ClearWishlistResponse> => {
  const res = await api.delete<ClearWishlistResponse>("/wishlist/");
  return res.data;
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
