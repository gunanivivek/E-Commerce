import API from "./axiosInstance";
import type { Category } from "../types/category";

// Fetch all categories
export const getAllCategories = async (): Promise<Category[]> => {
  const res = await API.get("/category/");
  return res.data;
};

export const createCategory = async (formData: FormData): Promise<Category> => {
  const res = await API.post("/category/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateCategory = async (
  id: number,
  formData: FormData
): Promise<Category> => {
  const res = await API.patch(`/category/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteCategory = async (id: number): Promise<{ message: string }> => {
  const res = await API.delete(`/category/${id}`);
  return res.data;
};

