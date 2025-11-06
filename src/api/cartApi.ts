import API from "./axiosInstance";
import type {
  CartOut,
  AddItemRequest,
  AddItemResponse,
  UpdateItemRequest,
} from "../types/cart";

export const getCart = async (): Promise<CartOut> => {
  const res = await API.get<CartOut>("cart/");
  return res.data;
};

export const addToCart = async (payload: AddItemRequest): Promise<AddItemResponse> => {
  const res = await API.post<AddItemResponse>("cart/add", payload);
  return res.data;
};

export const updateCart = async (payload: UpdateItemRequest): Promise<AddItemResponse> => {
  const res = await API.put<AddItemResponse>("cart/update", payload);
  return res.data;
};

export const removeFromCart = async (productId: number): Promise<AddItemResponse> => {
  const res = await API.delete<AddItemResponse>(`cart/remove/${productId}`);
  return res.data;
};

export const clearCart = async (): Promise<CartOut> => {
  const res = await API.delete<CartOut>("cart/clear");
  return res.data;
};

export const applyCoupon = async (code: string): Promise<CartOut> => {
  const res = await API.post<CartOut>("cart/apply-coupon", { code });
  return res.data;
};

export default {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
  applyCoupon,
};
