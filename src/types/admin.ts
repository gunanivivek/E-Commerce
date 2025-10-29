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
}

// ------------------- Customer Type -------------------
export interface Customer {
  id: number;
  full_name: string;
  email: string ;
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
  price: number;
  stock: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  seller_id: number;
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

export interface ErrorResponse {
  detail: string;
}
