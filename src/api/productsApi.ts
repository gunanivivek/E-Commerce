import API from "./axiosInstance";
import type { ProductResponse } from "../types/product";

export const getProducts = async (
  params?: Record<string, unknown>
): Promise<ProductResponse[]> => {
  const res = await API.get<ProductResponse[]>("products/approved/", { params });
  return res.data;
};

export const getProductById = async (id: number): Promise<ProductResponse> => {
  const res = await API.get<ProductResponse>(`products/${id}/`);
  return res.data;
};

export const getProductsByCategory = async (
  category: string
): Promise<ProductResponse[]> => {
  const res = await API.get<ProductResponse[]>(`products/category/${category}/`);
  return res.data;
};

export const getNewArrivals = async (
  params?: Record<string, unknown>
): Promise<ProductResponse[]> => {
  const res = await API.get<ProductResponse[]>("products/new-arrivals/", { params });
  return res.data;
};

export const searchProducts = async (query: string): Promise<ProductResponse[]> => {
  const res = await API.get<ProductResponse[]>(`products/search/`, {
    params: { q: query },
  });
  return res.data;
};

export default {
  getProducts,
  getProductById,
  getProductsByCategory,
  getNewArrivals,
  searchProducts,
};
