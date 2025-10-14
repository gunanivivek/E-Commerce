import API from "./axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../types/auth";

export const signupUser = async (data: SignupRequest): Promise<SignupResponse> => {
  const res = await API.post("/signup", data);
  return res.data;
};

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const res = await API.post("/login", credentials);
  return res.data;
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const res = await API.post("/forgot-password", data);
  return res.data;
};
