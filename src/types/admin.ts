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

// ------------------- Order Address Type -------------------
export interface OrderAddress {
  id: number;
  full_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// ------------------- Order Item Product (Minimal Product Reference) -------------------
export interface OrderItemProduct {
  name: string;
  sku: string | null;
}

// ------------------- Order Item Type -------------------
export interface OrderItem {
  id: number;
  product: OrderItemProduct;
  seller_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: string;
}

// ------------------- Order Type -------------------
export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_method: "cod" | "online";
  created_at: string;
  updated_at: string | null;
  address: OrderAddress;
  items: OrderItem[];
}

// ------------------- Orders Response Type -------------------
export interface OrdersResponse {
  orders: Order[];
}
