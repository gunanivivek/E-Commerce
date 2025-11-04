import type { Product } from "./useProductStore";
import { DEMO_PRODUCTS } from "../data/demoProducts";

export const fetchProductById = async (id: number): Promise<Product> => {
  // mock API simulation
  await new Promise((r) => setTimeout(r, 500));
  const product = DEMO_PRODUCTS.find((p) => p.id === id);
  if (!product) throw new Error("Product not found");
  return product;
};
