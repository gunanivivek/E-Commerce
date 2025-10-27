import API from "./axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  BuyerSignupRequest,
  SellerSignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ChangePasswordResponse,
  ChangePasswordRequest,
} from "../types/auth";

export const signupUser = async (
  data: BuyerSignupRequest
): Promise<SignupResponse> => {
  const res = await API.post("users/register", data);
  return res.data;
};

export const signupSeller = async (
  data: SellerSignupRequest
): Promise<SignupResponse> => {
  const res = await API.post("sellers/register", data);
  return res.data;
};

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const res = await API.post("auth/login", credentials);
  return res.data;
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const res = await API.post("auth/forget-password", data);
  return res.data;
};

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const res = await API.patch("auth/change-password", data);
  return res.data;
};
  