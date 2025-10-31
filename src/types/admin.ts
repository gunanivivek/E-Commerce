// ------------------- Seller Type -------------------
export interface Seller {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  store_name: string | null;
  store_address: string | null;
  is_active: boolean;
  is_blocked: boolean;
  profile_picture: string | null;
  created_at: string;
  store_description: string | null;
}

// ------------------- Customer Type -------------------
export interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  is_blocked: boolean;
  profile_picture: string | null;
  role: "customer";
  created_at: string;
  updated_at: string;
}

// ------------------- Product Type -------------------
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string; 
  discount_price: string;
  stock: number;
  sku: string;
  slug: string;
  category: Category;
  is_featured: boolean;
  status: string;
  is_active: boolean;
  images: ProductImage[];
  seller_id: number;
  created_at: string;
  updated_at: string;
}

// ------------------- Category Type -------------------
export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

// ------------------- Product Image Type -------------------
export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  position: number;
  created_at: string;
}

// ------------------- Admin State Types -------------------
export interface AdminState {
  sellers: Seller[];
  customers: Customer[];
  loading: boolean;
  error: string | null;

  setSellers: (sellers: Seller[] | ((prev: Seller[]) => Seller[])) => void;
  setCustomers: (customers: Customer[] | ((prev: Customer[]) => Customer[])) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAdminData: () => void;
}

// ------------------- API Response Types -------------------
export interface SellersResponse {
  sellers: Seller[];
}

export interface CustomersResponse {
  customers: Customer[];
}

export interface ProductsResponse {
  products: Product[];
}

export interface ErrorResponse {
  detail: string;
}
