import API from "./axiosInstance";
import type { ProductResponse } from "../types/product";

export const getProducts = async (params?: Record<string, unknown>): Promise<ProductResponse[]> => {
  const res = await API.get<ProductResponse[]>("products/", { params });
  return res.data;
};

export const getProductById = async (id: number): Promise<ProductResponse> => {
  const res = await API.get<ProductResponse>(`products/${id}/`);
  return res.data;
};

export default {
  getProducts,
  getProductById,
};
