// src/api/addressApi.ts
import type { Address } from "../types/Address";
import API from "./axiosInstance";


// Fetch all addresses
export const getAllAddresses = async (): Promise<Address[]> => {
  const res = await API.get("/user/addresses/");
  return res.data;
};

//  CREATE address
export const createAddress = async (data: Address): Promise<Address> => {
  const res = await API.post("/user/addresses/", data); 
  return res.data;
};

// UPDATE address
export const updateAddress = async (
  id: number,
  data: Address
): Promise<Address> => {
  const res = await API.put(`/user/addresses/${id}`, data);
  return res.data;
};

//  DELETE address
export const deleteAddress = async (
  id: number
): Promise<{ message: string }> => {
  const res = await API.delete(`/user/addresses/${id}`);
  return res.data;
};
