import API from "./axiosInstance";
import type { Category } from "../types/category";

// Fetch all categories
export const getAllCategories = async (): Promise<Category[]> => {
  const res = await API.get("/category/");
  return res.data;
};

// // Fetch single category by ID
// export const getCategoryById = async (id: number): Promise<Category> => {
//   const res = await API.get(`/categories/${id}/`);
//   return res.data;
// };

// // Create new category
// export const createCategory = async (data: FormData): Promise<Category> => {
//   const res = await API.post("/categories/", data, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return res.data;
// };

// // Update category by ID
// export const updateCategory = async (
//   id: number,
//   data: FormData
// ): Promise<Category> => {
//   const res = await API.put(`/categories/${id}/`, data, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return res.data;
// };

// // Delete category by ID
// export const deleteCategory = async (id: number): Promise<{ message: string }> => {
//   const res = await API.delete(`/categories/${id}/`);
//   return res.data;
// };
