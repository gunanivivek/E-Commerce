import API from "./axiosInstance";
import type { Seller, Customer } from "../types/admin";

// ✅ Fetch all sellers
export const getAllSellers = async (): Promise<Seller[]> => {
  const res = await API.get("/sellers/", { withCredentials: true });
  return res.data;
};

// ✅ Fetch all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
  const res = await API.get("/users/", { withCredentials: true });
  return res.data;
};
