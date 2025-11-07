export interface ProductImageResponse {
  id: number;
  product_id: number;
  url: string;
  position: number;
  created_at: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description?: string | null;
  slug?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string | null;
  image_url?: string | null;
}

export interface ProductResponse {
  id: number;
  name: string;
  description?: string | null;
  price: string; // API provides price as string
  discount_price?: string | null;
  stock: number;
  sku?: string | null;
  slug: string;
  category: CategoryResponse;
  is_featured: boolean;
  status: string;
  is_active: boolean;
  images?: ProductImageResponse[];
  seller_id: number;
  created_at: string;
  updated_at?: string | null;
}

// (no default export - use named exports)
