// ---------------------- Cart Item ----------------------
// Represents an individual item in the cart
export interface CartItem {
  product_id: number;
  name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  image_url: string | undefined;
}

// ---------------------- Full Cart Response ----------------------
// Represents the entire cart returned by the backend
export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon: string | null;
}

// ---------------------- Add to Cart ----------------------
// Request body for adding an item
export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

// Response returned after adding an item
export interface AddToCartResponse {
  message: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: string | null;
}

// ---------------------- Update Cart Quantity ----------------------
export interface UpdateCartQuantityRequest {
  product_id: number;
  quantity: number;
}

// Response returned after updating quantity (same as AddToCartResponse)
export type UpdateCartQuantityResponse = AddToCartResponse;

// ---------------------- Remove Item from Cart ----------------------
export interface RemoveFromCartRequest {
  product_id: number;
}

// Response returned after removing an item (same as AddToCartResponse)
export type RemoveFromCartResponse = AddToCartResponse;

// ---------------------- Clear Cart ----------------------
// Response returned after clearing the cart
export type ClearCartResponse = AddToCartResponse;
