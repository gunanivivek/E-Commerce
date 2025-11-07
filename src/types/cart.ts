export interface CartItemOut {
  product_id: number;
  name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  image_url?: string | null;
}

export interface CartOut {
  items: CartItemOut[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string | null;
}

export interface AddItemRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateItemRequest {
  product_id: number;
  quantity: number;
}

export interface AddItemResponse {
  message: string;
  items: CartItemOut[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string | null;
}

// Reuse AddItemResponse for update/remove responses; no extra fields needed.
export type UpdateItemResponse = AddItemResponse;
export type RemoveItemResponse = AddItemResponse;

// Use named exports only
