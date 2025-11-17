export interface WishlistItemOut {
  product_id: number;
  name: string;
  price: number;
  image_url?: string | null;
}

export interface WishlistOut {
  items: WishlistItemOut[];
}

export interface AddWishlistRequest {
  product_id: number;
}

export type AddWishlistResponse = WishlistOut;
