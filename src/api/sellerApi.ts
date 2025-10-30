import type { BulkUploadRequest, CreateProductRequest } from "../types/seller";
import API from "./axiosInstance";
// import type {
//   Product,
//   ProductRequest,
//   ProductUpdateRequest,
// } from "../types/seller";

// Create new product
export const createProduct = async (data: CreateProductRequest) => {
  const formData = new FormData();

  // Append all fields
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", data.price.toString());
  formData.append("stock", data.stock.toString());
  formData.append("category", data.category);
  data.images.forEach((file) => formData.append("images", file)); 

  const res = await API.post("products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const bulkUploadProducts = async (data: BulkUploadRequest) => {
  const formData = new FormData();
  formData.append("file", data.file);

  const res = await API.post("products/bulk-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// // ✅ Get all products for the logged-in seller
// export const getSellerProducts = async (): Promise<Product[]> => {
//   const res = await API.get("products/my-products");
//   return res.data;
// };

// // ✅ Get product details by ID
// export const getProductById = async (id: number): Promise<Product> => {
//   const res = await API.get(`products/${id}`);
//   return res.data;
// };

// // ✅ Update product
// export const updateProduct = async (
//   id: number,
//   data: ProductUpdateRequest
// ): Promise<Product> => {
//   const res = await API.patch(`products/${id}`, data);
//   return res.data;
// };

// ✅ Delete product
export const deleteProduct = async (
  id: number
): Promise<{ message: string }> => {
  const res = await API.delete(`products/${id}`);
  return res.data;
};

// export const getSellerById = async (id: string): Promise<Seller> => {
//   const res = await API.get(`sellers/${id}`);
//   return res.data;
// };

// export const updateSeller = async (
//   id: string,
//   data: SellerUpdateRequest
// ): Promise<Seller> => {
//   const res = await API.patch(`sellers/${id}`, data);
//   return res.data;
// };

// export const deleteSeller = async (id: string): Promise<{ message: string }> => {
//   const res = await API.delete(`sellers/${id}`);
//   return res.data;
// };
