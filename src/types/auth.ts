


export interface LoginRequest {
    email: string;
    password: string;
}

export type UserRole = "admin" | "seller" | "customer";

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  profile_picture: string | null;
  is_active: boolean;
  is_blocked: boolean;
}

export interface LoginResponse {
  user: User;
  message: string;
}


export interface BuyerSignupRequest {
  full_name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
}


export interface SellerSignupRequest {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  store_name: string;
  store_address: string;
}

export type SignupRequest = BuyerSignupRequest | SellerSignupRequest;


export interface SignupResponse {
  user: {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    role: "customer" | "seller" | "admin";
    profile_picture: string | null;
    is_active: boolean;
    is_blocked: boolean;
  };
  message: string;
}



export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string; 
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message?: string; 
  detail?: string;  
}