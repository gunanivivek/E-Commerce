import API from "./axiosInstance";
import type { Seller, Customer,Product, Order } from "../types/admin";

// Fetch all sellers
export const getAllSellers = async (): Promise<Seller[]> => {
  const res = await API.get("/sellers/");
  return res.data;
};


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

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await API.get("/products/");
  return res.data;
};

export const updateProductStatus = async (
  product_id: number,
  status: "approved" | "rejected"
) => {
  const formData = new URLSearchParams();
  formData.append("status", status);

  const res = await API.patch(
    `/products/${product_id}/status`,
    formData,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  
  return res.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const res = await API.get("/admin/orders");
  return res.data;
};

export const toggleSellerBlockStatus = async (id: number): Promise<Seller> => {
  const res = await API.patch(`/sellers/${id}/toggle-block`);
  return res.data;
};
