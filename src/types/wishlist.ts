export interface WishlistItemOut {
  product_id: number;
  name: string;
  price: number;
  image_url: string | undefined;
}

export interface WishlistOut {
  items: WishlistItemOut[];
  message: string;
}

export interface WishlistResponse {
  items: WishlistItemOut[];
  subtotal: number;
  discount: number;
  total: number;
  coupon: string | null;
}
export interface AddWishlistRequest {
  product_id: number;
}

export type AddWishlistResponse = WishlistOut;
export interface RemoveWishlistRequest {
  product_id: number;
}

export type RemoveWishlistResponse = AddWishlistResponse;

export type ClearWishlistResponse = AddWishlistResponse;
