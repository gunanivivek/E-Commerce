import API from "./axiosInstance";
import type { Seller, Customer } from "../types/admin";

// Fetch all sellers
export const getAllSellers = async (): Promise<Seller[]> => {
  const res = await API.get("/sellers/");
  return res.data;
};

//  Update seller active status (approve / reject)
export const updateSellerStatus = async (
  id: number,
  status: string
): Promise<Seller> => {
  const res = await API.patch(`/sellers/${id}/status?status=${status}`);
  return res.data;
};

//  Fetch all customers
export const getAllCustomers = async (): Promise<Customer[]> => {
  const res = await API.get("/users/");
  return res.data;
};

// Upload profile picture
export const uploadProfilePicture = async (
  formData: FormData
): Promise<{ message: string; image_url: string }> => {
  const res = await API.post("/profile/upload-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
