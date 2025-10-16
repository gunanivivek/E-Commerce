export type UserRole = "buyer" | "seller";

//LOGIN
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole; 
  };
  store?: {
    id: string;
    name: string;
    status: "pending" | "active";
  };
}

//SIGNUP
export interface BuyerSignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone?: string;
}


export interface SellerSignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone: string;
  storeName: string;
  businessAddress: string;
}

export type SignupRequest = BuyerSignupRequest | SellerSignupRequest;


export interface SignupResponse {
  id: string;
  email: string;
  role: UserRole;
  access_token: string;
  token_type: string;
}

// FORGOT PASSWORD
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string; //Password reset email sent
}
