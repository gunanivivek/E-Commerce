import api from "./axiosInstance"; 
import type {
  CartResponse,
  AddToCartRequest,
  AddToCartResponse,
  UpdateCartQuantityRequest,
  UpdateCartQuantityResponse,
  RemoveFromCartRequest,
  RemoveFromCartResponse,
  ClearCartResponse,
} from "../types/cart";

// ---------------------- GET CART ----------------------
export const getCart = async (): Promise<CartResponse> => {
  const res = await api.get<CartResponse>("/cart/");
  return res.data;
};

// ---------------------- ADD TO CART ----------------------
export const addToCart = async (payload: AddToCartRequest): Promise<AddToCartResponse> => {
  const res = await api.post<AddToCartResponse>("/cart/add", payload);
  return res.data;
};

// ---------------------- UPDATE CART ITEM QUANTITY ----------------------
export const updateCartQuantity = async (
  payload: UpdateCartQuantityRequest
): Promise<UpdateCartQuantityResponse> => {
  const res = await api.put<UpdateCartQuantityResponse>("/cart/update", payload);
  return res.data;
};

// ---------------------- REMOVE ITEM FROM CART ----------------------
  export const removeFromCart = async (
    payload: RemoveFromCartRequest
  ): Promise<RemoveFromCartResponse> => {
    const res = await api.delete<RemoveFromCartResponse>(`/cart/remove/${payload.product_id}`);
    return res.data;
  };

// ---------------------- CLEAR CART ----------------------
export const clearCart = async (): Promise<ClearCartResponse> => {
  const res = await api.delete<ClearCartResponse>("/cart/clear");
  return res.data;
};

export const applyCoupon = async (code: string): Promise<CartResponse> => {
  const res = await api.post("/cart/apply-coupon", { code });
  return res.data;
};
