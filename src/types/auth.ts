export type UserRole = "buyer" | "seller";

//LOGIN
export interface LoginRequest {
    email: string;
    password: string;
    role: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

//SIGNUP
export interface SignupRequestBase {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}


export interface BuyerSignupRequest extends SignupRequestBase {
  phone?: string;
}


export interface SellerSignupRequest extends SignupRequestBase {
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
